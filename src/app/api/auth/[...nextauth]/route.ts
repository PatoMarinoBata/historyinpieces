import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        console.log('Attempting login with email:', credentials.email);
        console.log('Password from form:', credentials.password);

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        console.log('User found:', user);

        if (!user || !user.password) {
          console.log('User not found or no password hash');
          return null;
        }

        const isValid = await bcrypt.compare(credentials.password as string, user.password);

        console.log('Password hash:', user.password);
        console.log('Password match:', isValid);

        if (!isValid) {
          console.log('Password mismatch - compare failed');
          return null;
        }

        return { id: user.id, email: user.email, name: user.name, role: user.role };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }: any) {
      if (session.user) {
        session.user.role = token.role as string;
      }
      return session;
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};

const { handlers: { GET, POST }, auth } = NextAuth(authOptions);

export { GET, POST, auth };