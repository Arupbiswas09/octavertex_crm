import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const registerSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    organizationName: z.string().optional(),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const validatedData = registerSchema.parse(body);

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: validatedData.email.toLowerCase() },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'An account with this email already exists' },
                { status: 400 }
            );
        }

        // Hash password
        const passwordHash = await hash(validatedData.password, 12);

        // Create organization if name provided
        let organizationId: string | undefined;
        if (validatedData.organizationName) {
            const organization = await prisma.organization.create({
                data: {
                    name: validatedData.organizationName,
                    slug: validatedData.organizationName.toLowerCase().replace(/\s+/g, '-'),
                },
            });
            organizationId = organization.id;

            // Create default leave types for the organization
            await prisma.leaveType.createMany({
                data: [
                    { name: 'Casual Leave', defaultDays: 12, color: '#3b82f6', organizationId: organization.id },
                    { name: 'Sick Leave', defaultDays: 12, color: '#ef4444', organizationId: organization.id },
                    { name: 'Earned Leave', defaultDays: 15, color: '#10b981', carryForward: true, maxCarryForward: 30, organizationId: organization.id },
                    { name: 'Unpaid Leave', defaultDays: 0, color: '#6b7280', paid: false, organizationId: organization.id },
                ],
            });

            // Create default shift
            await prisma.shift.create({
                data: {
                    name: 'Standard',
                    startTime: '09:00',
                    endTime: '18:00',
                    breakDuration: 60,
                    workDays: [1, 2, 3, 4, 5],
                    organizationId: organization.id,
                },
            });
        }

        // Create user
        const user = await prisma.user.create({
            data: {
                email: validatedData.email.toLowerCase(),
                passwordHash,
                firstName: validatedData.firstName,
                lastName: validatedData.lastName,
                role: organizationId ? 'SUPER_ADMIN' : 'EMPLOYEE',
                status: 'ACTIVE',
                organizationId,
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
            },
        });

        // Create audit log
        await prisma.auditLog.create({
            data: {
                userId: user.id,
                action: 'USER_REGISTERED',
                entity: 'User',
                entityId: user.id,
                changes: {
                    email: user.email,
                    role: user.role,
                },
            },
        });

        return NextResponse.json({
            success: true,
            message: 'Account created successfully',
            user,
        });
    } catch (error) {
        console.error('Registration error:', error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: error.errors[0].message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to create account' },
            { status: 500 }
        );
    }
}
