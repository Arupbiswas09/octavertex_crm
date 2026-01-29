'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
    TrendingUp,
    TrendingDown,
    Clock,
    CheckCircle2,
    AlertCircle,
    Calendar,
    FolderKanban,
    Users,
    Timer,
    ArrowRight,
    Play,
    Pause,
    Coffee,
    LogOut as LogOutIcon,
} from 'lucide-react';
import { Card, CardContent, CardHeader, Button, Badge, Avatar, Progress, AvatarGroup } from '@/components/ui';
import { useAttendanceStore } from '@/stores';
import { cn, formatTime, formatDuration } from '@/utils/helpers';

// Mock data for dashboard
const stats = [
    {
        title: 'Active Projects',
        value: '12',
        change: '+2',
        trend: 'up',
        icon: FolderKanban,
        color: 'from-indigo-500 to-purple-500',
    },
    {
        title: 'Tasks Due Today',
        value: '8',
        change: '-3',
        trend: 'down',
        icon: CheckCircle2,
        color: 'from-emerald-500 to-teal-500',
    },
    {
        title: 'Hours This Week',
        value: '32.5',
        change: '+4.5',
        trend: 'up',
        icon: Clock,
        color: 'from-amber-500 to-orange-500',
    },
    {
        title: 'Team Members',
        value: '24',
        change: '+1',
        trend: 'up',
        icon: Users,
        color: 'from-rose-500 to-pink-500',
    },
];

const recentProjects = [
    { id: '1', name: 'Website Redesign', status: 'ACTIVE', progress: 75, color: '#6366f1', team: 5 },
    { id: '2', name: 'Mobile App v2.0', status: 'ACTIVE', progress: 45, color: '#10b981', team: 8 },
    { id: '3', name: 'Marketing Campaign', status: 'PLANNING', progress: 20, color: '#f59e0b', team: 4 },
    { id: '4', name: 'API Integration', status: 'ACTIVE', progress: 90, color: '#ec4899', team: 3 },
];

const todayTasks = [
    { id: '1', title: 'Review design mockups', priority: 'HIGH', project: 'Website Redesign', dueTime: '10:00 AM' },
    { id: '2', title: 'Fix login bug', priority: 'URGENT', project: 'Mobile App v2.0', dueTime: '11:30 AM' },
    { id: '3', title: 'Update API documentation', priority: 'MEDIUM', project: 'API Integration', dueTime: '2:00 PM' },
    { id: '4', title: 'Team standup meeting', priority: 'LOW', project: 'General', dueTime: '3:00 PM' },
];

const upcomingLeaves = [
    { id: '1', user: 'Sarah Chen', type: 'Vacation', startDate: 'Feb 5', endDate: 'Feb 8', avatar: null },
    { id: '2', user: 'Mike Johnson', type: 'Sick Leave', startDate: 'Feb 6', endDate: 'Feb 6', avatar: null },
];

const priorityColors: Record<string, string> = {
    LOW: 'bg-slate-100 text-slate-700',
    MEDIUM: 'bg-blue-100 text-blue-700',
    HIGH: 'bg-orange-100 text-orange-700',
    URGENT: 'bg-red-100 text-red-700',
};

