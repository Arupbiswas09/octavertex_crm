'use client';

import { useState } from 'react';
import {
    Plus,
    Search,
    Filter,
    LayoutGrid,
    List,
    Calendar as CalendarIcon,
    MoreHorizontal,
    GripVertical,
    Clock,
    MessageSquare,
    Paperclip,
    Flag,
    ChevronDown,
    X,
} from 'lucide-react';
import { Card, CardContent, CardHeader, Button, Input, Badge, Avatar, AvatarGroup } from '@/components/ui';
import { cn, formatDate } from '@/utils/helpers';
import { useFilterStore } from '@/stores';

type TaskStatus = 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE';

interface Task {
    id: string;
    title: string;
    description: string | null;
    status: TaskStatus;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    dueDate: string | null;
    project: { name: string; color: string };
    assignees: { id: string; firstName: string; lastName: string; avatar: string | null }[];
    labels: { name: string; color: string }[];
    commentsCount: number;
    attachmentsCount: number;
    subtasksCount: number;
    completedSubtasks: number;
}

// Mock data
const mockTasks: Task[] = [
    {
        id: '1',
        title: 'Design new landing page hero section',
        description: 'Create a compelling hero section with animated elements',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        dueDate: '2025-02-05',
        project: { name: 'Website Redesign', color: '#6366f1' },
        assignees: [
            { id: '1', firstName: 'Sarah', lastName: 'Chen', avatar: null },
            { id: '2', firstName: 'Mike', lastName: 'Wilson', avatar: null },
        ],
        labels: [{ name: 'Design', color: '#ec4899' }, { name: 'UI/UX', color: '#8b5cf6' }],
        commentsCount: 8,
        attachmentsCount: 3,
        subtasksCount: 5,
        completedSubtasks: 2,
    },
    {
        id: '2',
        title: 'Implement user authentication flow',
        description: 'Complete OAuth2 integration with Google and GitHub',
        status: 'TODO',
        priority: 'URGENT',
        dueDate: '2025-02-03',
        project: { name: 'Mobile App v2.0', color: '#10b981' },
        assignees: [{ id: '3', firstName: 'David', lastName: 'Lee', avatar: null }],
        labels: [{ name: 'Backend', color: '#3b82f6' }],
        commentsCount: 4,
        attachmentsCount: 1,
        subtasksCount: 3,
        completedSubtasks: 0,
    },
    {
        id: '3',
        title: 'Write API documentation',
        description: 'Document all API endpoints with examples',
        status: 'BACKLOG',
        priority: 'MEDIUM',
        dueDate: '2025-02-10',
        project: { name: 'API Integration', color: '#ec4899' },
        assignees: [{ id: '4', firstName: 'Emily', lastName: 'Brown', avatar: null }],
        labels: [{ name: 'Documentation', color: '#f59e0b' }],
        commentsCount: 2,
        attachmentsCount: 0,
        subtasksCount: 0,
        completedSubtasks: 0,
    },
    {
        id: '4',
        title: 'Fix mobile navigation bug',
        description: 'Navigation menu not closing properly on mobile devices',
        status: 'IN_REVIEW',
        priority: 'HIGH',
        dueDate: '2025-02-01',
        project: { name: 'Mobile App v2.0', color: '#10b981' },
        assignees: [
            { id: '5', firstName: 'Alex', lastName: 'Kim', avatar: null },
            { id: '3', firstName: 'David', lastName: 'Lee', avatar: null },
        ],
        labels: [{ name: 'Bug', color: '#ef4444' }, { name: 'Mobile', color: '#06b6d4' }],
        commentsCount: 12,
        attachmentsCount: 2,
        subtasksCount: 2,
        completedSubtasks: 2,
    },
    {
        id: '5',
        title: 'Set up CI/CD pipeline',
        description: 'Configure automated testing and deployment',
        status: 'DONE',
        priority: 'MEDIUM',
        dueDate: '2025-01-28',
        project: { name: 'API Integration', color: '#ec4899' },
        assignees: [{ id: '6', firstName: 'Tom', lastName: 'Harris', avatar: null }],
        labels: [{ name: 'DevOps', color: '#22c55e' }],
        commentsCount: 5,
        attachmentsCount: 1,
        subtasksCount: 4,
        completedSubtasks: 4,
    },
    {
        id: '6',
        title: 'Create email templates',
        description: 'Design responsive email templates for marketing',
        status: 'TODO',
        priority: 'LOW',
        dueDate: '2025-02-15',
        project: { name: 'Marketing Campaign', color: '#f59e0b' },
        assignees: [{ id: '7', firstName: 'Amy', lastName: 'Zhang', avatar: null }],
        labels: [{ name: 'Marketing', color: '#a855f7' }],
        commentsCount: 1,
        attachmentsCount: 0,
        subtasksCount: 3,
        completedSubtasks: 0,
    },
    {
        id: '7',
        title: 'Performance optimization',
        description: 'Improve page load times and Core Web Vitals',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        dueDate: '2025-02-08',
        project: { name: 'Website Redesign', color: '#6366f1' },
        assignees: [{ id: '8', firstName: 'Kevin', lastName: 'Johnson', avatar: null }],
        labels: [{ name: 'Performance', color: '#f97316' }],
        commentsCount: 6,
        attachmentsCount: 0,
        subtasksCount: 6,
        completedSubtasks: 3,
    },
    {
        id: '8',
        title: 'Database schema migration',
        description: 'Migrate to new normalized database schema',
        status: 'BACKLOG',
        priority: 'URGENT',
        dueDate: '2025-02-02',
        project: { name: 'API Integration', color: '#ec4899' },
        assignees: [],
        labels: [{ name: 'Backend', color: '#3b82f6' }, { name: 'Database', color: '#14b8a6' }],
        commentsCount: 3,
        attachmentsCount: 1,
        subtasksCount: 0,
        completedSubtasks: 0,
    },
];

