import { cn } from "@lib/utils";
import { NextAuthUser } from "@/types/auth";
import { Link, redirect } from "@lib/navigation";
import { getCurrentUser, userAuthentificateVerification } from "@lib/session";

import { Icons } from "@component/icons/Lucide";
import { LogoPNG } from "@component/icons/Overall";

import { Input } from "@component/ui/Input";
import { UserMenu } from "@/components/display/UserMenu";
import { buttonVariants, Button } from "@/components/ui/Button";
import { Sheet, SheetContent, SheetTrigger } from "@component/ui/Sheet";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

//FIXME: Rename this to feed instead of Dashboard to make more sense
export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const user = await getCurrentUser();
  const toRedirect = await userAuthentificateVerification(user as NextAuthUser);
  if (toRedirect) {
    redirect(toRedirect);
  }
  if (!user) {
    return null;
  }
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link
              href="/"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "relative z-20 flex w-fit items-center text-lg font-semibold"
              )}
            >
              <LogoPNG className="mr-2 h-6 w-6" />
              Undrstnd
            </Link>
            <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
              <Icons.notifications className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                href="/"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Icons.chat className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="/chat"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Icons.chat className="h-4 w-4" />
                Chat
              </Link>
              <Link
                href="/dashboard/classroom"
                className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
              >
                <Icons.chat className="h-4 w-4" />
                Classroom
              </Link>
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Icons.media className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="/"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <Icons.chat className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link
                  href="/chat"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <Icons.chat className="h-4 w-4" />
                  Chat
                </Link>
                <Link
                  href="/dashboard/classroom"
                  className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
                >
                  <Icons.chat className="h-4 w-4" />
                  Classroom
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <Icons.search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search classrooms..."
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                />
              </div>
            </form>
          </div>
          <UserMenu user={user} />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
