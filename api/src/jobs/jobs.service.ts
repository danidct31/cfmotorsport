import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ListKind } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { memoryStore } from './memory.store';

export type JobPatch = {
  text?: string;
  checked?: boolean;
  dueDate?: string | null;
  priority?: number;
};

function parseDueDate(value?: string | null): Date | null | undefined {
  if (value === undefined) return undefined;
  if (value === null || value === '') return null;
  const date = new Date(`${value}T12:00:00.000Z`);
  if (Number.isNaN(date.getTime())) {
    throw new BadRequestException('dueDate must be YYYY-MM-DD');
  }
  return date;
}

function parsePriority(value?: number): number | undefined {
  if (value === undefined) return undefined;
  if (![1, 2, 3].includes(value)) {
    throw new BadRequestException('priority must be 1, 2, or 3');
  }
  return value;
}

function sortJobs<T extends { priority: number; dueDate: Date | null; createdAt: Date }>(
  items: T[],
) {
  return [...items].sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    if (a.dueDate && b.dueDate) {
      return a.dueDate.getTime() - b.dueDate.getTime();
    }
    if (a.dueDate && !b.dueDate) return -1;
    if (!a.dueDate && b.dueDate) return 1;
    return b.createdAt.getTime() - a.createdAt.getTime();
  });
}

@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaService) {}

  private kindFromPath(kind: string): ListKind {
    const map: Record<string, ListKind> = {
      primary: ListKind.PRIMARY,
      weekly: ListKind.WEEKLY,
      todo: ListKind.TODO,
      desk: ListKind.DESK,
    };
    const value = map[kind];
    if (!value) throw new BadRequestException(`Unknown list kind: ${kind}`);
    return value;
  }

  async list(kindParam: string) {
    const kind = this.kindFromPath(kindParam);
    if (!this.prisma.connected) {
      return sortJobs(memoryStore.items.filter((i) => i.kind === kind));
    }
    const items = await this.prisma.jobItem.findMany({ where: { kind } });
    return sortJobs(items);
  }

  async create(kindParam: string, text?: string) {
    if (!text?.trim()) throw new BadRequestException('text is required');
    const kind = this.kindFromPath(kindParam);
    if (!this.prisma.connected) {
      return memoryStore.createItem(kind, text.trim());
    }
    return this.prisma.jobItem.create({
      data: { kind, text: text.trim(), priority: 3 },
    });
  }

  async update(id: string, data: JobPatch) {
    if (
      data.text === undefined &&
      data.checked === undefined &&
      data.dueDate === undefined &&
      data.priority === undefined
    ) {
      throw new BadRequestException('Nothing to update');
    }

    const dueDate = parseDueDate(data.dueDate);
    const priority = parsePriority(data.priority);

    if (!this.prisma.connected) {
      const item = memoryStore.items.find((i) => i.id === id);
      if (!item) throw new NotFoundException('Item not found');
      if (data.text !== undefined) item.text = data.text;
      if (data.checked !== undefined) item.checked = data.checked;
      if (dueDate !== undefined) item.dueDate = dueDate;
      if (priority !== undefined) item.priority = priority;
      item.updatedAt = new Date();
      return item;
    }
    try {
      return await this.prisma.jobItem.update({
        where: { id },
        data: {
          ...(data.text !== undefined ? { text: data.text } : {}),
          ...(data.checked !== undefined ? { checked: data.checked } : {}),
          ...(dueDate !== undefined ? { dueDate } : {}),
          ...(priority !== undefined ? { priority } : {}),
        },
      });
    } catch {
      throw new NotFoundException('Item not found');
    }
  }

  async remove(id: string) {
    if (!this.prisma.connected) {
      const before = memoryStore.items.length;
      memoryStore.items = memoryStore.items.filter((i) => i.id !== id);
      memoryStore.notes = memoryStore.notes.filter((n) => n.parentId !== id);
      if (memoryStore.items.length === before) {
        throw new NotFoundException('Item not found');
      }
      return { ok: true };
    }
    try {
      await this.prisma.jobNote.deleteMany({ where: { parentId: id } });
      await this.prisma.jobItem.delete({ where: { id } });
      return { ok: true };
    } catch {
      throw new NotFoundException('Item not found');
    }
  }

  async listNotes(parentId: string) {
    if (!this.prisma.connected) {
      return memoryStore.notes
        .filter((n) => n.parentId === parentId)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
    return this.prisma.jobNote.findMany({
      where: { parentId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createNote(parentId: string, text?: string) {
    if (!text?.trim()) throw new BadRequestException('text is required');
    if (!this.prisma.connected) {
      return memoryStore.createNote(parentId, text.trim());
    }
    return this.prisma.jobNote.create({
      data: { parentId, text: text.trim() },
    });
  }

  async updateNote(
    id: string,
    data: { text?: string; checked?: boolean },
  ) {
    if (data.text === undefined && data.checked === undefined) {
      throw new BadRequestException('Nothing to update');
    }
    if (!this.prisma.connected) {
      const note = memoryStore.notes.find((n) => n.id === id);
      if (!note) throw new NotFoundException('Note not found');
      if (data.text !== undefined) note.text = data.text;
      if (data.checked !== undefined) note.checked = data.checked;
      note.updatedAt = new Date();
      return note;
    }
    try {
      return await this.prisma.jobNote.update({
        where: { id },
        data: {
          ...(data.text !== undefined ? { text: data.text } : {}),
          ...(data.checked !== undefined ? { checked: data.checked } : {}),
        },
      });
    } catch {
      throw new NotFoundException('Note not found');
    }
  }

  async removeNote(id: string) {
    if (!this.prisma.connected) {
      const before = memoryStore.notes.length;
      memoryStore.notes = memoryStore.notes.filter((n) => n.id !== id);
      if (memoryStore.notes.length === before) {
        throw new NotFoundException('Note not found');
      }
      return { ok: true };
    }
    try {
      await this.prisma.jobNote.delete({ where: { id } });
      return { ok: true };
    } catch {
      throw new NotFoundException('Note not found');
    }
  }
}
