import { UseChatHelpers } from "ai/react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/Button"
import { Icons } from "@/components/icons/Lucide"

const exampleMessages = (t: (arg: string) => string) => [
  {
    heading: t("heading-1"),
    message: t("message-1"),
  },
  {
    heading: t("heading-2"),
    message: t("message-2"),
  },
  {
    heading: t("heading-3"),
    message: t("message-3"),
  },
]

export function EmptyScreen({ setInput }: Pick<UseChatHelpers, "setInput">) {
  const t = useTranslations("Components.Showcase.ChatEmptyScreen")

  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="rounded-lg border bg-background p-8">
        <h1 className="mb-2 text-lg font-semibold">{t("welcome")}</h1>
        <p className="leading-normal text-muted-foreground">
          {t("description")}
        </p>
        <div className="mt-4 flex flex-col items-start space-y-2">
          {exampleMessages(t).map((message, index) => (
            <Button
              key={index}
              variant="link"
              className="h-auto p-0 text-base"
              onClick={() => setInput(message.message)}
            >
              <Icons.arrowRight className="mr-2 size-4 text-muted-foreground" />
              {message.heading}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
