import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { db, profiles } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string(),
  password: z.string().min(1),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        // Check for admin login
        if (
          email === process.env.ADMIN_EMAIL &&
          password === process.env.ADMIN_PASSWORD
        ) {
          // Find or create admin user
          let adminUser = await db.query.profiles.findFirst({
            where: eq(profiles.email, 'admin@ailit.dev'),
          });

          if (!adminUser) {
            const [newAdmin] = await db
              .insert(profiles)
              .values({
                email: 'admin@ailit.dev',
                displayName: 'Admin',
                role: 'admin',
              })
              .returning();
            adminUser = newAdmin;
          } else if (adminUser.role !== 'admin') {
            // Ensure role is admin
            await db
              .update(profiles)
              .set({ role: 'admin' })
              .where(eq(profiles.id, adminUser.id));
            adminUser = { ...adminUser, role: 'admin' };
          }

          return {
            id: adminUser.id,
            email: adminUser.email,
            name: adminUser.displayName || 'Admin',
            role: 'admin',
          };
        }

        // Regular user login (email-based for MVP)
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
          role: user.role || 'user',
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || 'user';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
});
