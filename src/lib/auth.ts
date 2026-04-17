import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  providers: [
    // ─── Google OAuth ─────────────────────────────────────────────────────────
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),

    // ─── Email / Password ─────────────────────────────────────────────────────
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required.');
        }

        await connectDB();

        const user = await User.findOne({ email: credentials.email.toLowerCase() });

        if (!user) {
          throw new Error('No account found with this email address.');
        }

        if (!user.password) {
          throw new Error('This account was created with Google. Please sign in with Google.');
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error('Incorrect password. Please try again.');
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],

  callbacks: {
    // On Google sign-in — upsert the user in MongoDB
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        try {
          await connectDB();
          await User.findOneAndUpdate(
            { email: user.email },
            {
              $setOnInsert: {
                name: user.name,
                email: user.email,
                image: user.image,
                emailVerified: new Date(),
              },
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
          );
        } catch {
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user && token.id) {
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
};
