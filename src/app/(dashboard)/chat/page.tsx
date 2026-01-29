'use client';

import { useState, useRef, useEffect } from 'react';
import {
    Search,
    Plus,
    Hash,
    Lock,
    Users,
    Settings,
    Send,
    Smile,
    Paperclip,
    MoreHorizontal,
    Phone,
    Video,
    Pin,
    Star,
    AtSign,
    Image as ImageIcon,
    X,
} from 'lucide-react';
import { Card, Button, Input, Avatar, Badge } from '@/components/ui';
import { cn, formatRelativeTime, getInitials } from '@/utils/helpers';
import { useChatStore } from '@/stores';

// Mock data
const channels = [
    { id: '1', name: 'general', type: 'PUBLIC', unread: 3, lastMessage: 'Hey team, check out the new designs!' },
    { id: '2', name: 'website-redesign', type: 'PROJECT', unread: 0, lastMessage: 'Updated the homepage mockups' },
    { id: '3', name: 'mobile-app-v2', type: 'PROJECT', unread: 5, lastMessage: 'Build is ready for testing' },
    { id: '4', name: 'marketing', type: 'TEAM', unread: 0, lastMessage: 'Campaign metrics are looking good' },
    { id: '5', name: 'announcements', type: 'PUBLIC', unread: 1, lastMessage: 'Office closed next Monday' },
    { id: '6', name: 'random', type: 'PUBLIC', unread: 0, lastMessage: 'Anyone up for lunch?' },
];

const directMessages = [
    { id: '1', name: 'Sarah Chen', avatar: null, status: 'online', unread: 2, lastMessage: 'Can you review my PR?' },
    { id: '2', name: 'Mike Wilson', avatar: null, status: 'away', unread: 0, lastMessage: 'Sure, sounds good!' },
    { id: '3', name: 'Emily Brown', avatar: null, status: 'offline', unread: 0, lastMessage: 'Thanks for the help!' },
    { id: '4', name: 'David Lee', avatar: null, status: 'online', unread: 0, lastMessage: 'Meeting at 3pm?' },
];

const mockMessages = [
    {
        id: '1',
        sender: { id: '1', name: 'Sarah Chen', avatar: null },
        content: 'Hey everyone! 👋 Just pushed the new navigation component. Can someone take a look?',
        timestamp: '2025-01-30T09:15:00',
        reactions: { '👍': ['2', '3'], '🎉': ['4'] },
    },
    {
        id: '2',
        sender: { id: '2', name: 'Mike Wilson', avatar: null },
        content: 'Nice work! I\'ll review it after the standup.',
        timestamp: '2025-01-30T09:18:00',
        reactions: {},
    },
    {
        id: '3',
        sender: { id: '3', name: 'Emily Brown', avatar: null },
        content: 'The animations look really smooth. Great job with the transitions!',
        timestamp: '2025-01-30T09:22:00',
        reactions: { '❤️': ['1'] },
    },
    {
        id: '4',
        sender: { id: '1', name: 'Sarah Chen', avatar: null },
        content: 'Thanks team! @David Lee can you test it on mobile when you get a chance?',
        timestamp: '2025-01-30T09:25:00',
        reactions: {},
        mentions: ['David Lee'],
    },
    {
        id: '5',
        sender: { id: '4', name: 'David Lee', avatar: null },
        content: 'Sure thing! Will do it right now. 📱',
        timestamp: '2025-01-30T09:28:00',
        reactions: { '🙏': ['1'] },
    },
    {
        id: '6',
        sender: { id: '4', name: 'David Lee', avatar: null },
        content: 'Tested on iPhone and Android - looks great on both! Just noticed a small issue with the dropdown on smaller screens. I\'ll add a comment on the PR.',
        timestamp: '2025-01-30T09:35:00',
        reactions: { '👀': ['1', '2'] },
    },
    {
        id: '7',
        sender: { id: '2', name: 'Mike Wilson', avatar: null },
        content: 'Review done! Left a few suggestions but overall it\'s good to go. Great work Sarah! 🚀',
        timestamp: '2025-01-30T09:45:00',
        reactions: { '🎉': ['1', '3', '4'], '🚀': ['1'] },
    },
];

