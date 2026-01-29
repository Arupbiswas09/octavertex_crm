import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';
import { Role } from '@prisma/client';

declare module 'next-auth' {
    interface Session extends DefaultSession {
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            avatar: string | null;
            role: Role;
            organizationId: string | null;
        } & DefaultSession['user'];
    }

    interface User extends DefaultUser {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        avatar: string | null;
        role: Role;
        organizationId: string | null;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        avatar: string | null;
        role: Role;
        organizationId: string | null;
    }
}
