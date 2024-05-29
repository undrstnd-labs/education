import React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

// TODO: Improve the loading state
export default async function LoadingChatPage() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex h-screen w-full flex-col items-center justify-center ">
        <div className="w-full max-w-md space-y-4 rounded-lg">
          <div className="flex flex-row-reverse items-start space-x-4">
            <Avatar>
              <AvatarImage alt="User" src="/placeholder-avatar.jpg" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">You</span>
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="rounded-lg bg-gray-100 p-3 dark:bg-gray-800">
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <Avatar>
              <AvatarImage alt="Undrstnd" src="/images/logos/Rounded.png" />
              <AvatarFallback>CB</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">Undrstnd</span>
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="rounded-lg bg-gray-100 p-3 dark:bg-gray-800">
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </div>
          <div className="flex flex-row-reverse items-start space-x-4">
            <Avatar>
              <AvatarImage alt="User" src="/placeholder-avatar.jpg" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">You</span>
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="rounded-lg bg-gray-100 p-3 dark:bg-gray-800">
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <Avatar>
              <AvatarImage alt="Undrstnd" src="/images/logos/Rounded.png" />
              <AvatarFallback>CB</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">Undrstnd</span>
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="rounded-lg bg-gray-100 p-3 dark:bg-gray-800">
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center" />
        </div>
      </div>
    </div>
  )
}
