import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id?: string | null;
      role?: string;
      department_id?: string;
      username?: string;
    } & DefaultSession['user'],
    accessToken: string
  }

  export interface User extends DefaultUser {
    id?: string;
    role?: string;
    department_id?: string;
    username?: string;
  }
}
