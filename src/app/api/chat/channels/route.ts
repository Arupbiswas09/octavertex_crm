import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Define proper types
interface ChannelMembership {
    channel: {
        id: string;
        name: string | null;
        description: string | null;
        type: string;
        messages: Array<{
            sender: {
                id: string;
                firstName: string;
                lastName: string;
            };
            content: string;
            createdAt: Date;
        }>;
        members: Array<{
            user: {
                id: string;
                firstName: string;
                lastName: string;
                avatar: string | null;
            };
        }>;
    };
    lastRead: Date;
}

// GET /api/chat/channels - Get all channels for user
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get channels the user is a member of
        const memberships = await prisma.channelMember.findMany({
            where: { userId: session.user.id },
            include: {
                channel: {
                    include: {
                        members: {
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                        firstName: true,
                                        lastName: true,
                                        avatar: true,
                                    },
                                },
                            },
                        },
                        messages: {
                            orderBy: { createdAt: 'desc' },
                            take: 1,
                            include: {
                                sender: {
                                    select: {
                                        id: true,
                                        firstName: true,
                                        lastName: true,
                                    },
                                },
                            },
                        },
                        _count: {
                            select: { messages: true },
                        },
                    },
                },
            },
        });

        const channels = memberships.map((m: ChannelMembership) => ({
            ...m.channel,
            lastMessage: m.channel.messages[0] || null,
        }));

        return NextResponse.json({ channels });
    } catch (error) {
        console.error('Error fetching channels:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST /api/chat/channels - Create a new channel
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, description, type, memberIds } = body;

        if (!name) {
            return NextResponse.json({ error: 'Channel name is required' }, { status: 400 });
        }

        // Create channel
        const channel = await prisma.channel.create({
            data: {
                name: name.toLowerCase().replace(/\s+/g, '-'),
                description,
                type: type || 'PUBLIC',
                members: {
                    create: [
                        { userId: session.user.id },
                        ...(memberIds || []).map((id: string) => ({ userId: id })),
                    ],
                },
            },
            include: {
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                avatar: true,
                            },
                        },
                    },
                },
            },
        });

        return NextResponse.json({ channel });
    } catch (error) {
        console.error('Error creating channel:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
