"use server"

import { render } from "@react-email/render"
import nodemailer from "nodemailer"

import {
  EmailInviteStudent as EmailInviteStudentType,
  EmailNewPost as EmailNewPostType,
  EmailNewUser as EmailNewUserType,
} from "@/types"
import { MagicLinkData } from "@/types/auth"

import { EmailInviteStudent } from "@/components/shared/email-invite-student"
import { MagicLink } from "@/components/shared/email-magic-link"
import { EmailNewPost } from "@/components/shared/email-new-post"
import { EmailNewUser } from "@/components/shared/email-new-user"

function selectMailOptions(
  type: string,
  body:
    | MagicLinkData
    | EmailNewPostType
    | EmailNewUserType
    | EmailInviteStudentType
) {
  let html
  const mailOptions = {
    from: `Undrstnd <${process.env.EMAIL_SENDER}>`,
    to: process.env.MAIN_EMAIL,
  }

  switch (type) {
    case "magic-link":
      html = render(MagicLink({ magicLink: body as MagicLinkData }))
      return {
        from: mailOptions.from,
        to: (body as MagicLinkData).email,
        subject: `Your magic link for Undrstnd`,
        html: html,
      }
    case "new-post":
      html = render(EmailNewPost(body as EmailNewPostType))
      return {
        from: mailOptions.from,
        to: (body as EmailNewPostType).user.email,
        subject: `New post from ${(body as EmailNewPostType).teacherUser.name!} on ${(body as EmailNewPostType).classroom.name}`,
        html: html,
      }

    case "new-user":
      html = render(EmailNewUser(body as EmailNewUserType))
      return {
        from: mailOptions.from,
        to: (body as EmailNewUserType).email,
        subject: `Welcome ${(body as EmailNewUserType).username}`,
        html: html,
      }

    case "invite-student":
      html = render(EmailInviteStudent(body as EmailInviteStudentType))
      console.log(body)
      return {
        from: mailOptions.from,
        to: (body as EmailInviteStudentType).student.user.email,
        subject: `Invitation to join ${(body as EmailInviteStudentType).teacher.user.name}'s classroom on Undrstnd`,
        html: html,
      }

    default:
      throw new Error("Invalid submission type")
  }
}

export async function sendMail(
  type: string,
  body:
    | MagicLinkData
    | EmailNewPostType
    | EmailNewUserType
    | EmailInviteStudentType
) {
  const mailTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT as unknown as number,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  })

  try {
    const mailOptions = selectMailOptions(type, body)
    await mailTransporter.sendMail(mailOptions)
    return {
      status: 200,
      message: "Email sent successfully",
    }
  } catch (error) {
    console.log("Error sending email:", error)
    return {
      status: 500,
      message: "Failed to send email",
    }
  }
}
