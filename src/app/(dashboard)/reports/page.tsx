'use client';

import { useState } from 'react';
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    Clock,
    Users,
    CheckCircle2,
    Calendar,
    Download,
    Filter,
    ChevronDown,
} from 'lucide-react';
import { Card, CardContent, CardHeader, Button, Badge, Select, Progress } from '@/components/ui';
import { cn } from '@/utils/helpers';

// Mock data for charts
const projectMetrics = [
    { name: 'Website Redesign', completed: 18, total: 24, hours: 156, team: 5 },
    { name: 'Mobile App v2.0', completed: 19, total: 42, hours: 234, team: 8 },
    { name: 'Marketing Campaign', completed: 4, total: 18, hours: 45, team: 4 },
    { name: 'API Integration', completed: 14, total: 15, hours: 120, team: 3 },
    { name: 'Customer Portal', completed: 11, total: 30, hours: 89, team: 5 },
];

const weeklyHours = [
    { day: 'Mon', hours: 7.5 },
    { day: 'Tue', hours: 8.2 },
    { day: 'Wed', hours: 6.8 },
    { day: 'Thu', hours: 8.0 },
    { day: 'Fri', hours: 7.0 },
];

const teamProductivity = [
    { name: 'Sarah Chen', tasksCompleted: 12, hoursLogged: 38.5, efficiency: 92 },
    { name: 'Mike Wilson', tasksCompleted: 15, hoursLogged: 42.0, efficiency: 88 },
    { name: 'Emily Brown', tasksCompleted: 8, hoursLogged: 35.5, efficiency: 95 },
    { name: 'David Lee', tasksCompleted: 14, hoursLogged: 40.0, efficiency: 90 },
    { name: 'Amy Zhang', tasksCompleted: 6, hoursLogged: 32.0, efficiency: 85 },
];

const leaveStats = [
    { type: 'Casual Leave', used: 45, total: 144 },
    { type: 'Sick Leave', used: 28, total: 144 },
    { type: 'Earned Leave', used: 62, total: 180 },
];

export default function ReportsPage() {
    const [dateRange, setDateRange] = useState('this-week');
    const [selectedProject, setSelectedProject] = useState('all');

    const maxHours = Math.max(...weeklyHours.map(d => d.hours));

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Reports & Analytics</h1>
                    <p className="text-slate-500 dark:text-slate-400">Track performance, productivity, and insights</p>
                </div>
                <div className="flex items-center gap-3">
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="h-10 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                    >
                        <option value="today">Today</option>
                        <option value="this-week">This Week</option>
                        <option value="this-month">This Month</option>
                        <option value="this-quarter">This Quarter</option>
                        <option value="this-year">This Year</option>
                    </select>
                    <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                                <CheckCircle2 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <Badge variant="success" size="sm">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                +12%
                            </Badge>
                        </div>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">156</p>
                        <p className="text-sm text-slate-500">Tasks Completed</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                                <Clock className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <Badge variant="success" size="sm">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                +8%
                            </Badge>
                        </div>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">644h</p>
                        <p className="text-sm text-slate-500">Hours Logged</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                                <Users className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                            </div>
                            <Badge variant="warning" size="sm">
                                <TrendingDown className="h-3 w-3 mr-1" />
                                -2%
                            </Badge>
                        </div>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">94%</p>
                        <p className="text-sm text-slate-500">Attendance Rate</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                                <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <Badge variant="info" size="sm">Same</Badge>
                        </div>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">89%</p>
                        <p className="text-sm text-slate-500">Avg Efficiency</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Weekly Hours Chart */}
                <Card>
                    <CardHeader>
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Hours Logged This Week</h2>
                        <p className="text-sm text-slate-500">Daily breakdown of work hours</p>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between h-48 gap-4">
                            {weeklyHours.map((day, index) => (
                                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                    <div className="w-full relative">
                                        <div
                                            className="w-full bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t-lg transition-all hover:opacity-80"
                                            style={{ height: `${(day.hours / maxHours) * 160}px` }}
                                        />
                                    </div>
                                    <span className="text-sm font-medium text-slate-900 dark:text-white">{day.hours}h</span>
                                    <span className="text-xs text-slate-500">{day.day}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <div>
                                <p className="text-sm text-slate-500">Total This Week</p>
                                <p className="text-xl font-bold text-slate-900 dark:text-white">37.5 hours</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-slate-500">Weekly Target</p>
                                <p className="text-xl font-bold text-slate-900 dark:text-white">40 hours</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Team Productivity */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Team Productivity</h2>
                            <p className="text-sm text-slate-500">Individual performance metrics</p>
                        </div>
                        <select className="text-sm bg-slate-100 dark:bg-slate-800 border-0 rounded-lg px-3 py-1.5">
                            <option>This Week</option>
                            <option>This Month</option>
                        </select>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {teamProductivity.map((member, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <div className="w-32 truncate">
                                    <p className="font-medium text-slate-900 dark:text-white truncate">{member.name}</p>
                                </div>
                                <div className="flex-1">
                                    <Progress value={member.efficiency} showLabel />
                                </div>
                                <div className="text-right w-20">
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">{member.tasksCompleted} tasks</p>
                                    <p className="text-xs text-slate-500">{member.hoursLogged}h</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Project Progress */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Project Progress</h2>
                        <p className="text-sm text-slate-500">Task completion and hours by project</p>
                    </div>
                    <Button variant="ghost" size="sm">
                        View All Projects
                    </Button>
                </CardHeader>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-800">
                                <th className="text-left py-4 px-6 text-sm font-medium text-slate-500">Project</th>
                                <th className="text-left py-4 px-6 text-sm font-medium text-slate-500">Progress</th>
                                <th className="text-left py-4 px-6 text-sm font-medium text-slate-500">Tasks</th>
                                <th className="text-left py-4 px-6 text-sm font-medium text-slate-500">Hours</th>
                                <th className="text-left py-4 px-6 text-sm font-medium text-slate-500">Team Size</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {projectMetrics.map((project, index) => {
                                const progress = Math.round((project.completed / project.total) * 100);
                                return (
                                    <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="py-4 px-6">
                                            <p className="font-medium text-slate-900 dark:text-white">{project.name}</p>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="w-32">
                                                <Progress
                                                    value={progress}
                                                    size="sm"
                                                    color={progress === 100 ? 'success' : progress > 50 ? 'default' : 'warning'}
                                                />
                                                <span className="text-xs text-slate-500 mt-1">{progress}%</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-slate-600 dark:text-slate-400">
                                            {project.completed}/{project.total}
                                        </td>
                                        <td className="py-4 px-6 text-slate-600 dark:text-slate-400">
                                            {project.hours}h
                                        </td>
                                        <td className="py-4 px-6">
                                            <Badge variant="default">{project.team} members</Badge>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Leave Utilization */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {leaveStats.map((stat, index) => (
                    <Card key={index}>
                        <CardContent className="p-6">
                            <h3 className="font-medium text-slate-900 dark:text-white mb-4">{stat.type}</h3>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-3xl font-bold text-slate-900 dark:text-white">{stat.used}</span>
                                <span className="text-sm text-slate-500">of {stat.total} days</span>
                            </div>
                            <Progress value={stat.used} max={stat.total} showLabel />
                            <p className="text-sm text-slate-500 mt-3">
                                {stat.total - stat.used} days remaining for the team
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
