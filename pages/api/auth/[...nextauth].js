import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { Session, User } from "next-auth";
import Handlebars from "handlebars";
import { readFileSync } from "fs";
import path from "path";
import nodemailer from "nodemailer";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import queryString from "query-string";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: process.env.EMAIL_SERVER_PORT,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
  secure: true,
});

const emailsDir = path.resolve(process.cwd(), "emails");

const sendVerificationRequest = async ({ identifier: email, url }) => {
  const parsedUrl = queryString.parse(decodeURIComponent(url));
  if (
    parsedUrl[
      "http://localhost:3000/api/auth/callback/email?callbackUrl"
    ].includes("user-pass=true")
  ) {
    await prisma.link.create({
      data: {
        value: url,
        email: email,
      },
    });
  } else {
    const emailFile = readFileSync(path.join(emailsDir, "confirm-email.html"), {
      encoding: "utf8",
    });
    const emailTemplate = Handlebars.compile(emailFile);
    transporter.sendMail({
      from: `"🍲 FavoriteFoods" ${process.env.EMAIL_FROM}`,
      to: email,
      subject: "Your sign-in link for FavoriteFoods",
      html: emailTemplate({
        base_url: process.env.NEXTAUTH_URL,
        signin_url: url,
        email: email,
      }),
    });
  }
};

const sendWelcomeEmail = async ({ user }) => {
  const { email } = user;

  try {
    const emailFile = readFileSync(path.join(emailsDir, "welcome.html"), {
      encoding: "utf8",
    });
    const emailTemplate = Handlebars.compile(emailFile);
    await transporter.sendMail({
      from: `"🍲 FavoriteFoods" ${process.env.EMAIL_FROM}`,
      to: email,
      subject: "Welcome to FavoriteFoods! 🎉",
      html: emailTemplate({
        base_url: process.env.NEXTAUTH_URL,
        support_email: "support@themodern.dev",
      }),
    });
  } catch (error) {
    console.log(`❌ Unable to send welcome email to user (${email})`);
  }
};

export default NextAuth({
  providers: [
    EmailProvider({
      // server: process.env.EMAIL_SERVER,
      // from: process.env.EMAIL_FROM,
      maxAge: 10 * 60, // Magic links are valid for 10 min only
      sendVerificationRequest,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/",
    signOut: "/",
    error: "/",
    verifyRequest: "/",
  },
  events: { createUser: sendWelcomeEmail },
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }) {
      user && (token.user = user);
      return token;
    },
    async session({ session, token, user }) {
      session = {
        ...session,
        user: {
          id: user.id,
          username: user.username,
          ...session.user,
        },
      };
      return session;
    },
  },
});
