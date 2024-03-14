import * as React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@component/ui/Command";
import { Button } from "@component/ui/Button";
import { Icons } from "@component/icons/Lucide";
import { Input, InputProps } from "@component/ui/Input";
import { Drawer, DrawerContent, DrawerTrigger } from "@component/ui/Drawer";
import { Popover, PopoverContent, PopoverTrigger } from "@component/ui/Popover";

import { cn } from "@lib/utils";
import { useMediaQuery } from "@hook/use-media-query";
import { EmailSelectProps, EmailSelectOption } from "@/types/auth";

const InputComponent = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <Input
      className={cn("rounded-e-none rounded-s-lg border-r-0 z-20", className)}
      {...props}
      ref={ref}
    />
  )
);
InputComponent.displayName = "InputComponent";

const AvatarComponent = ({ avatar }: { avatar: string }) => {
  return (
    <span className="flex h-4 w-6 overflow-hidden rounded-sm bg-foreground/20">
      {avatar && (
        <Image
          src={avatar}
          alt="University avatar"
          className="h-4 w-6 object-cover"
          width={24}
          height={24}
        />
      )}
    </span>
  );
};
AvatarComponent.displayName = "AvatarComponent";

function EmailSelectResponsive({
  disabled,
  value,
  onSelect,
  options,
}: EmailSelectProps) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant={"outline"}
            className={cn("flex gap-1 rounded-s-none rounded-e-lg pr-1 pl-3")}
            disabled={disabled}
          >
            <AvatarComponent
              avatar={options.find((x) => x.value === value)?.avatarUrl || ""}
            />
            <Icons.chevronsUpDown
              className={cn(
                "h-4 w-4 opacity-50",
                disabled ? "hidden" : "opacity-100"
              )}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[500px]" align="start">
          <EmailOptionsList
            value={value}
            onSelect={onSelect}
            options={options}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          type="button"
          variant={"outline"}
          className={cn("flex gap-1 rounded-s-none rounded-e-lg pr-1 pl-3")}
          disabled={disabled}
        >
          <AvatarComponent
            avatar={options.find((x) => x.value === value)?.avatarUrl || ""}
          />
          <Icons.chevronsUpDown
            className={cn(
              "h-4 w-4 opacity-50",
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
  );
}

function EmailOptionsList({
  value,
  onSelect,
  options,
}: {
  value: string;
  onSelect: (option: string) => void;
  options: EmailSelectOption[];
}) {
  const t = useTranslations("Components.Form.EmailInput");

  return (
    <Command>
      <CommandList>
        <CommandInput placeholder="Search for university..." />
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
                <AvatarComponent avatar={option.avatarUrl} />
                <span className="text-sm flex-1">{option.label}</span>
                {option.value && (
                  <span className="text-sm text-foreground/50">
                    {option.value}
                  </span>
                )}
                <Icons.check
                  className={cn(
                    "ml-auto h-4 w-4",
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
  );
}

const EmailInput = ({
  disabled,
  ...props
}: {
  disabled: boolean;
} & InputProps) => {
  const [emailValue, setEmailValue] = React.useState("");
  const t = useTranslations("Components.Form.EmailInput");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmailValue(event.target.value);
  };

  const handleSelect = (value: string) => {
    setEmailValue(value);
  };

  const options = [
    {
      label: t("options.isimm"),
      value: "@isimm.edu.tn",
      avatarUrl: "https://placehold.co/600x400?text=ISIMM",
    },
    {
      label: t("options.ensi"),
      value: "@ensi.rnu.tn",
      avatarUrl: "https://placehold.co/600x400?text=ENSI",
    },
  ];

  return (
    <div className="flex items-center">
      <InputComponent
        disabled={disabled}
        value={emailValue}
        onChange={handleInputChange}
        {...props}
      />

      <EmailSelectResponsive
        disabled={disabled}
        value={emailValue}
        options={options}
        onSelect={handleSelect}
      />
    </div>
  );
};

export { InputComponent, EmailSelectResponsive, EmailInput };
