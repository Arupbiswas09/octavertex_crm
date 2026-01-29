import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import prisma from '@/lib/prisma';
import { Role } from '@prisma/client';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email and password are required');
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email.toLowerCase() },
                    select: {
                        id: true,
                        email: true,
                        passwordHash: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                        role: true,
                        status: true,
                        organizationId: true,
                    },
                });

                if (!user || !user.passwordHash) {
                    throw new Error('Invalid email or password');
                }

                if (user.status === 'SUSPENDED') {
                    throw new Error('Your account has been suspended');
                }

                if (user.status === 'INACTIVE') {
                    throw new Error('Your account is inactive');
                }

                const isPasswordValid = await compare(credentials.password, user.passwordHash);

                if (!isPasswordValid) {
                    throw new Error('Invalid email or password');
                }

                // Update last login
                await prisma.user.update({
                    where: { id: user.id },
                    data: { lastLogin: new Date() },
                });

                return {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    avatar: user.avatar,
                    role: user.role,
                    organizationId: user.organizationId,
                };
            },
        }),
    ],
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    pages: {
        signIn: '/login',
        error: '/login',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.firstName = user.firstName;
                token.lastName = user.lastName;
                token.avatar = user.avatar;
                token.role = user.role as Role;
                token.organizationId = user.organizationId;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.email = token.email;
                session.user.firstName = token.firstName;
                session.user.lastName = token.lastName;
                session.user.avatar = token.avatar;
                session.user.role = token.role;
                session.user.organizationId = token.organizationId;
            }
            return session;
        },
    },
    events: {
        async signIn({ user }) {
            // Log sign in event
            console.log(`User ${user.email} signed in at ${new Date().toISOString()}`);
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === 'development',
};

// Helper to check user permissions
export function hasPermission(userRole: Role, requiredRoles: Role[]): boolean {
    return requiredRoles.includes(userRole);
}

// Role hierarchy for permission checking
export const roleHierarchy: Record<Role, number> = {
    SUPER_ADMIN: 100,
    HR_ADMIN: 80,
    PROJECT_ADMIN: 70,
    TEAM_LEAD: 60,
    EMPLOYEE: 40,
    CONTRACTOR: 30,
    GUEST: 10,
};

export function hasMinimumRole(userRole: Role, minimumRole: Role): boolean {
    return roleHierarchy[userRole] >= roleHierarchy[minimumRole];
}

// Check if user can manage another user
export function canManageUser(managerRole: Role, targetRole: Role): boolean {
    return roleHierarchy[managerRole] > roleHierarchy[targetRole];
}
