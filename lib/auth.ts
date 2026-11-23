import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

import dotenv from "dotenv";
import { env } from "prisma/config";


dotenv.config({path: ".env.local"});

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),

  providers: [
    Google({
      clientId: env("AUTH_GOOGLE_ID"),
      clientSecret: env("AUTH_GOOGLE_SECRET"),
    }),
  ],

  session: {
    strategy: "database",
  },

  pages: {
    signIn: "/login",
  },

  callbacks: {
    session({ session, user }) {
      session.user.id = user.id;
      session.user.role = user.role;

      return session;
    },
  },
});