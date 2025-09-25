import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
  ],
  pages: {
    error: "/google-auth-error",
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        // You can also send token.id_token or access_token to your backend here
        (token as any).accessToken = (account as any).access_token;
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).accessToken = (token as any).accessToken;
      // expose provider user id (google sub) for client to post to API
      (session as any).socialId = (token as any).sub;
      return session;
    },
  },
});

export { handler as GET, handler as POST };


