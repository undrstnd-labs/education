"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";

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

import { Icons } from "@component/icons/Lucide";
import { UniversityCard } from "@component/display/UniversityCard";

const formSchema = z.object({
  name: z.string().nonempty(),
  bio: z.string().optional(),
  email: z.string().email(),
  image: z.string().url(),
  university: z.string().nonempty(),
  language: z.string().nonempty(),
});

const university = {
  label: "Institut Supérieur d'Informatique et de Mathématiques de Monastir",
  abbrev: "ISIMM",
  value: "isimm.u-monastir.tn",
  email: "mail@isimm.com",
  phone: "+216 73 460 000",
  avatarUrl: "https://placehold.co/600x400?text=ISIMM",
};

export function OnboardingAuthForm() {
  const t = useTranslations("Components.Form.OnboardingAuth");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <div className="col-span-full">
          <label
            htmlFor="photo"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            {t("photo")}
          </label>
          <div className="mt-2 flex items-center gap-x-3">
            <Icons.user
              className="h-12 w-12 text-gray-300 rounded-full"
              aria-hidden="true"
            />
            <button
              type="button"
              className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              {t("change-image")}
            </button>
          </div>
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("name")}</FormLabel>
              <FormControl>
                <Input placeholder={t("placeholderName")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("bio")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("placeholderBio")}
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <UniversityCard university={university} />

        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </Form>
  );
}
