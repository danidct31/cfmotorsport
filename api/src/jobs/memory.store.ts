import { ListKind } from '@prisma/client';
import { randomUUID } from 'crypto';

export type MemItem = {
  id: string;
  kind: ListKind;
  text: string;
  checked: boolean;
  dueDate: Date | null;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
};

export type MemNote = {
  id: string;
  parentId: string;
  text: string;
  checked: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export class MemoryStore {
  items: MemItem[] = [];
  notes: MemNote[] = [];

  createItem(kind: ListKind, text: string): MemItem {
    const now = new Date();
    const item: MemItem = {
      id: randomUUID(),
      kind,
      text,
      checked: false,
      dueDate: null,
      priority: 3,
      createdAt: now,
      updatedAt: now,
    };
    this.items.push(item);
    return item;
  }

  createNote(parentId: string, text: string): MemNote {
    const now = new Date();
    const note: MemNote = {
      id: randomUUID(),
      parentId,
      text,
      checked: false,
      createdAt: now,
      updatedAt: now,
    };
    this.notes.push(note);
    return note;
  }
}

export const memoryStore = new MemoryStore();
