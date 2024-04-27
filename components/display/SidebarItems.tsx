"use client"

import { AnimatePresence, motion } from "framer-motion"

import { Chat } from "@/types/chat"

import { removeChat, shareChat } from "@/lib/actions"

import { SidebarItem } from "@/components/display/SidebarItem"
import { SidebarActions } from "@/components/showcase/SidebarActions"

interface SidebarItemsProps {
  chats?: Chat[]
}

export function SidebarItems({ chats }: SidebarItemsProps) {
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
                <SidebarActions
                  chat={chat}
                  removeChat={removeChat as any}
                  // TODO: Implement the share function just to duplicate the content
                  //shareChat={shareChat as any}
                />
              </SidebarItem>
            </motion.div>
          )
      )}
    </AnimatePresence>
  )
}
