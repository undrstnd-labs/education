import { Message } from "ai";
import Image from "next/image";
import { User } from "next-auth";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import { cn } from "@lib/utils";

import { Logo } from "@component/icons/Overall";

import { CodeBlock } from "@component/ui/Codeblock";
import { MemoizedReactMarkdown } from "@component/config/Markdown";
import { ChatMessageActions } from "@component/showcase/ChatMessageActions";

interface ChatMessageProps {
  message: Message;
  user: User;
}

export function ChatMessage({ message, user, ...props }: ChatMessageProps) {
  console.log(message);
  return (
    <div
      className={cn("group relative mb-4 flex items-start md:-ml-12")}
      {...props}
    >
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
            src={user.image!}
            alt={user.email!}
            width={32}
            height={32}
            className="rounded-full"
          />
        ) : (
          <Logo />
        )}
      </div>
      <div className="flex-1 px-1 ml-4 space-y-2 overflow-hidden">
        <MemoizedReactMarkdown
          className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
          remarkPlugins={[remarkGfm, remarkMath]}
          components={{
            p({ children }) {
              return <p className="mb-2 last:mb-0">{children}</p>;
            },
            //@ts-ignore: Property 'children' does not exist on type 'never'
            code({ node, inline, className, children, ...props }) {
              if (children) {
                const firstChild = children as string;

                if (firstChild === "▍") {
                  return (
                    <span className="mt-1 cursor-default animate-pulse">▍</span>
                  );
                }

                const modifiedChildren = firstChild.replace("`▍`", "▍");

                const match = /language-(\w+)/.exec(className || "");

                //@ts-ignore: Property 'split' does not exist on type 'string'
                if (inline || !match || children.split("\n").length === 1) {
                  return (
                    <code
                      className={cn(
                        "font-mono text-xs bg-zinc-800/80 text-zinc-100 rounded-sm px-1 py-0.5",
                        className
                      )}
                      {...props}
                    >
                      {modifiedChildren}
                    </code>
                  );
                }

                return (
                  <CodeBlock
                    key={Math.random()}
                    language={(match && match[1]) || ""}
                    value={String(modifiedChildren).replace(/\n$/, "")}
                    {...props}
                  />
                );
              }
            },
            h1({ children }) {
              return <h1 className="text-3xl font-bold mb-4">{children}</h1>;
            },
            h2({ children }) {
              return <h2 className="text-2xl font-bold mb-4">{children}</h2>;
            },
            h3({ children }) {
              return <h3 className="text-xl font-bold mb-4">{children}</h3>;
            },
            h4({ children }) {
              return <h4 className="text-lg font-bold mb-4">{children}</h4>;
            },
            h5({ children }) {
              return <h5 className="text-base font-bold mb-4">{children}</h5>;
            },
            h6({ children }) {
              return <h6 className="text-sm font-bold mb-4">{children}</h6>;
            },
            ul({ children }) {
              return <ul className="list-disc pl-6">{children}</ul>;
            },
            ol({ children }) {
              return <ol className="list-decimal pl-6">{children}</ol>;
            },
            li({ children }) {
              return <li className="mb-2 last:mb-0">{children}</li>;
            },
            blockquote({ children }) {
              return (
                <blockquote className="border-l-2 border-zinc-300 pl-4 italic">
                  {children}
                </blockquote>
              );
            },
            pre({ children }) {
              return (
                <pre className="rounded-md bg-zinc-800 p-4">{children}</pre>
              );
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
              );
            },
            img({ src, alt }) {
              return <img className="rounded-md" src={src} alt={alt} />;
            },
          }}
          {...props}
        >
          {message.content}
        </MemoizedReactMarkdown>
        <ChatMessageActions message={message} />
      </div>
    </div>
  );
}