const channelIconMap: Record<string, React.ReactNode> = {
    PUBLIC: <Hash className="h-4 w-4" />,
    PRIVATE: <Lock className="h-4 w-4" />,
    PROJECT: <Hash className="h-4 w-4" />,
    TEAM: <Users className="h-4 w-4" />,
};

const statusColors: Record<string, string> = {
    online: 'bg-emerald-500',
    away: 'bg-amber-500',
    offline: 'bg-slate-400',
    busy: 'bg-red-500',
};

export default function ChatPage() {
    const { activeChannelId, setActiveChannel } = useChatStore();
    const [message, setMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [showChannelInfo, setShowChannelInfo] = useState(false);

    const currentChannel = channels.find(c => c.id === activeChannelId) || channels[0];

    useEffect(() => {
        if (!activeChannelId) {
            setActiveChannel(channels[0].id);
        }
    }, [activeChannelId, setActiveChannel]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [mockMessages]);

    const handleSendMessage = () => {
        if (!message.trim()) return;
        // In production, this would send to the API
        console.log('Sending message:', message);
        setMessage('');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            {/* Sidebar */}
            <div className="w-72 border-r border-slate-200 dark:border-slate-800 flex flex-col">
                {/* Sidebar Header */}
                <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-10 pl-10 pr-4 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm border-0 focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                {/* Channels List */}
                <div className="flex-1 overflow-y-auto py-4">
                    {/* Channels Section */}
                    <div className="px-4 mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Channels</span>
                            <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                                <Plus className="h-4 w-4 text-slate-500" />
                            </button>
                        </div>
                        <div className="space-y-0.5">
                            {channels.map((channel) => (
                                <button
                                    key={channel.id}
                                    onClick={() => setActiveChannel(channel.id)}
                                    className={cn(
                                        'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors',
                                        activeChannelId === channel.id
                                            ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400'
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    )}
                                >
                                    <span className="text-slate-400">{channelIconMap[channel.type]}</span>
                                    <span className="flex-1 truncate font-medium">{channel.name}</span>
                                    {channel.unread > 0 && (
                                        <span className="px-2 py-0.5 text-xs font-semibold bg-indigo-500 text-white rounded-full">
                                            {channel.unread}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Direct Messages Section */}
                    <div className="px-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Direct Messages</span>
                            <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                                <Plus className="h-4 w-4 text-slate-500" />
                            </button>
                        </div>
                        <div className="space-y-0.5">
                            {directMessages.map((dm) => (
                                <button
                                    key={dm.id}
                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                                >
                                    <div className="relative">
                                        <Avatar src={dm.avatar} fallback={getInitials(dm.name.split(' ')[0], dm.name.split(' ')[1] || '')} size="sm" />
                                        <span className={cn('absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-slate-900', statusColors[dm.status])} />
                                    </div>
                                    <span className="flex-1 truncate font-medium">{dm.name}</span>
                                    {dm.unread > 0 && (
                                        <span className="px-2 py-0.5 text-xs font-semibold bg-indigo-500 text-white rounded-full">
                                            {dm.unread}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
                {/* Chat Header */}
                <div className="h-16 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-slate-400">{channelIconMap[currentChannel.type]}</span>
                        <div>
                            <h2 className="font-semibold text-slate-900 dark:text-white">{currentChannel.name}</h2>
                            <p className="text-xs text-slate-500">12 members</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                            <Phone className="h-5 w-5 text-slate-500" />
                        </Button>
                        <Button variant="ghost" size="icon">
                            <Video className="h-5 w-5 text-slate-500" />
                        </Button>
                        <Button variant="ghost" size="icon">
                            <Pin className="h-5 w-5 text-slate-500" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setShowChannelInfo(!showChannelInfo)}>
                            <Settings className="h-5 w-5 text-slate-500" />
                        </Button>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {mockMessages.map((msg) => (
                        <div key={msg.id} className="flex gap-3 group">
                            <Avatar
                                src={msg.sender.avatar}
                                fallback={getInitials(msg.sender.name.split(' ')[0], msg.sender.name.split(' ')[1] || '')}
                                size="md"
                            />
                            <div className="flex-1">
                                <div className="flex items-baseline gap-2 mb-1">
                                    <span className="font-semibold text-slate-900 dark:text-white">{msg.sender.name}</span>
                                    <span className="text-xs text-slate-400">{formatRelativeTime(msg.timestamp)}</span>
                                </div>
                                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                    {msg.content.split(/(@\w+\s\w+)/g).map((part, i) =>
                                        part.startsWith('@') ? (
                                            <span key={i} className="text-indigo-600 dark:text-indigo-400 font-medium bg-indigo-100 dark:bg-indigo-900/30 px-1 rounded">
                                                {part}
                                            </span>
                                        ) : (
                                            part
                                        )
                                    )}
                                </p>
                                {Object.keys(msg.reactions).length > 0 && (
                                    <div className="flex gap-1.5 mt-2">
                                        {Object.entries(msg.reactions).map(([emoji, users]) => (
                                            <button
                                                key={emoji}
                                                className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-full text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                            >
                                                <span>{emoji}</span>
                                                <span className="text-slate-600 dark:text-slate-400">{users.length}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                                    <Smile className="h-4 w-4 text-slate-400" />
                                </button>
                                <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                                    <MoreHorizontal className="h-4 w-4 text-slate-400" />
                                </button>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-end gap-3 bg-slate-100 dark:bg-slate-800 rounded-2xl p-2">
                        <div className="flex items-center gap-1">
                            <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors">
                                <Plus className="h-5 w-5 text-slate-500" />
                            </button>
                            <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors">
                                <ImageIcon className="h-5 w-5 text-slate-500" />
                            </button>
                            <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors">
                                <Paperclip className="h-5 w-5 text-slate-500" />
                            </button>
                        </div>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder={`Message #${currentChannel.name}`}
                            rows={1}
                            className="flex-1 bg-transparent border-0 resize-none focus:ring-0 text-slate-900 dark:text-white placeholder:text-slate-400 py-2"
                        />
                        <div className="flex items-center gap-1">
                            <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors">
                                <AtSign className="h-5 w-5 text-slate-500" />
                            </button>
                            <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors">
                                <Smile className="h-5 w-5 text-slate-500" />
                            </button>
                            <Button
                                onClick={handleSendMessage}
                                disabled={!message.trim()}
                                className="h-10 w-10 p-0"
                            >
                                <Send className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                    <p className="mt-2 text-xs text-slate-400 text-center">
                        Press <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-slate-600 dark:text-slate-300">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-slate-600 dark:text-slate-300">Shift + Enter</kbd> for new line
                    </p>
                </div>
            </div>

            {/* Channel Info Sidebar */}
            {showChannelInfo && (
                <div className="w-80 border-l border-slate-200 dark:border-slate-800 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-slate-900 dark:text-white">Channel Details</h3>
                        <button onClick={() => setShowChannelInfo(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                            <X className="h-5 w-5 text-slate-400" />
                        </button>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Hash className="h-5 w-5 text-slate-400" />
                                <span className="font-semibold text-slate-900 dark:text-white">{currentChannel.name}</span>
                            </div>
                            <p className="text-sm text-slate-500">
                                This is the main channel for the {currentChannel.name} project. Share updates, ask questions, and collaborate with your team.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Members (12)</h4>
                            <div className="space-y-2">
                                {directMessages.slice(0, 4).map((member) => (
                                    <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                                        <Avatar src={member.avatar} fallback={getInitials(member.name.split(' ')[0], member.name.split(' ')[1] || '')} size="sm" status={member.status as 'online' | 'offline' | 'away'} />
                                        <span className="text-sm text-slate-700 dark:text-slate-300">{member.name}</span>
                                    </div>
                                ))}
                                <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                                    View all members →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
