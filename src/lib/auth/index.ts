import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { db, profiles } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        // For MVP: simple email-based auth (add proper password hashing later)
        const { email } = parsed.data;

        let user = await db.query.profiles.findFirst({
          where: eq(profiles.email, email),
        });

        if (!user) {
          // Auto-create user for MVP
          const [newUser] = await db
            .insert(profiles)
            .values({ email })
            .returning();
          user = newUser;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.displayName,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
});
