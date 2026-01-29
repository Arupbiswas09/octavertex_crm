import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/chat/channels/[channelId]/messages - Get messages for a channel
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ channelId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { channelId } = await params;
        const { searchParams } = new URL(request.url);
        const cursor = searchParams.get('cursor');
        const limit = parseInt(searchParams.get('limit') || '50');

        // Check if user is a member of the channel
        const membership = await prisma.channelMember.findUnique({
            where: {
                channelId_userId: {
                    channelId,
                    userId: session.user.id,
                },
            },
        });

        if (!membership) {
            return NextResponse.json({ error: 'Not a member of this channel' }, { status: 403 });
        }

        // Get messages
        const messages = await prisma.chatMessage.findMany({
            where: { channelId },
            take: limit,
            skip: cursor ? 1 : 0,
            cursor: cursor ? { id: cursor } : undefined,
            orderBy: { createdAt: 'desc' },
            include: {
                sender: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                    },
                },
                replies: {
                    include: {
                        sender: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                avatar: true,
                            },
                        },
                    },
                    orderBy: { createdAt: 'asc' },
                },
            },
        });

        // Update last read time
        await prisma.channelMember.update({
            where: {
                channelId_userId: {
                    channelId,
                    userId: session.user.id,
                },
            },
            data: {
                lastRead: new Date(),
            },
        });

        return NextResponse.json({
            messages: messages.reverse(),
            nextCursor: messages.length === limit ? messages[0]?.id : null,
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST /api/chat/channels/[channelId]/messages - Send a message
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ channelId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { channelId } = await params;
        const body = await request.json();
        const { content, parentId, mentions } = body;

        if (!content?.trim()) {
            return NextResponse.json({ error: 'Message content is required' }, { status: 400 });
        }

        // Check if user is a member of the channel
        const membership = await prisma.channelMember.findUnique({
            where: {
                channelId_userId: {
                    channelId,
                    userId: session.user.id,
                },
            },
        });

        if (!membership) {
            return NextResponse.json({ error: 'Not a member of this channel' }, { status: 403 });
        }

        // Create message
        const message = await prisma.chatMessage.create({
            data: {
                content,
                channelId,
                senderId: session.user.id,
                parentId: parentId || null,
                mentions: mentions || [],
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                    },
                },
            },
        });

        // Create notifications for mentions
        if (mentions && mentions.length > 0) {
            await prisma.notification.createMany({
                data: mentions.map((userId: string) => ({
                    type: 'MENTION' as const,
                    title: 'You were mentioned',
                    message: `${session.user?.firstName} mentioned you in a channel`,
                    userId,
                    actionUrl: `/chat?channel=${channelId}`,
                })),
            });
        }

        return NextResponse.json({ message });
    } catch (error) {
        console.error('Error sending message:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
