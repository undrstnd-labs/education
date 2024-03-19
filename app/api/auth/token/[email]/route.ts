import * as z from "zod";
import { db } from "@lib/prisma";

const routeContextSchema = z.object({
  params: z.object({
    email: z.string().email(),
  }),
});

export async function GET(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    const { params } = routeContextSchema.parse(context);

    const verificationTokens = await db.verificationToken.findMany({
      where: {
        identifier: params.email.toLowerCase(),
      },
      orderBy: {
        expires: "desc",
      },
    });

    const verificationToken = verificationTokens[0];

    if (!verificationToken) {
      return new Response(null, { status: 404 });
    }

    return new Response(JSON.stringify(verificationToken), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    console.log(error);
    return new Response(null, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    const { params } = routeContextSchema.parse(context);

    const verificationTokens = await db.verificationToken.findMany({
      where: {
        identifier: params.email.toLowerCase(),
      },
      orderBy: {
        expires: "desc",
      },
    });

    const verificationToken = verificationTokens[0];

    if (!verificationToken) {
      return new Response(null, { status: 404 });
    }

    const passCode = Math.floor(100000 + Math.random() * 900000).toString();

    await db.verificationToken.update({
      where: {
        token: verificationToken.token,
        identifier: params.email.toLowerCase(),
      },
      data: {
        passCode,
      },
    });

   return new Response(JSON.stringify(passCode), {
     status: 200,
     headers: {
       "Content-Type": "application/json",
     },
   });
  } catch (error: any) {
    console.log(error);
    return new Response(null, { status: 500 });
  }
}
