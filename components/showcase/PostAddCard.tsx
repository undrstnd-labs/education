"use client";
import { Icons } from "@/components/icons/Lucide";
import { Card, CardContent } from "@/components/ui/Card";
import { z } from "zod";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useRouter } from "@/lib/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "@hook/use-toast";
import { addPostSchema } from "@config/schema";
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

import { Textarea } from "@component/ui/Textarea";
import { Drawer, DrawerContent, DrawerTrigger } from "@component/ui/Drawer";
import { Dialog, DialogContent, DialogTrigger } from "@component/ui/Dialog";
import { classroom } from "@/types/classroom";
import { deleteFiles, uploadFiles } from "@/lib/storage";
import { supabaseFile } from "@/types/supabase";

interface PostAddCard {
  userId: string;
  classroom: classroom;
}

const PostAddCard = ({ userId, classroom }: PostAddCard) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [supabaseFilesPath, setSupabaseFilesPath] = useState<string[]>([]);
  const [supabaseFiles, setSupabaseFiles] = useState<supabaseFile[]>([]);
  const refFiles = useRef<HTMLInputElement>(null);
  const t = useTranslations("Pages.Classroom");
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const formSchema = addPostSchema(t);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      content: "",
      files: [],
    },
  });
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles([...files, ...Array.from(e.target.files)]);
    }
  };
  const handleFileRemove = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const openFilePicker = () => {
    refFiles.current?.click();
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    console.log(values.content, values.name);
    try {
      const res = await fetch(`/api/posts/${classroom.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          name: values.name,
          content: values.content,
          files: supabaseFiles.map((file) => {
            return {
              name: file.name,
              size: file.size,
              type: file.type,
              url: file.url,
            };
          }),
        }),
      });
      if (res.ok) {
        form.reset();
        setFiles([]);
        setSupabaseFilesPath([]);
        router.refresh();
        toast({
          title: t("toastPostCreatedSuccess"),
          variant: "default",
          description: t("toastPostCreatedSuccessDescription"),
        });
      } else {
        toast({
          title: t("toastPostCreatedFailed"),
          variant: "destructive",
          description: t("toastPostCreatedFailedDescription"),
        });
      }
    } catch (error) {
      toast({
        title: t("toastPostCreatedFailed"),
        variant: "destructive",
        description: t("toastPostCreatedFailedDescription"),
      });
    } finally {
      setOpen(false);
      setIsLoading(false);
    }
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Card className="hover:cursor-pointer group">
            <CardContent className="flex  items-center gap-4  px-6 py-3">
              <div className="border rounded-full size-8 max-sm:size-5 flex justify-center items-center border-gray-500 hover:bg-accent group-hover:bg-accent">
                <Icons.add className="size-6 text-gray-500 max-sm:size-4" />
              </div>
              <div className="hover:underline hover:underline-offset-2 max-sm:text-sm group-hover:underline group-hover:underline-offset-2">
                {t("createPostTitle")}
              </div>
            </CardContent>
          </Card>
        </DialogTrigger>
        <DialogContent
          onCloseAutoFocus={() => {
            form.reset();
            {
              files.length > 0 && setFiles([]);
            }
            {
              (supabaseFilesPath.length > 0 || supabaseFiles.length > 0) &&
                deleteFiles(supabaseFilesPath).then(() => {
                  setSupabaseFilesPath([]);
                  setSupabaseFiles([]);
                });
            }
          }}
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="text-center font-bold text-primary text-2xl mb-8">
                {t("createPostTitle")}
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">
                      {t("formLabelNameAddPost")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("formPlaceholderNameAddPost")}
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
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">
                      {t("formLabelDescriptionAddPost")}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("formPlaceholderDescriptionAddPost")}
                        {...field}
                        rows={2}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="files"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex gap-4">
                      <FormLabel className="font-bold">
                        {t("postFilesLabel")}
                      </FormLabel>
                      <FormControl>
                        <div>
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            multiple
                            onChange={handleFileChange}
                            disabled={isLoading}
                            className="hidden"
                            ref={refFiles}
                          />
                          <div
                            className="border rounded-full -mt-1 size-6 max-sm:size-5 flex justify-center items-center border-gray-500 hover:bg-accent"
                            onClick={openFilePicker}
                          >
                            <Icons.add className="size-5 text-gray-500 max-sm:size-4" />
                          </div>
                        </div>
                      </FormControl>
                    </div>
                    <FormMessage />
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 ">
                      {files.map((file, index) => (
                        <div key={index} className="relative">
                          <div className=" p-5 rounded shadow-md flex items-center space-x-4 border ">
                            <div className="flex-1 truncate">
                              <div className="font-bold text-sm">
                                {file.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {(file.size / (1024 * 1024)).toFixed(2)} MB
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleFileRemove(index)}
                              className="absolute top-0 right-0 pr-2"
                            >
                              <Icons.close className="h-4 w-4 text-red-500 mt-1.5 border rounded-full border-red-300" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </FormItem>
                )}
              />
              {files.length > 0 && (
                <Button
                  variant={"outline"}
                  type="submit"
                  className="w-full mb-2"
                  disabled={isLoadingFiles}
                  onClick={() => {
                    setIsLoadingFiles(true);
                    uploadFiles(files, classroom)
                      .then((res) => {
                        setSupabaseFiles(res[0]);
                        setSupabaseFilesPath(res[1]);
                        toast({
                          title: t("toastFilesSuccess"),
                          variant: "default",
                          description: t("toastFilesSuccessDescription"),
                        });
                      })
                      .catch(() => {
                        toast({
                          title: t("toastFilesFailed"),
                          variant: "destructive",
                          description: t("toastFilesFailedDescription"),
                        });
                      })
                      .finally(() => setIsLoadingFiles(false));
                  }}
                >
                  {isLoadingFiles && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {t("uploadButtonLabel")}
                </Button>
              )}
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || isLoadingFiles}
              >
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
          <Card className="hover:cursor-pointer group">
            <CardContent className="flex  items-center gap-4  px-6 py-3">
              <div className="border rounded-full size-8 max-sm:size-5 flex justify-center items-center border-gray-500 hover:bg-accent">
                <Icons.add className="size-6 text-gray-500 max-sm:size-4" />
              </div>
              <div className="hover:underline hover:underline-offset-2 max-sm:text-sm group-hover:underline group-hover:underline-offset-2">
                {t("createPostTitle")}
              </div>
            </CardContent>
          </Card>
        </DrawerTrigger>
        <DrawerContent
          onCloseAutoFocus={() => {
            form.reset();
            {
              files.length > 0 && setFiles([]);
            }
            {
              (supabaseFilesPath.length > 0 || supabaseFiles.length > 0) &&
                deleteFiles(supabaseFilesPath).then(() => {
                  setSupabaseFilesPath([]);
                  setSupabaseFiles([]);
                });
            }
          }}
        >
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 px-6 pb-6"
            >
              <div className="text-center font-bold text-primary text-2xl mb-8">
                {t("createPostTitle")}
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">
                      {t("formLabelNameAddPost")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("formPlaceholderNameAddPost")}
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
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">
                      {t("formLabelDescriptionAddPost")}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("formPlaceholderDescriptionAddPost")}
                        {...field}
                        rows={2}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="files"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex gap-4">
                      <FormLabel className="font-bold">
                        {t("postFilesLabel")}
                      </FormLabel>
                      <FormControl>
                        <div>
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            multiple
                            onChange={handleFileChange}
                            disabled={isLoading}
                            className="hidden"
                            ref={refFiles}
                          />
                          <div
                            className="border rounded-full -mt-1 size-6 max-sm:size-5 flex justify-center items-center border-gray-500 hover:bg-accent"
                            onClick={openFilePicker}
                          >
                            <Icons.add className="size-5 text-gray-500 max-sm:size-4" />
                          </div>
                        </div>
                      </FormControl>
                    </div>
                    <FormMessage />
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 ">
                      {files.map((file, index) => (
                        <div key={index} className="relative">
                          <div className=" p-5 rounded shadow-md flex items-center space-x-4 border ">
                            <div className="flex-1 truncate">
                              <div className="font-bold text-sm">
                                {file.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {(file.size / (1024 * 1024)).toFixed(2)} MB
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleFileRemove(index)}
                              className="absolute top-0 right-0 pr-2"
                            >
                              <Icons.close className="h-4 w-4 text-red-500 mt-1.5 border rounded-full border-red-300" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </FormItem>
                )}
              />
              {files.length > 0 && (
                <Button
                  variant={"outline"}
                  type="submit"
                  className="w-full mb-2"
                  disabled={isLoadingFiles}
                  onClick={() => {
                    setIsLoadingFiles(true);
                    uploadFiles(files, classroom)
                      .then((res) => {
                        setSupabaseFiles(res[0]);
                        setSupabaseFilesPath(res[1]);
                        toast({
                          title: t("toastFilesSuccess"),
                          variant: "default",
                          description: t("toastFilesSuccessDescription"),
                        });
                      })
                      .catch(() => {
                        toast({
                          title: t("toastFilesFailed"),
                          variant: "destructive",
                          description: t("toastFilesFailedDescription"),
                        });
                      })
                      .finally(() => setIsLoadingFiles(false));
                  }}
                >
                  {isLoadingFiles && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {t("uploadButtonLabel")}
                </Button>
              )}
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || isLoadingFiles}
              >
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
};

export default PostAddCard;
