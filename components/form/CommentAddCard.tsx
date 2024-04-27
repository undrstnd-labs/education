"use client";
import { useTranslations } from "next-intl";
import { Icons } from "../icons/Lucide";
import { Card, CardContent } from "../ui/Card";
import { Textarea } from "../ui/Textarea";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { commentAddCardSchema } from "@/config/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyboardEvent, useRef, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/Form";
import { Button } from "../ui/Button";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "@/lib/navigation";
interface CommentAddCardProps {
  postId: string;
  userId: string;
  parentid?: string;
}

const CommentAddCard = ({ postId, userId, parentid }: CommentAddCardProps) => {
  const [loading, setLoading] = useState(false);
  const t = useTranslations("Pages.Classroom");
  const formSchema = commentAddCardSchema(t);
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const res = await fetch(`/api/comments/${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: values.text,
          userId,
          parentId: parentid,
        }),
      });
      if (res.ok) {
        form.reset();
        toast({
          title: t("commendAddedTitleToast"),
          description: t("commendAddedDescriptionToast"),
          variant: "default",
        });
        router.refresh();
      } else {
        toast({
          title: t("commentAddedTitleToastErreur"),
          description: t("commentAddedDescriptionToastErreur"),
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: t("commentAddedTitleToastErreur"),
        description: t("commentAddedDescriptionToastErreur"),
        variant: "destructive",
      });
    } finally {
      form.reset();
      setLoading(false);
    }
  }
  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  };
  return (
    <Card>
      <CardContent className="w-full  px-6 py-3">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Textarea
                        placeholder={t("addCommentPlaceholder")}
                        {...field}
                        disabled={loading}
                        ref={textareaRef}
                        onKeyDown={handleKeyDown}
                      />

                      <Button
                        type="submit"
                        size={"icon"}
                        variant={"outline"}
                        className="absolute bottom-2 right-2 flex h-6 w-6 items-center justify-center rounded-full border border-gray-500
                       hover:bg-accent max-sm:size-5"
                        disabled={loading}
                      >
                        <Icons.add className="size-5 text-gray-500 max-sm:size-4 " />
                      </Button>
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CommentAddCard;
