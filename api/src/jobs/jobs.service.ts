import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ListKind } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { memoryStore } from './memory.store';

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
      return memoryStore.items
        .filter((i) => i.kind === kind)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
    return this.prisma.jobItem.findMany({
      where: { kind },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(kindParam: string, text?: string) {
    if (!text?.trim()) throw new BadRequestException('text is required');
    const kind = this.kindFromPath(kindParam);
    if (!this.prisma.connected) {
      return memoryStore.createItem(kind, text.trim());
    }
    return this.prisma.jobItem.create({
      data: { kind, text: text.trim() },
    });
  }

  async update(
    id: string,
    data: { text?: string; checked?: boolean },
  ) {
    if (data.text === undefined && data.checked === undefined) {
      throw new BadRequestException('Nothing to update');
    }
    if (!this.prisma.connected) {
      const item = memoryStore.items.find((i) => i.id === id);
      if (!item) throw new NotFoundException('Item not found');
      if (data.text !== undefined) item.text = data.text;
      if (data.checked !== undefined) item.checked = data.checked;
      item.updatedAt = new Date();
      return item;
    }
    try {
      return await this.prisma.jobItem.update({
        where: { id },
        data: {
          ...(data.text !== undefined ? { text: data.text } : {}),
          ...(data.checked !== undefined ? { checked: data.checked } : {}),
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
