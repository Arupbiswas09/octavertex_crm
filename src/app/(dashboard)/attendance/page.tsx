'use client';

import { useState } from 'react';
import {
    Play,
    Square,
    Coffee,
    Clock,
    Calendar,
    ChevronLeft,
    ChevronRight,
    MapPin,
    Wifi,
    CheckCircle2,
    XCircle,
    AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, Button, Badge, Avatar, Progress } from '@/components/ui';
import { cn, formatTime, formatDuration } from '@/utils/helpers';
import { useAttendanceStore } from '@/stores';

// Mock data
const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const currentWeek = [
    { date: 27, day: 'Mon', status: 'PRESENT', clockIn: '09:02', clockOut: '18:15', hours: 8.5 },
    { date: 28, day: 'Tue', status: 'PRESENT', clockIn: '08:58', clockOut: '18:30', hours: 9.0 },
    { date: 29, day: 'Wed', status: 'LATE', clockIn: '09:35', clockOut: '18:45', hours: 8.5 },
    { date: 30, day: 'Thu', status: 'PRESENT', clockIn: '09:00', clockOut: null, hours: 5.5 },
    { date: 31, day: 'Fri', status: 'UPCOMING', clockIn: null, clockOut: null, hours: 0 },
    { date: 1, day: 'Sat', status: 'WEEKEND', clockIn: null, clockOut: null, hours: 0 },
    { date: 2, day: 'Sun', status: 'WEEKEND', clockIn: null, clockOut: null, hours: 0 },
];

const recentAttendance = [
    { date: '2025-01-30', status: 'PRESENT', clockIn: '09:00', clockOut: null, hours: 5.5, notes: null },
    { date: '2025-01-29', status: 'LATE', clockIn: '09:35', clockOut: '18:45', hours: 8.5, notes: 'Traffic delay' },
    { date: '2025-01-28', status: 'PRESENT', clockIn: '08:58', clockOut: '18:30', hours: 9.0, notes: null },
    { date: '2025-01-27', status: 'PRESENT', clockIn: '09:02', clockOut: '18:15', hours: 8.5, notes: null },
    { date: '2025-01-24', status: 'PRESENT', clockIn: '09:00', clockOut: '18:00', hours: 8.0, notes: null },
    { date: '2025-01-23', status: 'ON_LEAVE', clockIn: null, clockOut: null, hours: 0, notes: 'Sick Leave' },
    { date: '2025-01-22', status: 'PRESENT', clockIn: '08:55', clockOut: '18:10', hours: 8.5, notes: null },
];

