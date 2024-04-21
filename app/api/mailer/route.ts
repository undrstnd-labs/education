import nodemailer from "nodemailer"

import { selectMailOptions } from "@/lib/email-template"

export async function POST(req: Request) {
  const body = await req.json()

  const mailTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT as unknown as number,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  })

  try {
    const mailOptions = selectMailOptions(body.type, body)
    await mailTransporter.sendMail(mailOptions)
    return new Response(
      JSON.stringify({ message: "Email sent successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    )
  } catch (error) {
    console.log("Error sending email:", error)
    return new Response(JSON.stringify({ error: "Failed to send email" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
