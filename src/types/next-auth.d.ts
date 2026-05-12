import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      username?: string | null;
      image?: string | null;
      role?: string;
      department?: string | null;
      token?: string;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    username?: string | null;
    image?: string | null;
    role?: string;
    department?: string | null;
    token?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    role?: string;
    department?: string | null;
    username?: string | null;
    name?: string | null;
  }
}