import React from "react"

import { Textarea } from "@/components/ui/textarea"

export function AccountBioForm() {
  return (
    <form>
      <Textarea placeholder="Your bio" className="h-32 w-full resize-none" />
    </form>
  )
}
