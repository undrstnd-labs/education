import * as React from "react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/Command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { Button } from "@/components/ui/Button";
import { Icons } from "@/components/icons/Lucide";
import { Input, InputProps } from "@/components/ui/Input";

import { cn } from "@/lib/utils";

const options = [
  {
    label: "Higher Institute of Informatics and Mathematics of Monastir",
    value: "@isimm.edu.tn",
  },
  {
    label: "University of Monastir",
    value: "@um.rnu.tn",
  },
  {
    label: "University of Sousse",
    value: "@us.rnu.tn",
  },
  {
    label: "University of Tunis",
    value: "@utunis.rnu.tn",
  },
  {
    label: "University of Manouba",
    value: "@um.rnu.tn",
  },
  {
    label: "University of Gabes",
    value: "@ug.rnu.tn",
  },
  {
    label: "University of Sfax",
    value: "@us.rnu.tn",
  },
  {
    label: "University of Jendouba",
    value: "@uj.rnu.tn",
  },
  {
    label: "University of Kairouan",
    value: "@uk.rnu.tn",
  },
  {
    label: "University of Gafsa",
    value: "@ug.rnu.tn",
  },
  {
    label: "University of Carthage",
    value: "@uc.rnu.tn",
  },
  {
    label: "University of Tunis El Manar",
    value: "@utm.rnu.tn",
  },
];

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

const EmailSelect = ({
  disabled,
  value,
  onChange,
  options,
}: {
  disabled: boolean;
  value: string;
  onChange: (option: any) => void;
  options: any[];
}) => {
  const handleSelect = React.useCallback(
    (option: any) => {
      onChange(option);
    },
    [onChange]
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant={"outline"}
          className={cn("flex gap-1 rounded-s-none rounded-e-lg pr-1 pl-3")}
          disabled={disabled}
        >
          <span className="text-sm">{value}</span>
          <Icons.chevronsUpDown
            className={cn(
              "h-4 w-4 opacity-50",
              disabled ? "hidden" : "opacity-100"
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[300px]">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search country..." />
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {options
                .filter((x: any) => x.value)
                .map((option: any) => (
                  <CommandItem
                    className="gap-2"
                    key={option.value}
                    onSelect={() => handleSelect(option)}
                  >
                    <span className="text-sm flex-1">{option.label}</span>
                    <Icons.check
                      className={cn(
                        "ml-auto h-4 w-4",
                        option.value === value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
const EmailInput = ({
  disabled,
  ...props
}: {
  disabled: boolean;
  value: string;
  onChange: (value: string) => void;
} & InputProps) => {
  const [inputValue, setInputValue] = React.useState("");
  const [selectedOption, setSelectedOption] = React.useState<any>(null);

  const handleSelect = React.useCallback(
    (option: any) => {
      setSelectedOption(option);
      setInputValue(`${props.value}@${option.value}`);
    },
    [props.value, setSelectedOption, setInputValue]
  );

  const handleInputChange = React.useCallback(
    (event: any) => {
      const inputValue = event.target.value;
      setInputValue(inputValue);

      const domain = inputValue.split("@").pop();
      const option = options.find((x) => x.value === domain);
      if (option) {
        setSelectedOption(option as any);
      } else {
        setSelectedOption(null);
      }
    },
    [options, setSelectedOption, setInputValue]
  );

  return (
    <div className="flex items-center">
      <InputComponent
        disabled={disabled}
        {...props}
        value={inputValue}
        onChange={handleInputChange}
      />
      <EmailSelect
        value={selectedOption?.label || ""}
        onChange={handleSelect}
        options={options}
        disabled={disabled}
      />
    </div>
  );
};

export { InputComponent, EmailSelect, EmailInput };
