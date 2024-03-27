import { db } from "@lib/prisma";
import nodemailer from "nodemailer";
import { verifyEmail } from "@lib/utils";
import { selectMailOptions } from "@lib/email-template";

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
        const mailTransporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
          auth: {
            user: process.env.EMAIL_SENDER,
            pass: process.env.EMAIL_SERVER_PASSWORD,
          },
          tls: {
            rejectUnauthorized: false,
          },
        });

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

        try {
          const mailOptions = selectMailOptions("magic-link", {
            email: identifier,
            otp_link: url,
            passCode: passCode,
          });
          await mailTransporter.sendMail(mailOptions);
        } catch (error) {
          console.log("Error sending email:", error);
        }
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
            email: user.email,
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
