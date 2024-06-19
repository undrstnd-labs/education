import { OpenAIEmbeddings } from "@langchain/openai"
import { PineconeStore } from "@langchain/pinecone"
import { OpenAIStream, StreamingTextResponse } from "ai"
import OpenAI from "openai"

import { locales } from "@/config/locale"
import { pinecone } from "@/lib/pinecone"
import { db } from "@/lib/prisma"

const groq = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY!,
})

async function getTunedMessages(
  lang: (typeof locales)[number],
  messages: OpenAI.ChatCompletionMessageParam[],
  results: any[]
): Promise<OpenAI.ChatCompletionMessageParam[]> {
  const assistantMessage = {
    en: "You are Undrstnd, a helpful assistant that specializes in helping students understand their course content and answering their questions. You can also provide explanations for documents they upload or refer to. Always respond in the same language as the student's input. Use markdown format to provide clear and organized responses. If you don't know the answer, admit it and offer to help find more information.",
    fr: "Vous êtes Undrstnd, un assistant utile qui se spécialise dans l'aide aux étudiants à comprendre leur contenu de cours et à répondre à leurs questions. Vous pouvez également fournir des explications pour les documents qu'ils téléchargent ou auxquels ils font référence. Répondez toujours dans la même langue que l'entrée de l'étudiant. Utilisez le format markdown pour fournir des réponses claires et organisées. Si vous ne connaissez pas la réponse, admettez-le et offrez d'aider à trouver plus d'informations.",
  }

  const userMessage = {
    en: `Question: ${messages[messages.length - 1].content}

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
    fr: `Question: ${messages[messages.length - 1].content}

        Conversation précédente:
        -------
      ${messages
        ?.slice(Math.max(0, messages.length - 6), -1)
        .map((message: any) => {
          if (message.role === "user")
            return `Utilisateur: ${message.content}\n`
          return `Undrstnd: ${message.content}\n`
        })
        .join("")}
        -------

        Contexte (si disponible):
        -------
          ${results.map((r) => r.pageContent).join("\n\n")}
        -------

        Répondez en format markdown, en utilisant le contexte fourni et la question de l'utilisateur. Si vous ne connaissez pas la réponse, soyez honnête et offrez d'aider à trouver plus d'informations.

        Entrée utilisateur: ${messages[messages.length - 1].content}`,
  }

  const tunedMessages: OpenAI.ChatCompletionMessageParam[] = [
    {
      role: "assistant",
      content: assistantMessage[lang],
    },
    {
      role: "user",
      content: userMessage[lang],
    },
  ]

  return tunedMessages
}

export async function POST(req: Request) {
  const json = await req.json()
  const { id, studentId, messages, lang } = json
  let pineconeId = id

  const conversation = await db.conversation.findUnique({
    where: { id: pineconeId },
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

  const tunedMessages = await getTunedMessages(lang, messages, results)

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
