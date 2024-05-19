import { OpenAIEmbeddings } from "@langchain/openai"
import { PineconeStore } from "@langchain/pinecone"
import { OpenAIStream, StreamingTextResponse } from "ai"
import OpenAI from "openai"

import { pinecone } from "@/lib/pinecone"
import { db } from "@/lib/prisma"

const groq = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY!,
})

export async function POST(req: Request) {
  const json = await req.json()
  const { messages, id, studentId } = json
  let pineconeId = id

  const conversation = await db.conversation.findUnique({
    where: { id },
    select: {
      file: {
        select: {
          postId: true,
          id: true,
        },
      },
    },
  })

  if (conversation?.file?.postId) {
    pineconeId = conversation.file.id
  }

  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
  })

  const pineconeIndex = pinecone.Index("undrstnd")
  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
    namespace: pineconeId,
  })

  const results = await vectorStore.similaritySearch(
    messages[messages.length - 1].content,
    4
  )

  const tunedMessages: OpenAI.ChatCompletionMessageParam[] = [
    {
      role: "assistant",
      content:
        "You are Undrstnd, a helpful assistant that specializes in helping students understand their course content and answering their questions. You can also provide explanations for documents they upload or refer to. Always respond in the same language as the student's input. Use markdown format to provide clear and organized responses. If you don't know the answer, admit it and offer to help find more information.",
    },
    {
      role: "user",
      content: `Question: ${messages[messages.length - 1].content}

        Previous conversation:
        -------
      ${messages
        ?.slice(Math.max(0, messages.length - 6), -1)
        .map((message: any) => {
          if (message.role === "user") return `User: ${message.content}\n`
          return `Undrstnd: ${message.content}\n`
        })
        .join("")}
        -------

        Context (if available):
        -------
          ${results.map((r) => r.pageContent).join("\n\n")}
        -------

        Answer in markdown format, using the context provided and the user's question. If you don't know the answer, be honest and offer to help find more information.
        
        User input: ${messages[messages.length - 1].content}`,
    },
  ]

  const response = await groq.chat.completions.create({
    model: "mixtral-8x7b-32768",
    stream: true,
    messages: tunedMessages,
    max_tokens: 32000,
    temperature: 0.7,
    top_p: 0.9,
    frequency_penalty: 0,
    presence_penalty: 0,
  })

  const stream = OpenAIStream(response, {
    async onCompletion(completion) {
      await db.conversation.upsert({
        where: { id },
        update: {
          title: messages[0].content.substring(0, 100),
          student: { connect: { id: studentId } },
          messages: {
            create: [
              messages[messages.length - 1],
              {
                role: "assistant",
                content: completion,
              },
            ].map((message: any) => ({
              content: message.content,
              role: message.role === "user" ? "USER" : "AI",
            })),
          },
          updatedAt: new Date(),
        },

        create: {
          id,
          title: messages[0].content.substring(0, 100),
          student: { connect: { id: studentId } },
          path: `/chat/c/${id}`,
          messages: {
            create: [
              messages[messages.length - 1],
              {
                role: "assistant",
                content: completion,
              },
            ].map((message: any) => ({
              content: message.content,
              role: message.role === "user" ? "USER" : "AI",
            })),
          },
        },
      })
    },
  })

  return new StreamingTextResponse(stream)
}
