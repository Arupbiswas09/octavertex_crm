'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Plus,
    Search,
    Filter,
    Grid3X3,
    List,
    MoreHorizontal,
    Calendar,
    Users,
    Clock,
    FolderKanban,
    Star,
    Archive,
} from 'lucide-react';
import { Card, CardContent, Button, Input, Badge, Avatar, AvatarGroup, Progress, EmptyState } from '@/components/ui';
import { cn } from '@/utils/helpers';

// Mock data
const projects = [
    {
        id: '1',
        name: 'Website Redesign',
        slug: 'website-redesign',
        description: 'Complete overhaul of the company website with new branding and improved UX',
        status: 'ACTIVE',
        color: '#6366f1',
        icon: '🌐',
        progress: 75,
        startDate: '2025-01-01',
        endDate: '2025-03-15',
        team: [
            { id: '1', firstName: 'John', lastName: 'Doe', avatar: null },
            { id: '2', firstName: 'Sarah', lastName: 'Chen', avatar: null },
            { id: '3', firstName: 'Mike', lastName: 'Wilson', avatar: null },
            { id: '4', firstName: 'Emily', lastName: 'Brown', avatar: null },
            { id: '5', firstName: 'Alex', lastName: 'Kim', avatar: null },
        ],
        tasksCount: 24,
        completedTasks: 18,
        starred: true,
    },
    {
        id: '2',
        name: 'Mobile App v2.0',
        slug: 'mobile-app-v2',
        description: 'Major update to the mobile app with new features and performance improvements',
        status: 'ACTIVE',
        color: '#10b981',
        icon: '📱',
        progress: 45,
        startDate: '2025-01-15',
        endDate: '2025-04-30',
        team: [
            { id: '1', firstName: 'David', lastName: 'Lee', avatar: null },
            { id: '2', firstName: 'Lisa', lastName: 'Park', avatar: null },
            { id: '3', firstName: 'Tom', lastName: 'Harris', avatar: null },
        ],
        tasksCount: 42,
        completedTasks: 19,
        starred: false,
    },
    {
        id: '3',
        name: 'Marketing Campaign Q1',
        slug: 'marketing-q1',
        description: 'Q1 marketing initiatives including social media, email campaigns, and PR',
        status: 'PLANNING',
        color: '#f59e0b',
        icon: '📣',
        progress: 20,
        startDate: '2025-02-01',
        endDate: '2025-03-31',
        team: [
            { id: '1', firstName: 'Amy', lastName: 'Zhang', avatar: null },
            { id: '2', firstName: 'Chris', lastName: 'Martin', avatar: null },
        ],
        tasksCount: 18,
        completedTasks: 4,
        starred: true,
    },
    {
        id: '4',
        name: 'API Integration Hub',
        slug: 'api-integration',
        description: 'Build a centralized API integration platform for third-party services',
        status: 'ACTIVE',
        color: '#ec4899',
        icon: '🔌',
        progress: 90,
        startDate: '2024-12-01',
        endDate: '2025-02-15',
        team: [
            { id: '1', firstName: 'Kevin', lastName: 'Johnson', avatar: null },
            { id: '2', firstName: 'Rachel', lastName: 'Green', avatar: null },
        ],
        tasksCount: 15,
        completedTasks: 14,
        starred: false,
    },
    {
        id: '5',
        name: 'Customer Portal',
        slug: 'customer-portal',
        description: 'Self-service portal for customers to manage their accounts and support tickets',
        status: 'ON_HOLD',
        color: '#8b5cf6',
        icon: '🎫',
        progress: 35,
        startDate: '2025-01-10',
        endDate: '2025-05-01',
        team: [
            { id: '1', firstName: 'Nina', lastName: 'Patel', avatar: null },
            { id: '2', firstName: 'Sam', lastName: 'Wilson', avatar: null },
            { id: '3', firstName: 'Olivia', lastName: 'Taylor', avatar: null },
        ],
        tasksCount: 30,
        completedTasks: 11,
        starred: false,
    },
    {
        id: '6',
        name: 'Analytics Dashboard',
        slug: 'analytics-dashboard',
        description: 'Real-time analytics dashboard with custom reports and data visualization',
        status: 'COMPLETED',
        color: '#06b6d4',
        icon: '📊',
        progress: 100,
        startDate: '2024-11-01',
        endDate: '2025-01-20',
        team: [
            { id: '1', firstName: 'James', lastName: 'Moore', avatar: null },
        ],
        tasksCount: 20,
        completedTasks: 20,
        starred: true,
    },
];

const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'PLANNING', label: 'Planning' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'ON_HOLD', label: 'On Hold' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'ARCHIVED', label: 'Archived' },
];

