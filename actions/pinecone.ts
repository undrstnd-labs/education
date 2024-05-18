"use server"

import { OpenAIEmbeddings } from "@langchain/openai"
import { PineconeStore } from "@langchain/pinecone"
import { PDFLoader } from "langchain/document_loaders/fs/pdf"

import { type FileUpload } from "@/types/file"

import { pinecone } from "@/lib/pinecone"

export async function vectorizedDocument(id: string, uploadedFile: FileUpload) {
  const fileCached = await fetch(uploadedFile.url).then((res) => res.blob())
  const loader = new PDFLoader(fileCached)
  const pageLevelDocs = await loader.load()

  const pineconeIndex = pinecone.Index("undrstnd")

  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY!,
  })

  await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
    pineconeIndex,
    namespace: id,
  })
}
