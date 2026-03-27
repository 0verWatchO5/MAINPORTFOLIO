import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export function isAdminEmail(email?: string | null) {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail || !email) {
    return false;
  }

  return email.toLowerCase() === adminEmail.toLowerCase();
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Admin Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminEmail || !adminPassword) {
          console.error("Missing ADMIN_EMAIL or ADMIN_PASSWORD in environment variables");
          return null;
        }

        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const emailMatches =
          credentials.email.toLowerCase() === adminEmail.toLowerCase();
        const passwordMatches = credentials.password === adminPassword;

        if (!emailMatches || !passwordMatches) {
          return null;
        }

        return {
          id: "admin",
          email: adminEmail,
          name: "Admin",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.email) {
        token.isAdmin = isAdminEmail(user.email);
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.isAdmin = Boolean(token.isAdmin);
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
};
