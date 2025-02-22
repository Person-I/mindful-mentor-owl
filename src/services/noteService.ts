
import { Note } from "@/types/note";

// Mock data
let notes: Note[] = [
  {
    id: "1",
    title: "Welcome to PersonAI Notes",
    content: "# Welcome!\n\nThis is your first note. You can edit it or create new ones.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const noteService = {
  async getNotes(): Promise<Note[]> {
    await delay(500);
    return [...notes];
  },

  async getNote(id: string): Promise<Note> {
    await delay(300);
    const note = notes.find(n => n.id === id);
    if (!note) throw new Error("Note not found");
    return { ...note };
  },

  async createNote(data: Omit<Note, "id" | "createdAt" | "updatedAt">): Promise<Note> {
    await delay(500);
    const note: Note = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    notes = [note, ...notes];
    return note;
  },

  async updateNote(id: string, data: Partial<Omit<Note, "id" | "createdAt">>): Promise<Note> {
    await delay(500);
    const index = notes.findIndex(n => n.id === id);
    if (index === -1) throw new Error("Note not found");
    
    const updatedNote = {
      ...notes[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    notes[index] = updatedNote;
    return { ...updatedNote };
  },

  async deleteNote(id: string): Promise<void> {
    await delay(500);
    const index = notes.findIndex(n => n.id === id);
    if (index === -1) throw new Error("Note not found");
    notes = notes.filter(n => n.id !== id);
  },
};