const statusColors: Record<string, { bg: string; text: string }> = {
    PLANNING: { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300' },
    ACTIVE: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400' },
    ON_HOLD: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400' },
    COMPLETED: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400' },
    ARCHIVED: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-400' },
};

export default function ProjectsPage() {
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [showStarredOnly, setShowStarredOnly] = useState(false);

    const filteredProjects = projects.filter((project) => {
        const matchesSearch = project.name.toLowerCase().includes(search.toLowerCase()) ||
            project.description.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = !statusFilter || project.status === statusFilter;
        const matchesStarred = !showStarredOnly || project.starred;
        return matchesSearch && matchesStatus && matchesStarred;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Projects</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage and track all your projects</p>
                </div>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Project
                </Button>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <Input
                        placeholder="Search projects..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        icon={<Search className="h-5 w-5" />}
                    />
                </div>
                <div className="flex items-center gap-3">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="h-11 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                        {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                    <Button
                        variant={showStarredOnly ? 'primary' : 'outline'}
                        size="icon"
                        onClick={() => setShowStarredOnly(!showStarredOnly)}
                    >
                        <Star className={cn('h-5 w-5', showStarredOnly && 'fill-current')} />
                    </Button>
                    <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
                        <button
                            onClick={() => setView('grid')}
                            className={cn(
                                'p-2 rounded-lg transition-colors',
                                view === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-slate-500'
                            )}
                        >
                            <Grid3X3 className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => setView('list')}
                            className={cn(
                                'p-2 rounded-lg transition-colors',
                                view === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-slate-500'
                            )}
                        >
                            <List className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Projects Grid/List */}
            {filteredProjects.length === 0 ? (
                <EmptyState
                    icon={<FolderKanban className="h-8 w-8" />}
                    title="No projects found"
                    description="Try adjusting your search or filters, or create a new project"
                    action={
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Create Project
                        </Button>
                    }
                />
            ) : view === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project) => (
                        <Link key={project.id} href={`/projects/${project.slug}`}>
                            <Card hover className="h-full group">
                                <CardContent className="p-6">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="h-12 w-12 rounded-xl flex items-center justify-center text-2xl"
                                                style={{ backgroundColor: `${project.color}20` }}
                                            >
                                                {project.icon}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                                                    {project.name}
                                                </h3>
                                                <Badge
                                                    className={cn(statusColors[project.status].bg, statusColors[project.status].text)}
                                                    size="sm"
                                                >
                                                    {project.status.replace('_', ' ')}
                                                </Badge>
                                            </div>
                                        </div>
                                        <button
                                            className={cn(
                                                'p-1 transition-colors',
                                                project.starred ? 'text-amber-500' : 'text-slate-300 hover:text-amber-500'
                                            )}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                // Toggle star
                                            }}
                                        >
                                            <Star className={cn('h-5 w-5', project.starred && 'fill-current')} />
                                        </button>
                                    </div>

                                    {/* Description */}
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
                                        {project.description}
                                    </p>

                                    {/* Progress */}
                                    <div className="mb-4">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-slate-500">Progress</span>
                                            <span className="font-medium text-slate-900 dark:text-white">{project.progress}%</span>
                                        </div>
                                        <Progress
                                            value={project.progress}
                                            color={project.progress === 100 ? 'success' : project.progress > 50 ? 'default' : 'warning'}
                                        />
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                                        <AvatarGroup
                                            avatars={project.team.map(m => ({
                                                src: m.avatar,
                                                fallback: `${m.firstName[0]}${m.lastName[0]}`,
                                            }))}
                                            max={4}
                                            size="sm"
                                        />
                                        <div className="flex items-center gap-4 text-sm text-slate-500">
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-4 w-4" />
                                                {project.completedTasks}/{project.tasksCount}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            ) : (
                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-800">
                                    <th className="text-left py-4 px-6 text-sm font-medium text-slate-500">Project</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-slate-500">Status</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-slate-500">Progress</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-slate-500">Team</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-slate-500">Tasks</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-slate-500">Due Date</th>
                                    <th className="py-4 px-6"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filteredProjects.map((project) => (
                                    <tr
                                        key={project.id}
                                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                                        onClick={() => window.location.href = `/projects/${project.slug}`}
                                    >
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="h-10 w-10 rounded-lg flex items-center justify-center text-lg"
                                                    style={{ backgroundColor: `${project.color}20` }}
                                                >
                                                    {project.icon}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-900 dark:text-white">{project.name}</p>
                                                    <p className="text-sm text-slate-500 truncate max-w-xs">{project.description}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <Badge className={cn(statusColors[project.status].bg, statusColors[project.status].text)}>
                                                {project.status.replace('_', ' ')}
                                            </Badge>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="w-32">
                                                <Progress value={project.progress} size="sm" />
                                                <span className="text-xs text-slate-500 mt-1">{project.progress}%</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <AvatarGroup
                                                avatars={project.team.map(m => ({
                                                    src: m.avatar,
                                                    fallback: `${m.firstName[0]}${m.lastName[0]}`,
                                                }))}
                                                max={3}
                                                size="xs"
                                            />
                                        </td>
                                        <td className="py-4 px-6 text-sm text-slate-500">
                                            {project.completedTasks}/{project.tasksCount}
                                        </td>
                                        <td className="py-4 px-6 text-sm text-slate-500">
                                            {new Date(project.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </td>
                                        <td className="py-4 px-6">
                                            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                                                <MoreHorizontal className="h-5 w-5 text-slate-400" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}
        </div>
    );
}
