import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"

import { prisma } from "@/lib/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
                role: { label: "Role", type: "text" }
            },
            async authorize(credentials) {
                // This is a naive implementation for the POC to allow login without Google
                // In a real app, you would hash passwords and verify them
                // Here we just find or create a user with the email
                if (!credentials?.email) return null;

                const email = credentials.email as string;
                const role = (credentials.role as string) || "TENANT";

                // Check if user exists
                let user = await prisma.user.findUnique({
                    where: { email }
                });

                // For POC simplicity: If using credentials and user doesn't exist, create one
                // This mirrors "Magic Link" behavior but with a dummy password check
                if (!user) {
                    user = await prisma.user.create({
                        data: {
                            email,
                            name: email.split("@")[0],
                            role: role.toUpperCase(), // Default role
                        }
                    });
                }

                // Return user with role (NextAuth types extended via module augmentation)
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    role: user.role,
                };
            }
        })
    ],
    callbacks: {
        async session({ session, user, token }) {
            if (session.user && token.sub) {
                session.user.id = token.sub;
            }
            if (session.user && token.role) {
                session.user.role = token.role as "OWNER" | "TENANT";
            }
            return session
        },
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                token.role = (user as any).role || "TENANT";
            }
            // If updating session properties
            if (trigger === "update" && session?.user?.role) {
                token.role = session.user.role;
            }
            return token;
        }
    },
    session: {
        strategy: "jwt", // Use JWT for easier session handling in this setup
    },
    pages: {
        signIn: '/login', // Redirect to our custom login page
    },
    trustHost: true,
})
