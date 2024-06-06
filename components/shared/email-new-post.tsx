import * as React from "react"
import { Classroom, Post, User } from "@prisma/client"
import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components"

import { siteConfig } from "@/config/site"

interface EmailNewPostProps {
  user: User
  teacherUser: User
  post: Post
  classroom: Classroom
}

export function EmailNewPost({
  user,
  teacherUser,
  post,
  classroom,
}: EmailNewPostProps) {
  return (
    <Html>
      <Head />
      <Preview>
        New post from {teacherUser.name!} on {classroom.name}
      </Preview>
      <Body style={main}>
        <Container>
          <Section style={logo}>
            <Img
              width={50}
              height={50}
              alt={`${siteConfig.name} logo`}
              src={`${siteConfig.url}/images/logos/Rounded.png`}
            />
          </Section>

          <Section style={content}>
            <Row>
              <Img
                style={image}
                width={620}
                src={`${siteConfig.url}/images/email/new-post.png`}
              />
            </Row>

            <Row style={{ ...boxInfos, paddingBottom: "0" }}>
              <Column>
                <Heading
                  style={{
                    fontSize: 32,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Hi {user.name},
                </Heading>
                <Heading
                  as="h2"
                  style={{
                    fontSize: 24,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  {teacherUser.name} has posted in {classroom.name}
                </Heading>

                <Text style={{ ...paragraph, marginTop: -5 }}>{post.name}</Text>
                <Text
                  style={{
                    color: "rgb(0,0,0, 0.5)",
                    fontSize: 14,
                    marginTop: -5,
                  }}
                >
                  {post.content}
                </Text>
              </Column>
            </Row>
            <Link
              href={`${siteConfig.url}/classrooms/${classroom.id}#${post.id}`}
            >
              <Row style={{ ...boxInfos, paddingTop: "0" }}>
                <Column style={containerButton} colSpan={2}>
                  <Button style={button}>View post</Button>
                </Column>
              </Row>
            </Link>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: "#fff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const paragraph = {
  fontSize: 16,
}

const logo = {
  padding: "30px 20px",
}

const containerButton = {
  display: "flex",
  justifyContent: "center",
  width: "100%",
}

const button = {
  backgroundColor: "#669ee5",
  borderRadius: 3,
  color: "#FFF",
  fontWeight: "bold",
  border: "1px solid rgb(0,0,0, 0.1)",
  cursor: "pointer",
  padding: "12px 30px",
}

const content = {
  border: "1px solid rgb(0,0,0, 0.1)",
  borderRadius: "3px",
  overflow: "hidden",
}

const image = {
  maxWidth: "100%",
}

const boxInfos = {
  padding: "20px",
}
