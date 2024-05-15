import Image from "next/image"
import { Student, User } from "@prisma/client"
import { Message } from "ai"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"

import { cn } from "@/lib/utils"

import { MemoizedReactMarkdown } from "@/components/config/Markdown"
import { Logo } from "@/components/icons/Overall"
import { ChatMessageActions } from "@/components/showcase/ChatMessageActions"
import { CodeBlock } from "@/components/ui/Codeblock"

interface ChatMessageProps {
  message: Message
  student: Student & { user: User }
}

export function ChatMessage({ message, student, ...props }: ChatMessageProps) {
  return (
    <div className={cn("group relative mb-4 flex items-start")} {...props}>
      <div
        className={cn(
          "flex size-8 shrink-0 select-none items-center justify-center rounded-full border shadow",
          message.role === "user"
            ? "bg-background"
            : "bg-primary text-primary-foreground"
        )}
      >
        {message.role === "user" ? (
          <Image
            src={student.user.image!}
            alt={student.user.email!}
            width={32}
            height={32}
            className="rounded-full"
          />
        ) : (
          <Logo />
        )}
      </div>
      <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
        <MemoizedReactMarkdown
          className="prose dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 break-words"
          remarkPlugins={[remarkGfm, remarkMath]}
          components={{
            p({ children }) {
              return <p className="mb-2 last:mb-0">{children}</p>
            },
            //@ts-ignore: Property 'children' does not exist on type 'never'
            code({ node, inline, className, children, ...props }) {
              if (children) {
                const firstChild = children as string

                if (firstChild === "▍") {
                  return (
                    <span className="mt-1 animate-pulse cursor-default">▍</span>
                  )
                }

                const modifiedChildren = firstChild.replace("`▍`", "▍")

                const match = /language-(\w+)/.exec(className || "")

                //@ts-ignore: Property 'split' does not exist on type 'string'
                if (inline || !match || children.split("\n").length === 1) {
                  return (
                    <code
                      className={cn(
                        "rounded-sm  bg-black bg-zinc-800/80 px-1 py-0.5 font-mono text-xs text-zinc-100 ",
                        className
                      )}
                      {...props}
                    >
                      {modifiedChildren}
                    </code>
                  )
                }

                return (
                  <CodeBlock
                    key={Math.random()}
                    language={(match && match[1]) || ""}
                    value={String(modifiedChildren).replace(/\n$/, "")}
                    {...props}
                  />
                )
              }
            },
            h1({ children }) {
              return <h1 className="my-4 text-3xl font-bold">{children}</h1>
            },
            h2({ children }) {
              return <h2 className="my-4 text-2xl font-bold">{children}</h2>
            },
            h3({ children }) {
              return <h3 className="my-4 text-xl font-bold">{children}</h3>
            },
            h4({ children }) {
              return <h4 className="my-4 text-lg font-bold">{children}</h4>
            },
            h5({ children }) {
              return <h5 className="my-4 text-base font-bold">{children}</h5>
            },
            h6({ children }) {
              return <h6 className="my-4 text-sm font-bold">{children}</h6>
            },
            ul({ children }) {
              return <ul className="list-disc py-0.5 pl-6">{children}</ul>
            },
            ol({ children }) {
              return <ol className="list-decimal py-0.5 pl-6">{children}</ol>
            },
            li({ children }) {
              return <li className="my-2 last:mb-0">{children}</li>
            },
            blockquote({ children }) {
              return (
                <blockquote className="border-l-2 border-zinc-300 pl-4 italic">
                  {children}
                </blockquote>
              )
            },
            pre({ children }) {
              return (
                <pre className="rounded-md bg-zinc-800 p-4">{children}</pre>
              )
            },
            a({ children, href }) {
              return (
                <a
                  className="text-blue-500 hover:underline"
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              )
            },
            img({ src, alt }) {
              return <img className="rounded-md" src={src} alt={alt} />
            },
            table({ children }) {
              return (
                <table className="w-full border-collapse">{children}</table>
              )
            },
            thead({ children }) {
              return <thead className="border-b">{children}</thead>
            },
            hr() {
              return <hr className="my-4 border-t border-zinc-300" />
            },
          }}
          {...props}
        >
          {message.content}
        </MemoizedReactMarkdown>
        <ChatMessageActions message={message} />
      </div>
    </div>
  )
}
