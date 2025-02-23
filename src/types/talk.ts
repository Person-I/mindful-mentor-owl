
export interface Message {
  content: string;
  role: 'user' | 'assistant';
}

export interface Talk {
  id: string;
  content: Message[];
  created_at?: string;
}


export type CreateTalkInput = Talk;
export type UpdateTalkInput = Talk;
