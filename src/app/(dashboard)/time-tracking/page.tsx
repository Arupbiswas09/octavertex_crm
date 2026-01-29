'use client';

import { useState, useEffect } from 'react';
import {
    Play,
    Pause,
    Square,
    Clock,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Plus,
    MoreHorizontal,
    Timer,
    Target,
    TrendingUp,
    Edit2,
    Trash2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, Button, Input, Badge, Progress, Select } from '@/components/ui';
import { cn, formatDuration, formatTime } from '@/utils/helpers';
import { useTimerStore } from '@/stores';

// Mock data
const projects = [
    { id: '1', name: 'Website Redesign', color: '#6366f1' },
    { id: '2', name: 'Mobile App v2.0', color: '#10b981' },
    { id: '3', name: 'Marketing Campaign', color: '#f59e0b' },
    { id: '4', name: 'API Integration', color: '#ec4899' },
];

const tasks = [
    { id: '1', name: 'Review design mockups', projectId: '1' },
    { id: '2', name: 'Implement navigation', projectId: '1' },
    { id: '3', name: 'Fix login bug', projectId: '2' },
    { id: '4', name: 'Update API documentation', projectId: '4' },
];

const todayEntries = [
    { id: '1', task: 'Review design mockups', project: 'Website Redesign', projectColor: '#6366f1', startTime: '09:00', endTime: '10:30', duration: 5400 },
    { id: '2', task: 'Team standup meeting', project: 'General', projectColor: '#6b7280', startTime: '10:30', endTime: '11:00', duration: 1800 },
    { id: '3', task: 'Implement navigation', project: 'Website Redesign', projectColor: '#6366f1', startTime: '11:00', endTime: '12:30', duration: 5400 },
    { id: '4', task: 'Fix login bug', project: 'Mobile App v2.0', projectColor: '#10b981', startTime: '13:30', endTime: '15:00', duration: 5400 },
];

const weeklyData = [
    { day: 'Mon', hours: 7.5, target: 8 },
    { day: 'Tue', hours: 8.2, target: 8 },
    { day: 'Wed', hours: 6.8, target: 8 },
    { day: 'Thu', hours: 5.5, target: 8 },
    { day: 'Fri', hours: 0, target: 8 },
    { day: 'Sat', hours: 0, target: 0 },
    { day: 'Sun', hours: 0, target: 0 },
];

