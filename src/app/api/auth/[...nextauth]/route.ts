import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { findUserByEmail } from "@/lib/users"; // Assuming @ points to src
import { compare } from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        // NextAuth.js expects username, but we'll use email.
        // The label will show "Email" in the UI.
        email: { label: "Email", type: "email", placeholder: "john.doe@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials || !credentials.email || !credentials.password) {
          console.log("Missing credentials");
          return null;
        }

        const user = findUserByEmail(credentials.email);

        if (user) {
          const isPasswordCorrect = await compare(
            credentials.password,
            user.password
          );

          if (isPasswordCorrect) {
            // Return user object without password
            return { id: user.id, email: user.email, name: user.email }; // 'name' can be user.name if you add it
          } else {
            console.log("Password incorrect for user:", user.email);
            return null; // Password incorrect
          }
        } else {
          console.log("User not found:", credentials.email);
          return null; // User not found
        }
      }
    })
  ],
  pages: {
    signIn: '/login', // Optional: specify custom sign-in page
    // error: '/auth/error', // Optional: specify custom error page
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // token.email = user.email; // email is already included by default
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        // session.user.email is already handled
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-here', // Use environment variable
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
