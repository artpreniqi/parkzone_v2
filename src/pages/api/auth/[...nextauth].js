import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions = {
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      async authorize(credentials) {
        await dbConnect();
        const user = await User.findOne({ email: credentials.email });
        if (!user) throw new Error("Email-i nuk u gjet!");
        const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordCorrect) throw new Error("Fjalëkalimi i gabuar!");
        return { id: user._id.toString(), name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google") {
        await dbConnect();
        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          await User.create({
            name: user.name,
            email: user.email,
            password: await bcrypt.hash(Math.random().toString(36), 12),
            role: "user",
            image: user.image, 
            phone: ""
          });
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        // Ruajmë vetëm gjërat e lehta në biletë (cookie)
        token.role = user.role || "user";
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },
  },
  pages: { signIn: "/login" },
};

export default NextAuth(authOptions);