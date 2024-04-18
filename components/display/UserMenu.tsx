import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@component/ui/DropdownMenu";
import { Button } from "@/components/ui/Button";
import { Avatar, AvatarFallback, AvatarImage } from "@component/ui/Avatar";

import { RoleBadge } from "@component/display/RoleBadge";
import { SignoutButton } from "@component/config/SignoutButton";
import { UserDropdown } from "@component/showcase/UserDropdown";

import { NextAuthUser } from "@/types/auth";

export function UserMenu({ user }: { user: NextAuthUser }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.image!} />
            <AvatarFallback>{user.name![0]}</AvatarFallback>
          </Avatar>
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[250px]">
        <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
        <p className="px-2 text-sm text-muted-foreground">{user.email}</p>
        <RoleBadge role={user.role as string} />
        <UserDropdown />
        <SignoutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
