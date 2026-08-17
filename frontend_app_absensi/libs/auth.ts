import axios from "axios";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import authConfig from "@/auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,

  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        username: {},
        password: {},
      },

      async authorize(credentials) {
        const response = await axios.post(
          `${process.env.NEXTAUTH_URL}/api/auth/sign-in`,
          {
            username: credentials.username,
            password: credentials.password,
          }
        );

        const { user } = response.data;

        if (!user) return null;

        return user;
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
    updateAge: 60,
  },

  jwt: {
    maxAge: 60 * 60,
  },

  callbacks: {
    ...authConfig.callbacks,

    async jwt({ token, user, trigger, session }: any) {
      if (user) {
        token.user = {
          id: user.id,
          username: user.username,
          role: user.role,
          department_id: user.department_id,
        };

        token.accessToken = user.token;
      }

      if (trigger === "update" && session?.user) {
        token.user = {
          ...token.user,
          ...session.user,
        };
      }

      return token;
    },

    async session({ session, token }: any) {
      session.user = token.user;
      session.accessToken = token.accessToken;
      return session;
    },
  },

  trustHost: true,
});