const statusConfig: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
    PRESENT: { color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/30', icon: <CheckCircle2 className="h-4 w-4" /> },
    ABSENT: { color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30', icon: <XCircle className="h-4 w-4" /> },
    LATE: { color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/30', icon: <AlertCircle className="h-4 w-4" /> },
    HALF_DAY: { color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/30', icon: <Clock className="h-4 w-4" /> },
    ON_LEAVE: { color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30', icon: <Calendar className="h-4 w-4" /> },
    WEEKEND: { color: 'text-slate-400', bg: 'bg-slate-100 dark:bg-slate-800', icon: null },
    HOLIDAY: { color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30', icon: <Calendar className="h-4 w-4" /> },
    UPCOMING: { color: 'text-slate-400', bg: 'bg-slate-50 dark:bg-slate-800/50', icon: null },
};

export default function AttendancePage() {
    const { isClockedIn, clockInTime, isOnBreak, currentAttendanceId, clockIn, clockOut, startBreak, endBreak } = useAttendanceStore();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [elapsedTime, setElapsedTime] = useState(0);

    // Calculate elapsed time
    const formatElapsedTime = () => {
        if (!clockInTime) return '00:00:00';
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - new Date(clockInTime).getTime()) / 1000);
        const hours = Math.floor(elapsed / 3600);
        const minutes = Math.floor((elapsed % 3600) / 60);
        const seconds = elapsed % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleClockIn = () => {
        // In production, this would call the API
        clockIn('attendance-' + Date.now());
    };

    const handleClockOut = () => {
        clockOut();
    };

    const weeklyHours = currentWeek.reduce((sum, day) => sum + day.hours, 0);
    const targetHours = 40;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Attendance</h1>
                    <p className="text-slate-500 dark:text-slate-400">Track your work hours and attendance</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <MapPin className="h-4 w-4" />
                    <span>Office - Main Building</span>
                    <Wifi className="h-4 w-4 ml-4 text-emerald-500" />
                </div>
            </div>

            {/* Clock In/Out Card */}
            <Card className="overflow-hidden">
                <div className="grid lg:grid-cols-2">
                    {/* Left - Timer */}
                    <div className={cn(
                        'p-8 relative overflow-hidden',
                        isClockedIn
                            ? 'bg-gradient-to-br from-emerald-500 to-teal-600'
                            : 'bg-gradient-to-br from-slate-700 to-slate-900'
                    )}>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-8">
                                <div className={cn(
                                    'p-3 rounded-xl',
                                    isClockedIn ? 'bg-white/20' : 'bg-white/10'
                                )}>
                                    <Clock className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-white/80 text-sm">Today&apos;s Status</p>
                                    <p className="text-white font-semibold">
                                        {isClockedIn ? (isOnBreak ? 'On Break' : 'Working') : 'Not Clocked In'}
                                    </p>
                                </div>
                            </div>

                            <div className="text-center mb-8">
                                <p className="text-6xl lg:text-7xl font-bold text-white tracking-tight font-mono">
                                    {formatElapsedTime()}
                                </p>
                                <p className="text-white/60 mt-2">
                                    {isClockedIn && clockInTime
                                        ? `Started at ${formatTime(clockInTime)}`
                                        : 'Ready to start your day?'}
                                </p>
                            </div>

                            <div className="flex items-center justify-center gap-4">
                                {!isClockedIn ? (
                                    <Button
                                        onClick={handleClockIn}
                                        className="h-14 px-8 text-lg bg-white text-emerald-600 hover:bg-white/90 shadow-xl"
                                    >
                                        <Play className="h-5 w-5 mr-2 fill-current" />
                                        Clock In
                                    </Button>
                                ) : (
                                    <>
                                        <Button
                                            onClick={isOnBreak ? endBreak : startBreak}
                                            variant="secondary"
                                            className={cn(
                                                'h-12 px-6',
                                                isOnBreak
                                                    ? 'bg-amber-500 hover:bg-amber-600 text-white'
                                                    : 'bg-white/20 hover:bg-white/30 text-white border-0'
                                            )}
                                        >
                                            <Coffee className="h-5 w-5 mr-2" />
                                            {isOnBreak ? 'End Break' : 'Take Break'}
                                        </Button>
                                        <Button
                                            onClick={handleClockOut}
                                            className="h-12 px-6 bg-red-500 hover:bg-red-600 text-white"
                                        >
                                            <Square className="h-5 w-5 mr-2 fill-current" />
                                            Clock Out
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                    </div>

                    {/* Right - Weekly Summary */}
                    <div className="p-8 bg-white dark:bg-slate-900">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">This Week</h3>

                        {/* Week Days */}
                        <div className="grid grid-cols-7 gap-2 mb-6">
                            {currentWeek.map((day, index) => {
                                const isToday = day.date === 30; // Mock today
                                const config = statusConfig[day.status];
                                return (
                                    <div
                                        key={index}
                                        className={cn(
                                            'flex flex-col items-center p-3 rounded-xl transition-all',
                                            isToday && 'ring-2 ring-indigo-500',
                                            day.status === 'WEEKEND' || day.status === 'UPCOMING'
                                                ? 'bg-slate-50 dark:bg-slate-800/50'
                                                : config.bg
                                        )}
                                    >
                                        <span className="text-xs text-slate-500 mb-1">{day.day}</span>
                                        <span className={cn(
                                            'text-lg font-semibold',
                                            isToday ? 'text-indigo-600' : 'text-slate-900 dark:text-white'
                                        )}>
                                            {day.date}
                                        </span>
                                        {day.hours > 0 && (
                                            <span className="text-xs text-slate-500 mt-1">{day.hours}h</span>
                                        )}
                                        {config.icon && (
                                            <span className={cn('mt-1', config.color)}>{config.icon}</span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Weekly Progress */}
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Weekly Progress</span>
                                <span className="font-semibold text-slate-900 dark:text-white">
                                    {weeklyHours.toFixed(1)} / {targetHours}h
                                </span>
                            </div>
                            <Progress
                                value={weeklyHours}
                                max={targetHours}
                                showLabel
                                color={weeklyHours >= targetHours ? 'success' : 'default'}
                            />

                            <div className="grid grid-cols-3 gap-4 pt-4">
                                <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                    <p className="text-2xl font-bold text-emerald-600">{weeklyHours.toFixed(1)}</p>
                                    <p className="text-xs text-slate-500">Hours Worked</p>
                                </div>
                                <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                    <p className="text-2xl font-bold text-amber-600">1.5</p>
                                    <p className="text-xs text-slate-500">Overtime</p>
                                </div>
                                <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                    <p className="text-2xl font-bold text-indigo-600">4</p>
                                    <p className="text-xs text-slate-500">Days Present</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Recent Attendance */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Attendance History</h2>
                        <p className="text-sm text-slate-500">Your recent attendance records</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <span className="text-sm font-medium">January 2025</span>
                        <Button variant="ghost" size="icon">
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                    </div>
                </CardHeader>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-800">
                                <th className="text-left py-4 px-6 text-sm font-medium text-slate-500">Date</th>
                                <th className="text-left py-4 px-6 text-sm font-medium text-slate-500">Status</th>
                                <th className="text-left py-4 px-6 text-sm font-medium text-slate-500">Clock In</th>
                                <th className="text-left py-4 px-6 text-sm font-medium text-slate-500">Clock Out</th>
                                <th className="text-left py-4 px-6 text-sm font-medium text-slate-500">Work Hours</th>
                                <th className="text-left py-4 px-6 text-sm font-medium text-slate-500">Notes</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {recentAttendance.map((record, index) => {
                                const config = statusConfig[record.status];
                                const date = new Date(record.date);
                                return (
                                    <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div>
                                                <p className="font-medium text-slate-900 dark:text-white">
                                                    {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <Badge className={cn(config.bg, config.color)}>
                                                <span className="flex items-center gap-1">
                                                    {config.icon}
                                                    {record.status.replace('_', ' ')}
                                                </span>
                                            </Badge>
                                        </td>
                                        <td className="py-4 px-6 text-slate-600 dark:text-slate-400">
                                            {record.clockIn || '-'}
                                        </td>
                                        <td className="py-4 px-6 text-slate-600 dark:text-slate-400">
                                            {record.clockOut || (record.status === 'PRESENT' ? 'Active' : '-')}
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="font-medium text-slate-900 dark:text-white">
                                                {record.hours > 0 ? `${record.hours}h` : '-'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-slate-500">
                                            {record.notes || '-'}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
