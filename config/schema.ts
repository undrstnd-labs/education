import * as z from "zod";
import { getEmailOptions } from "@config/universities";

const emailOptions = getEmailOptions();

export function getUserAuthSchema(
  invalidEmail: string,
  invalidUniversityEmail: string
) {
  return z.object({
    email: z
      .string()
      .email({
        message: invalidEmail,
      })
      .refine(
        (value) => {
          const [, domain] = value.split("@");
          return emailOptions.includes(domain);
        },
        {
          message: invalidUniversityEmail,
        }
      ),
  });
}

export const emailSchema = z.object({
  email: z
    .string()
    .email()
    .refine((value) => {
      const [, domain] = value.split("@");
      return emailOptions.includes(domain);
    }),
});

export const pinSchema = z.object({
  email: z
    .string()
    .email()
    .refine((value) => {
      const [, domain] = value.split("@");
      return emailOptions.includes(domain);
    }),
  pin: z.string().length(6),
});

export const addClassroomSchema = (t: (arg: string) => string) =>
  z.object({
    name: z.string().min(4, {
      message: t("formSchemaNameMessage"),
    }),
    description: z.string().optional(),
  });

export const editClassroomSchema = (t: (arg: string) => string) =>
  z.object({
    name: z.string().min(4, {
      message: t("formSchemaNameMessage"),
    }),
    description: z.string().optional(),
  });

export const addPostSchema = (t: (arg: string) => string) =>
  z.object({
    name: z.string().min(4, {
      message: t("formSchemaPostName"),
    }),
    content: z.string().min(10, {
      message: t("formSchemaDescriptionMessage"),
    }),
    files: z.array(z.unknown()).optional(),
  });

export const commentAddCardSchema = (t: (arg: string) => string) =>
  z.object({
    text: z.string().min(4, t("commentAddSchema")),
  });
