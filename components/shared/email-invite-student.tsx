import * as React from "react"
import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components"

import { EmailInviteStudent as EmailInviteStudentType } from "@/types"

import { siteConfig } from "@/config/site"

export function EmailInviteStudent({
  teacher,
  student,
  classroom,
}: EmailInviteStudentType) {
  return (
    <Html>
      <Head />
      <Preview>Invitation to join {classroom.name} on Undrstnd</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Section className="mt-[32px]">
              <Img
                src={`${siteConfig.url}/images/logos/Rounded.png`}
                width="200"
                height="200"
                alt="Undrstnd"
                className="mx-auto my-0"
              />
            </Section>
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              Join <strong>{classroom.name}</strong> on{" "}
              <strong>Undrstnd</strong>
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              Hello {student.user.name},
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              <strong>{teacher.user.name}</strong> (
              <Link
                href={`mailto:${teacher.user.email}`}
                className="text-blue-600 no-underline"
              >
                {teacher.user.email}
              </Link>
              ) has invited you to the <strong>{classroom.name}</strong>{" "}
              classroom on <strong>Undrsntd</strong>.
            </Text>
            <Section>
              <Row>
                <Column align="right">
                  <Img
                    className="rounded-full"
                    src={student.user.image!}
                    width="64"
                    height="64"
                  />
                </Column>
                <Column align="center">
                  <Img
                    src={`${siteConfig.url}/images/email/arrow.png`}
                    width="12"
                    height="9"
                    alt="invited you to"
                  />
                </Column>
                <Column align="left">
                  <Img
                    className="rounded-full"
                    src={teacher.user.image!}
                    width="64"
                    height="64"
                  />
                </Column>
              </Row>
            </Section>
            <Section className="mb-[32px] mt-[32px] text-center">
              <Button
                className="rounded bg-[#000000] px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href={`${siteConfig.url}/classroom/join/${classroom.classCode}`}
              >
                Join the classroom
              </Button>
            </Section>
            <Text className="text-[14px] leading-[24px] text-black">
              or copy and paste this URL into your browser:{" "}
              <Link
                href={`${siteConfig.url}/classroom/join/${classroom.classCode}`}
                className="text-blue-600 no-underline"
              >
                {`${siteConfig.url}/classroom/join/${classroom.classCode}`}
              </Link>
            </Text>
            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />

            <Text className="text-[12px] leading-[24px] text-[#666666]">
              <Link href="https://undrstnd.vercel.app/">Undrstnd</Link>,
              Tunisie, Monastir 5000
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