export default function TimeTrackingPage() {
    const { isRunning, startTime, taskId, taskName, projectId, startTimer, stopTimer, toggleTimer } = useTimerStore();
    const [currentTime, setCurrentTime] = useState(0);
    const [selectedProject, setSelectedProject] = useState('');
    const [description, setDescription] = useState('');
    const [showManualEntry, setShowManualEntry] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRunning && startTime) {
            interval = setInterval(() => {
                setCurrentTime(Math.floor((Date.now() - startTime) / 1000));
            }, 1000);
        } else {
            setCurrentTime(0);
        }
        return () => clearInterval(interval);
    }, [isRunning, startTime]);

    const formatElapsed = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const totalToday = todayEntries.reduce((sum, entry) => sum + entry.duration, 0) + currentTime;
    const totalWeek = weeklyData.reduce((sum, day) => sum + day.hours, 0);
    const weekTarget = 40;

    const handleStartTimer = () => {
        if (!description.trim()) return;
        const project = projects.find(p => p.id === selectedProject);
        startTimer('task-' + Date.now(), description, selectedProject, project?.name || 'General');
        setDescription('');
    };

    const handleStopTimer = () => {
        stopTimer();
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Time Tracking</h1>
                    <p className="text-slate-500 dark:text-slate-400">Track and manage your work time</p>
                </div>
                <Button variant="outline" onClick={() => setShowManualEntry(!showManualEntry)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Manual Entry
                </Button>
            </div>

            {/* Timer Card */}
            <Card className={cn(
                'overflow-hidden transition-all',
                isRunning && 'ring-2 ring-emerald-500'
            )}>
                <div className={cn(
                    'p-6',
                    isRunning
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                        : 'bg-gradient-to-r from-slate-700 to-slate-900'
                )}>
                    <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                        {/* Timer Display */}
                        <div className="lg:w-64 text-center lg:text-left">
                            <p className="text-5xl lg:text-6xl font-bold text-white font-mono tracking-tight">
                                {formatElapsed(currentTime)}
                            </p>
                            <p className="text-white/60 mt-2">
                                {isRunning ? `Working on: ${taskName}` : 'Timer stopped'}
                            </p>
                        </div>

                        {/* Timer Input */}
                        <div className="flex-1 flex flex-col lg:flex-row gap-3">
                            <input
                                type="text"
                                placeholder="What are you working on?"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                disabled={isRunning}
                                className="flex-1 h-12 px-4 bg-white/10 border-0 rounded-xl text-white placeholder:text-white/50 focus:ring-2 focus:ring-white/30 disabled:opacity-50"
                            />
                            <select
                                value={selectedProject}
                                onChange={(e) => setSelectedProject(e.target.value)}
                                disabled={isRunning}
                                className="h-12 px-4 bg-white/10 border-0 rounded-xl text-white appearance-none cursor-pointer focus:ring-2 focus:ring-white/30 disabled:opacity-50"
                            >
                                <option value="" className="text-slate-900">Select Project</option>
                                {projects.map((project) => (
                                    <option key={project.id} value={project.id} className="text-slate-900">
                                        {project.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Timer Controls */}
                        <div className="flex items-center justify-center lg:justify-end gap-3">
                            {!isRunning ? (
                                <Button
                                    onClick={handleStartTimer}
                                    disabled={!description.trim()}
                                    className="h-14 w-14 p-0 bg-white text-emerald-600 hover:bg-white/90 shadow-xl rounded-2xl"
                                >
                                    <Play className="h-6 w-6 fill-current" />
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        onClick={toggleTimer}
                                        variant="secondary"
                                        className="h-12 w-12 p-0 bg-white/20 hover:bg-white/30 text-white border-0 rounded-xl"
                                    >
                                        <Pause className="h-5 w-5" />
                                    </Button>
                                    <Button
                                        onClick={handleStopTimer}
                                        className="h-12 w-12 p-0 bg-red-500 hover:bg-red-600 text-white rounded-xl"
                                    >
                                        <Square className="h-5 w-5 fill-current" />
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </Card>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                                <Clock className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Today</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {formatDuration(totalToday * 1000)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                                <Target className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-sm text-slate-500">This Week</p>
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                                        {totalWeek.toFixed(1)}h / {weekTarget}h
                                    </p>
                                </div>
                                <Progress value={totalWeek} max={weekTarget} size="sm" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                                <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Avg Daily</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">7.2h</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Today's Time Entries */}
                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Today&apos;s Entries</h2>
                            <p className="text-sm text-slate-500">
                                {todayEntries.length} entries • {formatDuration(todayEntries.reduce((sum, e) => sum + e.duration, 0) * 1000)}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon">
                                <ChevronLeft className="h-5 w-5" />
                            </Button>
                            <span className="text-sm font-medium">Today</span>
                            <Button variant="ghost" size="icon">
                                <ChevronRight className="h-5 w-5" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {todayEntries.map((entry) => (
                                <div
                                    key={entry.id}
                                    className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                                >
                                    <div
                                        className="h-3 w-3 rounded-full shrink-0"
                                        style={{ backgroundColor: entry.projectColor }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-slate-900 dark:text-white truncate">{entry.task}</p>
                                        <p className="text-sm text-slate-500">{entry.project}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-slate-500">
                                            {entry.startTime} - {entry.endTime}
                                        </p>
                                        <p className="font-medium text-slate-900 dark:text-white">
                                            {formatDuration(entry.duration * 1000)}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg">
                                            <Edit2 className="h-4 w-4 text-slate-400" />
                                        </button>
                                        <button className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg">
                                            <Trash2 className="h-4 w-4 text-red-400" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Weekly Overview */}
                <Card>
                    <CardHeader>
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Weekly Overview</h2>
                        <p className="text-sm text-slate-500">Hours logged this week</p>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between h-40 gap-2">
                            {weeklyData.map((day, index) => {
                                const isToday = day.day === 'Thu';
                                const maxHours = 10;
                                const height = (day.hours / maxHours) * 100;
                                return (
                                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                        <div className="w-full h-32 flex items-end">
                                            <div
                                                className={cn(
                                                    'w-full rounded-t-lg transition-all',
                                                    isToday
                                                        ? 'bg-gradient-to-t from-indigo-500 to-purple-500'
                                                        : day.hours > 0
                                                            ? 'bg-slate-200 dark:bg-slate-700'
                                                            : 'bg-slate-100 dark:bg-slate-800'
                                                )}
                                                style={{ height: `${height}%`, minHeight: day.hours > 0 ? '8px' : '0' }}
                                            />
                                        </div>
                                        {day.hours > 0 && (
                                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                                                {day.hours.toFixed(1)}h
                                            </span>
                                        )}
                                        <span className={cn(
                                            'text-xs',
                                            isToday ? 'text-indigo-600 font-medium' : 'text-slate-400'
                                        )}>
                                            {day.day}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-slate-500">Weekly Target</span>
                                <span className="text-sm font-medium text-slate-900 dark:text-white">
                                    {Math.round((totalWeek / weekTarget) * 100)}%
                                </span>
                            </div>
                            <Progress value={totalWeek} max={weekTarget} color={totalWeek >= weekTarget ? 'success' : 'default'} />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Manual Entry Modal */}
            {showManualEntry && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <Card className="w-full max-w-lg mx-4">
                        <CardHeader className="flex flex-row items-center justify-between border-b">
                            <h2 className="text-lg font-semibold">Add Time Entry</h2>
                            <button
                                onClick={() => setShowManualEntry(false)}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                            >
                                ×
                            </button>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <Input label="Description" placeholder="What did you work on?" />
                            <Select
                                label="Project"
                                options={projects.map(p => ({ value: p.id, label: p.name }))}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <Input label="Start Time" type="time" defaultValue="09:00" />
                                <Input label="End Time" type="time" defaultValue="17:00" />
                            </div>
                            <Input label="Date" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                            <div className="flex gap-3 pt-4">
                                <Button variant="outline" onClick={() => setShowManualEntry(false)} className="flex-1">
                                    Cancel
                                </Button>
                                <Button className="flex-1">
                                    Add Entry
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
