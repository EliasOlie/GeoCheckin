import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { env } from "@/env.mjs";

import { db } from "@/server/db";
import CredentialsProvider from "next-auth/providers/credentials";
import * as bcrypt from "bcrypt";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: number;
      // ...other properties
      // role: UserRole;
    };
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    CredentialsProvider({
      name: `GeoCheckin`,
      credentials: {
        contact: {
          label: "Contato",
          type: "text",
          placeholder: "Seu numero de contato",
        },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials, _req) {
        if (!credentials) {
          return null;
        }

        const user = await db.user.findUnique({
          where: {
            contact: credentials.contact,
          },
        });

        if (user) {
          if (bcrypt.compareSync(credentials.password, user.password)) {
            return new Promise((resolve) =>
              resolve({ ...user, id: user.id.toString() }),
            );
          } else {
            return null;
          }
        } else {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30,
  },

  callbacks: {
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
        },
      };
    },
  },

  secret: env.NEXTAUTH_SECRET,
  debug: env.NODE_ENV === "development",

  pages: {
    signIn: "/",
  },
};

export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