export default function DashboardPage() {
    const { data: session } = useSession();
    const { isClockedIn, clockInTime, isOnBreak, clockIn, clockOut, startBreak, endBreak } = useAttendanceStore();
    const user = session?.user;

    const currentTime = new Date();
    const greeting = currentTime.getHours() < 12 ? 'Good morning' : currentTime.getHours() < 18 ? 'Good afternoon' : 'Good evening';

    const handleClockIn = () => {
        // In production, this would call the API
        clockIn('temp-id-' + Date.now());
    };

    const handleClockOut = () => {
        clockOut();
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">
                        {greeting}, {user?.firstName}! 👋
                    </h1>
                    <p className="mt-1 text-slate-500 dark:text-slate-400">
                        Here&apos;s what&apos;s happening with your projects today.
                    </p>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                        {!isClockedIn ? (
                            <Button
                                onClick={handleClockIn}
                                className="bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/25"
                            >
                                <Play className="h-4 w-4 mr-2" />
                                Clock In
                            </Button>
                        ) : (
                            <>
                                <Button
                                    variant={isOnBreak ? 'primary' : 'secondary'}
                                    onClick={isOnBreak ? endBreak : startBreak}
                                    size="sm"
                                >
                                    <Coffee className="h-4 w-4 mr-1" />
                                    {isOnBreak ? 'End Break' : 'Break'}
                                </Button>
                                <Button
                                    onClick={handleClockOut}
                                    variant="danger"
                                    size="sm"
                                >
                                    <LogOutIcon className="h-4 w-4 mr-1" />
                                    Clock Out
                                </Button>
                            </>
                        )}
                    </div>
                    {isClockedIn && clockInTime && (
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                            Clocked in at <span className="font-medium text-slate-900 dark:text-white">{formatTime(clockInTime)}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.title}</p>
                                    <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                                </div>
                                <div className={cn('p-3 rounded-xl bg-gradient-to-br', stat.color)}>
                                    <stat.icon className="h-6 w-6 text-white" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                                {stat.trend === 'up' ? (
                                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                                ) : (
                                    <TrendingDown className="h-4 w-4 text-red-500" />
                                )}
                                <span className={cn('text-sm font-medium', stat.trend === 'up' ? 'text-emerald-500' : 'text-red-500')}>
                                    {stat.change}
                                </span>
                                <span className="text-sm text-slate-500">vs last week</span>
                            </div>
                            {/* Decorative gradient */}
                            <div className={cn('absolute -bottom-8 -right-8 h-32 w-32 rounded-full opacity-10 bg-gradient-to-br', stat.color)} />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Today's Tasks */}
                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Today&apos;s Tasks</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">You have {todayTasks.length} tasks due today</p>
                        </div>
                        <Link href="/tasks">
                            <Button variant="ghost" size="sm">
                                View All <ArrowRight className="h-4 w-4 ml-1" />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {todayTasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                                >
                                    <button className="h-5 w-5 rounded-full border-2 border-slate-300 dark:border-slate-600 hover:border-indigo-500 transition-colors group-hover:border-indigo-400" />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-slate-900 dark:text-white truncate">{task.title}</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{task.project}</p>
                                    </div>
                                    <Badge className={priorityColors[task.priority]} size="sm">
                                        {task.priority}
                                    </Badge>
                                    <div className="flex items-center gap-1.5 text-slate-400">
                                        <Clock className="h-4 w-4" />
                                        <span className="text-sm">{task.dueTime}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Time Tracking Widget */}
                <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white overflow-hidden relative">
                    <CardContent className="p-6 relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-xl bg-white/20">
                                <Timer className="h-5 w-5" />
                            </div>
                            <h3 className="font-semibold">Time Tracking</h3>
                        </div>

                        <div className="text-center mb-6">
                            <p className="text-5xl font-bold tracking-tight">05:32:18</p>
                            <p className="text-white/60 mt-1">Today&apos;s work time</p>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-white/60">Weekly goal</span>
                                <span className="font-medium">32.5 / 40 hours</span>
                            </div>
                            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                <div className="h-full w-[81%] bg-white rounded-full" />
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-white/20">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-white/60 text-sm">Current task</p>
                                    <p className="font-medium mt-0.5">Review design mockups</p>
                                </div>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="bg-white/20 hover:bg-white/30 text-white border-0"
                                >
                                    <Pause className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                </Card>
            </div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Projects */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Projects</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Your active projects progress</p>
                        </div>
                        <Link href="/projects">
                            <Button variant="ghost" size="sm">
                                View All <ArrowRight className="h-4 w-4 ml-1" />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {recentProjects.map((project) => (
                            <div
                                key={project.id}
                                className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="h-10 w-10 rounded-xl flex items-center justify-center text-white font-semibold"
                                            style={{ backgroundColor: project.color }}
                                        >
                                            {project.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-slate-900 dark:text-white">{project.name}</h4>
                                            <Badge
                                                variant={project.status === 'ACTIVE' ? 'success' : 'warning'}
                                                size="sm"
                                                className="mt-1"
                                            >
                                                {project.status}
                                            </Badge>
                                        </div>
                                    </div>
                                    <AvatarGroup
                                        avatars={Array(project.team).fill({ fallback: 'U' })}
                                        max={3}
                                        size="xs"
                                    />
                                </div>
                                <Progress value={project.progress} showLabel color={project.progress > 80 ? 'success' : 'default'} />
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Upcoming Leaves & Calendar */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Team Availability</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Upcoming leaves and events</p>
                        </div>
                        <Link href="/leave">
                            <Button variant="ghost" size="sm">
                                View Calendar <ArrowRight className="h-4 w-4 ml-1" />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {upcomingLeaves.length === 0 ? (
                            <div className="text-center py-8 text-slate-500">
                                <Calendar className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                                <p>No upcoming leaves scheduled</p>
                            </div>
                        ) : (
                            upcomingLeaves.map((leave) => (
                                <div
                                    key={leave.id}
                                    className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50"
                                >
                                    <Avatar
                                        src={leave.avatar}
                                        fallback={leave.user.split(' ').map(n => n[0]).join('')}
                                        size="md"
                                    />
                                    <div className="flex-1">
                                        <p className="font-medium text-slate-900 dark:text-white">{leave.user}</p>
                                        <p className="text-sm text-slate-500">{leave.type}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                                            {leave.startDate} {leave.startDate !== leave.endDate && `- ${leave.endDate}`}
                                        </p>
                                        <Badge variant="info" size="sm">Approved</Badge>
                                    </div>
                                </div>
                            ))
                        )}

                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">22</p>
                                <p className="text-xs text-slate-500">Present Today</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-amber-500">2</p>
                                <p className="text-xs text-slate-500">On Leave</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-emerald-500">92%</p>
                                <p className="text-xs text-slate-500">Attendance Rate</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
