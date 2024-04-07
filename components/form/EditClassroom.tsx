"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Textarea } from "../ui/Textarea";
import { Dispatch, SetStateAction, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/lib/navigation";
import { toast } from "@/hooks/use-toast";
import { Icons } from "../icons/Lucide";
import { Classroom, User } from "@prisma/client";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Drawer, DrawerContent } from "../ui/Drawer";

interface EditClassroomProps {
  classroom: Classroom & {
    teacher: { user: User; id: string; userId: string };
  };
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const baseFormSchema = (t: (arg: string) => string) =>
  z.object({
    name: z.string().min(4, {
      message: t("formSchemaNameMessage"),
    }),
    description: z.string().optional(),
  });

export function EditClassroom({
  classroom,
  open,
  setOpen,
}: EditClassroomProps) {
  const [isLoading, setIsLoading] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const router = useRouter();
  const t = useTranslations("Pages.Classroom");
  const formSchema = baseFormSchema(t);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: classroom.name || "",
      description: classroom.description || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/classrooms/${classroom.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          description: values.description,
          userId: classroom.teacher.user.id,
        }),
      });
      if (res.ok) {
        toast({
          title: t("toastTitleUpdateClassroom"),
          variant: "default",
          description: t("toastDescriptionUpdateClassroom"),
        });
        router.refresh();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  }
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="text-center font-bold text-primary text-2xl mb-8">
                {t("formTitleUpdateClassroom")}
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">
                      {t("formLabelClassroomName")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("formClassroomNamePlaceholder")}
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">
                      {t("formLabelClassroomDescription")}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("formClassroomDescriptionPlaceholder")}
                        {...field}
                        rows={2}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                {t("formClassroomButton")}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  } else {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 px-6 pb-6"
            >
              <div className="text-center font-bold text-primary text-2xl mb-8">
                {t("formTitleUpdateClassroom")}
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">
                      {t("formLabelClassroomName")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("formClassroomNamePlaceholder")}
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">
                      {t("formLabelClassroomDescription")}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("formClassroomDescriptionPlaceholder")}
                        {...field}
                        rows={2}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                {t("formClassroomButton")}
              </Button>
            </form>
          </Form>
        </DrawerContent>
      </Drawer>
    );
  }
}
