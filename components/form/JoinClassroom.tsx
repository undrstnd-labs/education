"use client";
import { useRouter } from "@/lib/navigation";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { Icons } from "../icons/Lucide";
import { toast } from "@/hooks/use-toast";
interface JoinClassroomProps {
  userId: string;
}

const baseFormSchema = (t: (arg: string) => string) =>
  z.object({
    code: z.string().min(8, {
      message: t("formSchemaCodeMessage"),
    }),
  });

const JoinClassroom = ({ userId }: JoinClassroomProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations("Pages.Classroom");
  const formSchema = baseFormSchema(t);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/classrooms/join/${values.code}`, {
        method: "PATCH",
        body: JSON.stringify({ userId }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        toast({
          title: t("joinApiSuccess"),
          variant: "default",
          description: t("joinApiSuccessDescription"),
        });
        router.refresh();
        form.reset();
      } else {
        const data = await res.json();
        if (data.messageNotFound) {
          toast({
            title: t("joinApiError"),
            variant: "destructive",
            description: t("joinApiErrorDescription"),
          });
        }
        if (data.messageArchived) {
          toast({
            title: t("joinApiErrorArchived"),
            variant: "destructive",
            description: t("joinApiErrorArchivedDescription"),
          });
        }
        if (data.messageAlreadyJoin) {
          toast({
            title: t("joinApiAlreadyError"),
            variant: "destructive",
            description: t("joinApiAlreadyErrorDescription"),
          });
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="mb-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">
                  {t("formLabelClassroomCode")}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("formClassroomCodePlaceholder")}
                    {...field}
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
            {t("formClassroomJoinButton")}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default JoinClassroom;
