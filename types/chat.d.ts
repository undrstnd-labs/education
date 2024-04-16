import { Message } from "ai";

export interface Chat extends Record<string, any> {
  id: string;
  title: string;
  studentId: string;
  path: string;
  messages: Message[];
  sharePath?: string;
  createdAt: Date;
}
