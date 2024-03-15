import * as z from "zod";

export const userAuthSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid university email address.",
  }),
});
