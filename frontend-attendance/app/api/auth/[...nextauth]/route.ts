import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      googleId?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    googleId?: string;
  }
}


const handler = NextAuth({ 
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!
      })
    ],
    callbacks: {
      async jwt({ token, account }) {
      if (account) {
        token.googleId = account.providerAccountId; // ✅ REAL GOOGLE ID
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.googleId = token.googleId; // ✅ now available in frontend
      }
      return session;
    },
      async signIn({ user }) {
      // when user logs in, send data to backend
      await fetch("http://192.168.0.195:4000/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          googleId: user.id
        })
      });

      return true;
    }
    }
});


export { handler as GET, handler as POST };