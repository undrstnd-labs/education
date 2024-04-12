"use client";

import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useRouter } from "@/lib/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "@hook/use-toast";
import { addClassroomSchema } from "@config/schema";
import { useMediaQuery } from "@/hooks/use-media-query";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@component/ui/Form";
import { Input } from "@component/ui/Input";
import { Button } from "@component/ui/Button";
import { Icons } from "@component/icons/Lucide";
import { Textarea } from "@component/ui/Textarea";
import { Drawer, DrawerContent, DrawerTrigger } from "@component/ui/Drawer";
import { Dialog, DialogContent, DialogTrigger } from "@component/ui/Dialog";

interface AddClassroomProps {
  userId: string;
}

export function AddClassroom({ userId }: AddClassroomProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const t = useTranslations("Pages.Classroom");
  const [isLoading, setIsLoading] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const formSchema = addClassroomSchema(t);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const res = await fetch("/api/classrooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          description: values.description,
          userId,
        }),
      });

      if (res.ok) {
        toast({
          title: t("toastTitleAddClassroom"),
          variant: "default",
          description: t("toastDescriptionAddClassroom"),
        });
        router.refresh();
        form.reset();
      } else {
        toast({
          title: t("toast-title-create-error"),
          description: t("toast-description-create-error"),
          variant: "destructive",
        });
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
        <DialogTrigger asChild>
          <Button className="mb-4">{t("buttonCreate")}</Button>
        </DialogTrigger>
        <DialogContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="text-center font-bold text-primary text-2xl mb-8">
                {t("buttonCreate")}
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
        <DrawerTrigger asChild>
          <Button className="mb-4">{t("buttonCreate")}</Button>
        </DrawerTrigger>
        <DrawerContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 px-6 pb-6"
            >
              <div className="text-center font-bold text-primary text-2xl mb-8">
                {t("buttonCreate")}
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
