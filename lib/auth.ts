import { db } from "@lib/prisma";
import { verifyEmail } from "@lib/utils";

import { JWT } from "next-auth/jwt";
import { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db as any),
  secret: process.env.NEXTAUTH_SECRET!,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    EmailProvider({
      from: process.env.EMAIL_SENDER,
      maxAge: 60 * 60 + 5 * 60,
      sendVerificationRequest: async ({
        identifier,
        url,
        provider: { server, from },
      }) => {
        const passCode = await fetch(
          `${process.env.NEXTAUTH_URL}/api/auth/token/${identifier}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              url,
            }),
          }
        ).then((res) => res.json());

        await fetch(`${process.env.NEXTAUTH_URL}/api/mailer`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "magic-link",
            email: identifier,
            otp_link: url,
            passCode: passCode,
          }),
        }).then((res) => res.json());
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      const dbUser = await db.user.findFirst({
        where: {
          email: session.user.email,
        },
      });

      if (token && dbUser) {
        session.user.id = dbUser.id;
        session.user.name = dbUser.name;
        session.user.email = dbUser.email;
        session.user.image = dbUser.image;
        session.user.role = dbUser.role;
        session.user.bio = dbUser.bio;
        session.user.universitySlug = dbUser.universitySlug;
      }

      return session;
    },
    async jwt({ token, user }): Promise<JWT> {
      if (user) {
        if (!verifyEmail(user.email as string)) {
          throw new Error("Invalid email address");
        }

        const dbUser = await db.user.findFirst({
          where: {
            email: user.email as string,
          },
        });

        if (dbUser) {
          return {
            id: dbUser.id,
            email: dbUser.email,
            name: dbUser.name,
            image: dbUser.image,
            role: dbUser.role,
            bio: dbUser.bio,
            universitySlug: dbUser.universitySlug,
            emailVerified: dbUser.emailVerified,
            createdAt: dbUser.createdAt,
            updatedAt: dbUser.updatedAt,
          };
        }

        token.id = user?.id;
      }

      return token;
    },
  },
};
