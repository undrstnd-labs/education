import * as React from "react"
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components"

import { MagicLinkData } from "@/types/auth"

export function MagicLink({ magicLink }: { magicLink: MagicLinkData }) {
  return (
    <Html>
      <Head />
      <Preview>
        Confirm your e-mail for Undrstnd by clicking the button below.
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src="https://undrstnd.vercel.app/_next/image?url=%2Fimages%2Flogos%2FRounded.png&w=828&q=75"
            height="42"
            alt="Undrstnd logo"
            style={logo}
          />
          <Heading style={heading}>Your login code for Undrstnd</Heading>
          <Section style={buttonContainer}>
            <Button style={button} href={`${magicLink.otp_link}`}>
              Login to Undrstnd
            </Button>
          </Section>

          <Text style={paragraph}>
            This link and code will only be valid for the next 5 minutes. If the
            link does not work, you can use the login verification code
            directly:
          </Text>

          <Section style={codeBox}>
            <Text style={confirmationCodeText}>{magicLink.passCode}</Text>
          </Section>

          <Hr style={hr} />
          <Link href="https://www.undrstnd.vercel.app" style={reportLink}>
            Undrstnd
          </Link>
        </Container>
      </Body>
    </Html>
  )
}

const logo = {
  borderRadius: 21,
  width: 42,
  height: 42,
}

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "560px",
}

const heading = {
  fontSize: "24px",
  letterSpacing: "-0.5px",
  lineHeight: "1.3",
  fontWeight: "400",
  color: "#484848",
  padding: "17px 0 0",
}

const paragraph = {
  margin: "0 0 15px",
  fontSize: "15px",
  lineHeight: "1.4",
  color: "#3c4149",
}

const buttonContainer = {
  padding: "27px 0 27px",
}

const button = {
  backgroundColor: "#005167",
  borderRadius: "3px",
  fontWeight: "600",
  color: "#fff",
  fontSize: "15px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "11px 23px",
}

const reportLink = {
  fontSize: "14px",
  color: "#b4becc",
}

const hr = {
  borderColor: "#dfe1e4",
  margin: "42px 0 26px",
}

const code = {
  fontFamily: "monospace",
  fontWeight: "700",
  padding: "1px 4px",
  backgroundColor: "#dfe1e4",
  letterSpacing: "-0.3px",
  fontSize: "21px",
  borderRadius: "4px",
  color: "#3c4149",
}

const codeBox = {
  background: "rgb(245, 244, 245)",
  borderRadius: "4px",
  marginBottom: "30px",
  padding: "40px 10px",
}

const confirmationCodeText = {
  fontSize: "30px",
  textAlign: "center" as const,
  verticalAlign: "middle",
}
