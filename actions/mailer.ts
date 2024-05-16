import { render } from "@react-email/render"
import nodemailer from "nodemailer"

import { MagicLinkData } from "@/types/auth"

import { MagicLink } from "@/components/email/MagicLink"

function selectMailOptions(type: string, body: MagicLinkData) {
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
    default:
      throw new Error("Invalid submission type")
  }
}

export async function sendMail(type: string, body: MagicLinkData) {
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