const columns: { id: TaskStatus; title: string; color: string }[] = [
    { id: 'BACKLOG', title: 'Backlog', color: 'bg-slate-400' },
    { id: 'TODO', title: 'To Do', color: 'bg-yellow-400' },
    { id: 'IN_PROGRESS', title: 'In Progress', color: 'bg-blue-400' },
    { id: 'IN_REVIEW', title: 'In Review', color: 'bg-purple-400' },
    { id: 'DONE', title: 'Done', color: 'bg-emerald-400' },
];

const priorityConfig: Record<string, { color: string; bg: string }> = {
    LOW: { color: 'text-slate-500', bg: 'bg-slate-100' },
    MEDIUM: { color: 'text-blue-600', bg: 'bg-blue-100' },
    HIGH: { color: 'text-orange-600', bg: 'bg-orange-100' },
    URGENT: { color: 'text-red-600', bg: 'bg-red-100' },
};

interface TaskCardProps {
    task: Task;
}

function TaskCard({ task }: TaskCardProps) {
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'DONE';

    return (
        <div className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-700 transition-all cursor-pointer">
            {/* Header */}
            <div className="flex items-start gap-2 mb-3">
                <div
                    className="h-2 w-2 rounded-full mt-2 shrink-0"
                    style={{ backgroundColor: task.project.color }}
                />
                <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500 mb-1">{task.project.name}</p>
                    <h4 className="font-medium text-slate-900 dark:text-white text-sm leading-snug">
                        {task.title}
                    </h4>
                </div>
                <button className="p-1 opacity-0 group-hover:opacity-100 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-all">
                    <MoreHorizontal className="h-4 w-4 text-slate-400" />
                </button>
            </div>

            {/* Labels */}
            {task.labels.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                    {task.labels.map((label, index) => (
                        <span
                            key={index}
                            className="px-2 py-0.5 text-xs font-medium rounded-full text-white"
                            style={{ backgroundColor: label.color }}
                        >
                            {label.name}
                        </span>
                    ))}
                </div>
            )}

            {/* Subtasks progress */}
            {task.subtasksCount > 0 && (
                <div className="mb-3">
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                        <span>{task.completedSubtasks}/{task.subtasksCount} subtasks</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-indigo-500 rounded-full transition-all"
                            style={{ width: `${(task.completedSubtasks / task.subtasksCount) * 100}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {task.assignees.length > 0 ? (
                        <AvatarGroup
                            avatars={task.assignees.map(a => ({
                                src: a.avatar,
                                fallback: `${a.firstName[0]}${a.lastName[0]}`,
                            }))}
                            max={3}
                            size="xs"
                        />
                    ) : (
                        <div className="h-6 w-6 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-600" />
                    )}
                </div>

                <div className="flex items-center gap-3 text-slate-400">
                    {task.commentsCount > 0 && (
                        <span className="flex items-center gap-1 text-xs">
                            <MessageSquare className="h-3.5 w-3.5" />
                            {task.commentsCount}
                        </span>
                    )}
                    {task.attachmentsCount > 0 && (
                        <span className="flex items-center gap-1 text-xs">
                            <Paperclip className="h-3.5 w-3.5" />
                            {task.attachmentsCount}
                        </span>
                    )}
                    {task.dueDate && (
                        <span className={cn(
                            'flex items-center gap-1 text-xs',
                            isOverdue ? 'text-red-500' : 'text-slate-400'
                        )}>
                            <Clock className="h-3.5 w-3.5" />
                            {formatDate(task.dueDate, { month: 'short', day: 'numeric' })}
                        </span>
                    )}
                    <div className={cn('p-1 rounded', priorityConfig[task.priority].bg)}>
                        <Flag className={cn('h-3 w-3', priorityConfig[task.priority].color)} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function TasksPage() {
    const { taskFilters, setTaskFilters } = useFilterStore();
    const [search, setSearch] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const filteredTasks = mockTasks.filter((task) => {
        const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = taskFilters.status.length === 0 || taskFilters.status.includes(task.status);
        const matchesPriority = taskFilters.priority.length === 0 || taskFilters.priority.includes(task.priority);
        return matchesSearch && matchesStatus && matchesPriority;
    });

    const getTasksByStatus = (status: TaskStatus) => {
        return filteredTasks.filter(task => task.status === status);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Tasks</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage and track your work</p>
                </div>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Task
                </Button>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <Input
                        placeholder="Search tasks..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        icon={<Search className="h-5 w-5" />}
                    />
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant={showFilters ? 'primary' : 'outline'}
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <Filter className="h-4 w-4 mr-2" />
                        Filters
                        {(taskFilters.status.length > 0 || taskFilters.priority.length > 0) && (
                            <span className="ml-2 h-5 w-5 bg-indigo-100 text-indigo-700 rounded-full text-xs flex items-center justify-center">
                                {taskFilters.status.length + taskFilters.priority.length}
                            </span>
                        )}
                    </Button>
                    <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
                        <button
                            onClick={() => setTaskFilters({ view: 'kanban' })}
                            className={cn(
                                'p-2 rounded-lg transition-colors',
                                taskFilters.view === 'kanban' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-slate-500'
                            )}
                        >
                            <LayoutGrid className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => setTaskFilters({ view: 'list' })}
                            className={cn(
                                'p-2 rounded-lg transition-colors',
                                taskFilters.view === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-slate-500'
                            )}
                        >
                            <List className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => setTaskFilters({ view: 'calendar' })}
                            className={cn(
                                'p-2 rounded-lg transition-colors',
                                taskFilters.view === 'calendar' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-slate-500'
                            )}
                        >
                            <CalendarIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Filter Panel */}
            {showFilters && (
                <Card className="p-4">
                    <div className="flex flex-wrap gap-6">
                        <div>
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Status</p>
                            <div className="flex flex-wrap gap-2">
                                {columns.map((col) => (
                                    <button
                                        key={col.id}
                                        onClick={() => {
                                            const newStatus = taskFilters.status.includes(col.id)
                                                ? taskFilters.status.filter(s => s !== col.id)
                                                : [...taskFilters.status, col.id];
                                            setTaskFilters({ status: newStatus });
                                        }}
                                        className={cn(
                                            'px-3 py-1.5 text-sm rounded-lg border transition-colors',
                                            taskFilters.status.includes(col.id)
                                                ? 'bg-indigo-100 border-indigo-300 text-indigo-700'
                                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-indigo-300'
                                        )}
                                    >
                                        {col.title}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Priority</p>
                            <div className="flex flex-wrap gap-2">
                                {Object.keys(priorityConfig).map((priority) => (
                                    <button
                                        key={priority}
                                        onClick={() => {
                                            const newPriority = taskFilters.priority.includes(priority)
                                                ? taskFilters.priority.filter(p => p !== priority)
                                                : [...taskFilters.priority, priority];
                                            setTaskFilters({ priority: newPriority });
                                        }}
                                        className={cn(
                                            'px-3 py-1.5 text-sm rounded-lg border transition-colors',
                                            taskFilters.priority.includes(priority)
                                                ? 'bg-indigo-100 border-indigo-300 text-indigo-700'
                                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-indigo-300'
                                        )}
                                    >
                                        {priority}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {(taskFilters.status.length > 0 || taskFilters.priority.length > 0) && (
                            <button
                                onClick={() => setTaskFilters({ status: [], priority: [] })}
                                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium self-end"
                            >
                                Clear all
                            </button>
                        )}
                    </div>
                </Card>
            )}

            {/* Kanban Board */}
            {taskFilters.view === 'kanban' && (
                <div className="flex gap-6 overflow-x-auto pb-4">
                    {columns.map((column) => {
                        const tasks = getTasksByStatus(column.id);
                        return (
                            <div
                                key={column.id}
                                className="flex-shrink-0 w-80"
                            >
                                {/* Column Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className={cn('h-3 w-3 rounded-full', column.color)} />
                                        <h3 className="font-semibold text-slate-900 dark:text-white">{column.title}</h3>
                                        <span className="text-sm text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                                            {tasks.length}
                                        </span>
                                    </div>
                                    <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                                        <Plus className="h-4 w-4 text-slate-500" />
                                    </button>
                                </div>

                                {/* Column Content */}
                                <div className="space-y-3 min-h-[200px] p-2 bg-slate-100/50 dark:bg-slate-800/50 rounded-xl">
                                    {tasks.map((task) => (
                                        <TaskCard key={task.id} task={task} />
                                    ))}
                                    {tasks.length === 0 && (
                                        <div className="flex items-center justify-center h-24 text-slate-400 text-sm">
                                            No tasks
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* List View */}
            {taskFilters.view === 'list' && (
                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-800">
                                    <th className="text-left py-4 px-6 text-sm font-medium text-slate-500 w-8"></th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-slate-500">Task</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-slate-500">Status</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-slate-500">Priority</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-slate-500">Assignees</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-slate-500">Due Date</th>
                                    <th className="py-4 px-6"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filteredTasks.map((task) => (
                                    <tr
                                        key={task.id}
                                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                                    >
                                        <td className="py-4 px-6">
                                            <button className="h-5 w-5 rounded-full border-2 border-slate-300 dark:border-slate-600 hover:border-indigo-500 transition-colors" />
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="h-2 w-2 rounded-full shrink-0"
                                                    style={{ backgroundColor: task.project.color }}
                                                />
                                                <div>
                                                    <p className="font-medium text-slate-900 dark:text-white">{task.title}</p>
                                                    <p className="text-sm text-slate-500">{task.project.name}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <Badge className={cn(
                                                columns.find(c => c.id === task.status)?.color.replace('bg-', 'bg-opacity-20 text-'),
                                                'text-xs'
                                            )}>
                                                {task.status.replace('_', ' ')}
                                            </Badge>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className={cn('inline-flex items-center gap-1 px-2 py-1 rounded', priorityConfig[task.priority].bg)}>
                                                <Flag className={cn('h-3 w-3', priorityConfig[task.priority].color)} />
                                                <span className={cn('text-xs font-medium', priorityConfig[task.priority].color)}>
                                                    {task.priority}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            {task.assignees.length > 0 ? (
                                                <AvatarGroup
                                                    avatars={task.assignees.map(a => ({
                                                        src: a.avatar,
                                                        fallback: `${a.firstName[0]}${a.lastName[0]}`,
                                                    }))}
                                                    max={3}
                                                    size="xs"
                                                />
                                            ) : (
                                                <span className="text-sm text-slate-400">Unassigned</span>
                                            )}
                                        </td>
                                        <td className="py-4 px-6 text-sm text-slate-500">
                                            {task.dueDate ? formatDate(task.dueDate, { month: 'short', day: 'numeric' }) : '-'}
                                        </td>
                                        <td className="py-4 px-6">
                                            <button className="p-2 opacity-0 group-hover:opacity-100 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all">
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

            {/* Calendar View Placeholder */}
            {taskFilters.view === 'calendar' && (
                <Card className="p-12">
                    <div className="text-center text-slate-500">
                        <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Calendar View</h3>
                        <p>Coming soon! View your tasks in a calendar layout.</p>
                    </div>
                </Card>
            )}
        </div>
    );
}
