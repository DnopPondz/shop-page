import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import LineProvider from "next-auth/providers/line";
import AppleProvider from "next-auth/providers/apple";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: "jwt", // Required when using Credentials provider
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
    LineProvider({
      clientId: process.env.LINE_CLIENT_ID,
      clientSecret: process.env.LINE_CLIENT_SECRET,
      authorization: { params: { scope: "profile openid email" } },
    }),
    AppleProvider({
      clientId: process.env.APPLE_ID,
      clientSecret: process.env.APPLE_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const client = await clientPromise;
        const db = client.db();

        // 1. Find user by email
        const user = await db.collection("users").findOne({ email: credentials.email });

        // 2. Check if user exists
        if (!user) {
          throw new Error("No user found with this email.");
        }

        // 3. Check if user has a password (if they signed up via Social, they won't have one)
        if (!user.password) {
          throw new Error("This email is registered via Social Login. Please login with Google/Facebook/Line.");
        }

        // 4. *** CRITICAL: Check if user is verified ***
        // If user registered via email/pass, they must verify OTP first.
        // Social logins usually default verified to true or don't have this field checked here.
        if (user.isVerified === false) {
           throw new Error("Please verify your email via OTP before logging in.");
        }

        // 5. Validate Password
        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error("Invalid password.");
        }

        // 6. Return user object (NextAuth will use this to build the token)
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role || "customer",
          image: user.image || "",
        };
      },
    }),
  ],
  callbacks: {
    // 1. JWT Callback: Runs whenever a token is created or updated
    async jwt({ token, user, trigger, session }) {
      if (user) {
        // Add custom fields from 'authorize' return to the token
        token.id = user.id;
        token.role = user.role;
      }
      
      // Update session manually (e.g. after editing profile)
      if (trigger === "update" && session) {
        return { ...token, ...session.user };
      }
      
      return token;
    },
    // 2. Session Callback: Runs when the client calls useSession()
    async session({ session, token }) {
      if (token) {
        // Add custom fields from token to the session
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login", // Redirect to our custom login page if needed
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };