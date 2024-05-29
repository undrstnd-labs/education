import * as React from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"

import { EmailOption } from "@/types"
import { EmailSelectProps } from "@/types/auth"

import { getTranslatedEmailOptions } from "@/config/universities"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"

import { Icons } from "@/components/shared/icons"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import { Input, InputProps } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const InputComponent = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <Input
      className={cn("z-20 rounded-e-none rounded-s-lg border-r-0", className)}
      {...props}
      ref={ref}
    />
  )
)
InputComponent.displayName = "InputComponent"

const AvatarComponent = ({ university }: { university: EmailOption }) => {
  return (
    <span className="flex h-4 w-6 overflow-hidden rounded-sm bg-foreground/20">
      {university && (
        <>
          <Image
            src={university.avatarUrl}
            alt={university.label}
            className="h-4 w-6 object-cover"
            width={24}
            height={24}
          />
        </>
      )}
    </span>
  )
}
AvatarComponent.displayName = "AvatarComponent"

function EmailSelectResponsive({
  disabled,
  value,
  onSelect,
  options,
}: EmailSelectProps) {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant={"outline"}
            className={cn("flex gap-1 rounded-e-lg rounded-s-none pl-3 pr-1")}
            disabled={disabled}
          >
            <AvatarComponent
              university={options.find((x) => x.value === value) || ""}
            />
            <Icons.chevronsUpDown
              className={cn(
                "size-4 opacity-50",
                disabled ? "hidden" : "opacity-100"
              )}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[500px] p-0" align="start">
          <EmailOptionsList
            value={value}
            onSelect={onSelect}
            options={options}
          />
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          type="button"
          variant={"outline"}
          className={cn("flex gap-1 rounded-e-lg rounded-s-none pl-3 pr-1")}
          disabled={disabled}
        >
          <AvatarComponent
            university={options.find((x) => x.value === value) || ""}
          />
          <Icons.chevronsUpDown
            className={cn(
              "size-4 opacity-50",
              disabled ? "hidden" : "opacity-100"
            )}
          />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <EmailOptionsList
            value={value}
            onSelect={onSelect}
            options={options}
          />
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function EmailOptionsList({
  value,
  onSelect,
  options,
}: {
  value: string
  onSelect: (option: string) => void
  options: EmailOption[]
}) {
  const t = useTranslations("app.components.app.auth-input-university-form")

  return (
    <Command>
      <CommandList>
        <CommandInput placeholder={t("search-command")} />
        <CommandEmpty>{t("empty-command")}</CommandEmpty>
        <CommandGroup>
          {options
            .filter((x) => x.value)
            .map((option) => (
              <CommandItem
                className="gap-2"
                key={option.value}
                onSelect={() => onSelect(option.value)}
              >
                <AvatarComponent university={option} />
                <span className="flex-1 text-sm">{option.label}</span>
                {option.value && (
                  <span className="text-sm text-foreground/50">
                    {option.value}
                  </span>
                )}
                <Icons.check
                  className={cn(
                    "ml-auto size-4",
                    option === options.find((x) => x.value === value)
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}

const AuthInputUniversityForm = ({
  disabled,
  register,
  setValue,
  ...props
}: {
  disabled: boolean
  register: any
  setValue: any
} & InputProps) => {
  const t = useTranslations("app.components.app.auth-input-university-form")
  const options = getTranslatedEmailOptions(t)

  const [email, setEmail] = React.useState("")
  const [selectedUniversity, setSelectedUniversity] = React.useState("")

  const handleSelect = (option: string) => {
    if (!email.endsWith(`@${option}`)) {
      setSelectedUniversity(option)
      const atIndex = email.indexOf("@")
      if (atIndex !== -1) {
        setEmail(email.substring(0, atIndex) + `@${option}`)
      } else {
        setEmail(`${email}@${option}`)
      }
    }
    setValue("email", email)
  }

  React.useEffect(() => {
    setValue("email", email)
  }, [email, setValue])

  return (
    <div className="flex items-center">
      <InputComponent
        {...props}
        {...register("email")}
        disabled={disabled}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <EmailSelectResponsive
        disabled={disabled}
        options={options}
        value={selectedUniversity}
        onSelect={handleSelect}
      />
    </div>
  )
}

export { InputComponent, EmailSelectResponsive, AuthInputUniversityForm }
