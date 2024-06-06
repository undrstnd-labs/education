import * as React from "react"
import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components"

import { siteConfig } from "@/config/site"

export function EmailNewUser({ username }: { username: string }) {
  return (
    <Html>
      <Head />
      <Preview>
        Welcome to {siteConfig.name} - Hope you have an amazing experience,
        {username}!
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src={`${siteConfig.url}/images/logos/Rounded.png`}
            width="50"
            height="50"
            alt={`${siteConfig.name} logo`}
            style={logo}
          />
          <Text style={heading}>Welcome to {siteConfig.name}</Text>
          <Text style={paragraph}>Hi {username},</Text>
          <Text style={paragraph}>
            We're excited to have you on board with {siteConfig.name}! We've
            been working on it for the past months and have implemented the
            basic functionality. We hope that you'll have an amazing experience
            with it, gain more from it, and help others. It's totally free and
            open source, and we hope you enjoy it.
          </Text>
          <Text style={paragraph}>
            Best regards, founders
            <br />
            <Text style={boldText}>Malek & Amine.</Text>
          </Text>
          <Section style={btnContainer}>
            <Button style={button} href={siteConfig.url}>
              Get started
            </Button>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>
            <Link href="https://undrstnd.vercel.app/">Undrstnd</Link>, Tunisie,
            Monastir 5000
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
}

const logo = {
  margin: "0 auto",
}

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
}

const boldText = {
  fontWeight: "bold",
  fontSize: "19px",
}

const btnContainer = {
  textAlign: "center" as const,
}

const button = {
  backgroundColor: "#0ea5e9",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px",
}

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
}

const footer = {
  color: "#8898aa",
  fontSize: "12px",
}

const heading = {
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "10px 0",
}

const link = {
  color: "#556cd6",
  textDecoration: "underline",
}
