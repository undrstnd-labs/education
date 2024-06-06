"use client"

import * as React from "react"
import { Link, usePathname } from "@navigation"
import { AnimatePresence, motion } from "framer-motion"

import { type Chat } from "@/types/chat"

import { cn } from "@/lib/utils"
import { useLocalStorage } from "@/hooks/use-local-storage"

import { ChatSidebarActions } from "@/components/layout/chat-sidebar-actions"
import { Icons } from "@/components/shared/icons"
import { buttonVariants } from "@/components/ui/button"

import { removeChat } from "@/undrstnd/chat"

interface SidebarItemProps {
  index: number
  chat: Chat
  children: React.ReactNode
}

export function SidebarItem({ index, chat, children }: SidebarItemProps) {
  const pathname = usePathname()
  const isActive = pathname === chat.path
  const [newChatId, setNewChatId] = useLocalStorage("newChatId", null)
  const shouldAnimate = index === 0 && isActive && newChatId

  if (!chat?.id) return null

  return (
    <motion.div
      className="relative h-8"
      variants={{
        initial: {
          height: 0,
          opacity: 0,
        },
        animate: {
          height: "auto",
          opacity: 1,
        },
      }}
      initial={shouldAnimate ? "initial" : undefined}
      animate={shouldAnimate ? "animate" : undefined}
      transition={{
        duration: 0.25,
        ease: "easeIn",
      }}
    >
      <Link
        href={`/chat/c/${chat.id}`}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "group w-full px-8 transition-colors hover:bg-zinc-200/40 dark:hover:bg-zinc-300/10",
          isActive && "bg-zinc-200 pr-16 font-semibold dark:bg-zinc-800"
        )}
      >
        <div
          className="relative max-h-5 flex-1 select-none overflow-hidden text-ellipsis break-all"
          title={chat.title}
        >
          <div className="whitespace-nowrap">
            {shouldAnimate ? (
              chat.title.split("").map((character, index) => (
                <motion.span
                  key={index}
                  variants={{
                    initial: {
                      opacity: 0,
                      x: -100,
                    },
                    animate: {
                      opacity: 1,
                      x: 0,
                    },
                  }}
                  initial={shouldAnimate ? "initial" : undefined}
                  animate={shouldAnimate ? "animate" : undefined}
                  transition={{
                    duration: 0.25,
                    ease: "easeIn",
                    delay: index * 0.05,
                    staggerChildren: 0.05,
                  }}
                  onAnimationComplete={() => {
                    if (index === chat.title.length - 1) {
                      setNewChatId(null)
                    }
                  }}
                >
                  {character}
                </motion.span>
              ))
            ) : (
              <span>
                {chat.fileId && (
                  <span className="mr-2 inline-flex">
                    <Icons.post className="size-4 text-muted-foreground" />
                  </span>
                )}
                {chat.title}
              </span>
            )}
          </div>
        </div>
      </Link>

      {isActive && <div className="absolute right-2 top-1">{children}</div>}
    </motion.div>
  )
}

interface SidebarItemsProps {
  chats?: Chat[]
}

export function ChatSidebarItems({ chats }: SidebarItemsProps) {
  if (!chats?.length) return null

  return (
    <AnimatePresence>
      {chats.map(
        (chat, index) =>
          chat && (
            <motion.div
              key={chat?.id}
              exit={{
                opacity: 0,
                height: 0,
              }}
            >
              <SidebarItem index={index} chat={chat}>
                <ChatSidebarActions
                  chat={chat}
                  removeChat={removeChat as any}
                />
              </SidebarItem>
            </motion.div>
          )
      )}
    </AnimatePresence>
  )
}
