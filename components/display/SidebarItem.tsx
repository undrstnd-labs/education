"use client"

import * as React from "react"
import { Link, usePathname } from "@navigation"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"

import { type Chat } from "@/types/chat"

import { cn } from "@/lib/utils"
import { useLocalStorage } from "@/hooks/use-local-storage"

import { IconMessage, IconUsers } from "@/components/icons/Overall"
import { buttonVariants } from "@/components/ui/Button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip"

interface SidebarItemProps {
  index: number
  chat: Chat
  children: React.ReactNode
}

export function SidebarItem({ index, chat, children }: SidebarItemProps) {
  const pathname = usePathname()
  const t = useTranslations("Components.Display.SidebarItem")

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
      <div className="absolute left-2 top-1 flex size-6 items-center justify-center">
        {chat.sharePath ? (
          <TooltipProvider>
            <Tooltip delayDuration={1000}>
              <TooltipTrigger
                tabIndex={-1}
                className="focus:bg-muted focus:ring-1 focus:ring-ring"
              >
                <IconUsers className="mr-2 mt-1 text-zinc-500" />
              </TooltipTrigger>
              <TooltipContent>{t("shared-chat")}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <IconMessage className="mr-2 mt-1 text-zinc-500" />
        )}
      </div>
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
          <span className="whitespace-nowrap">
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
              <span>{chat.title}</span>
            )}
          </span>
        </div>
      </Link>
      {isActive && <div className="absolute right-2 top-1">{children}</div>}
    </motion.div>
  )
}
