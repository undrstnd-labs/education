import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

export const runtime = "edge";

const groq = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY!,
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  const markdownSystemMessage = {
    role: "system",
    content: "Respond in Markdown format.",
  };
  const updatedMessages = [markdownSystemMessage, ...messages];

  const response = await groq.chat.completions.create({
    model: "mixtral-8x7b-32768",
    stream: true,
    messages: updatedMessages,
    max_tokens: 2244,
    temperature: 0.2,
    top_p: 0.8,
  });

  const stream = OpenAIStream(response);

  return new StreamingTextResponse(stream);
}
