
export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  created_at: string;
}

export interface Talk {
  id: string;
  title: string;
  messages: Message[];
  created_at: string;
  updated_at: string;
}

export type CreateTalkInput = Pick<Talk, 'title'>;
export type UpdateTalkInput = Partial<Pick<Talk, 'title'>>;
