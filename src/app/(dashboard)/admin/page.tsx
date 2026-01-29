'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Users,
    Building2,
    Shield,
    Settings,
    BarChart3,
    Clock,
    Calendar,
    FileText,
    AlertTriangle,
    ChevronRight,
    TrendingUp,
    Activity,
    Database,
} from 'lucide-react';
import { Card, CardContent, CardHeader, Button, Badge } from '@/components/ui';
import { cn } from '@/utils/helpers';

const adminModules = [
    {
        id: 'users',
        title: 'User Management',
        description: 'Manage users, roles, and permissions',
        icon: Users,
        href: '/admin/users',
        color: 'from-indigo-500 to-purple-500',
        stats: { label: 'Total Users', value: '24' },
    },
    {
        id: 'organization',
        title: 'Organization Settings',
        description: 'Configure organization profile and preferences',
        icon: Building2,
        href: '/admin/organization',
        color: 'from-emerald-500 to-teal-500',
        stats: { label: 'Departments', value: '4' },
    },
    {
        id: 'roles',
        title: 'Roles & Permissions',
        description: 'Define custom roles and access controls',
        icon: Shield,
        href: '/admin/roles',
        color: 'from-amber-500 to-orange-500',
        stats: { label: 'Roles', value: '5' },
    },
    {
        id: 'leave-types',
        title: 'Leave Configuration',
        description: 'Manage leave types, policies, and holidays',
        icon: Calendar,
        href: '/admin/leave-config',
        color: 'from-rose-500 to-pink-500',
        stats: { label: 'Leave Types', value: '4' },
    },
    {
        id: 'shifts',
        title: 'Shift Management',
        description: 'Configure work shifts and schedules',
        icon: Clock,
        href: '/admin/shifts',
        color: 'from-cyan-500 to-blue-500',
        stats: { label: 'Shifts', value: '3' },
    },
    {
        id: 'audit-logs',
        title: 'Audit Logs',
        description: 'View system activity and security logs',
        icon: FileText,
        href: '/admin/audit-logs',
        color: 'from-violet-500 to-purple-500',
        stats: { label: 'Today', value: '156' },
    },
];

const quickStats = [
    { label: 'Active Users', value: '22', change: '+2', trend: 'up', icon: Users },
    { label: 'Pending Leaves', value: '5', change: '-3', trend: 'down', icon: Calendar },
    { label: 'Active Projects', value: '12', change: '+1', trend: 'up', icon: Activity },
    { label: 'Storage Used', value: '2.4 GB', change: '+0.3 GB', trend: 'up', icon: Database },
];

const recentActivity = [
    { action: 'User "John Doe" was created', time: '5 minutes ago', type: 'create' },
    { action: 'Leave request approved for Sarah Chen', time: '12 minutes ago', type: 'approve' },
    { action: 'Role "Project Lead" permissions updated', time: '1 hour ago', type: 'update' },
    { action: 'Department "Marketing" was renamed', time: '2 hours ago', type: 'update' },
    { action: 'User "Mike Wilson" role changed to Team Lead', time: '3 hours ago', type: 'update' },
];

const alerts = [
    { message: '3 leave requests pending approval', severity: 'warning', href: '/admin/leave-requests' },
    { message: 'System backup scheduled for tomorrow', severity: 'info', href: '#' },
];

export default function AdminPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage your organization settings and users</p>
                </div>
                <Button variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    System Settings
                </Button>
            </div>

            {/* Alerts */}
            {alerts.length > 0 && (
                <div className="space-y-3">
                    {alerts.map((alert, index) => (
                        <Link key={index} href={alert.href}>
                            <div className={cn(
                                'p-4 rounded-xl flex items-center gap-3 transition-all hover:shadow-md',
                                alert.severity === 'warning' && 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800',
                                alert.severity === 'info' && 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                            )}>
                                <AlertTriangle className={cn(
                                    'h-5 w-5',
                                    alert.severity === 'warning' && 'text-amber-600',
                                    alert.severity === 'info' && 'text-blue-600'
                                )} />
                                <span className={cn(
                                    'flex-1',
                                    alert.severity === 'warning' && 'text-amber-800 dark:text-amber-200',
                                    alert.severity === 'info' && 'text-blue-800 dark:text-blue-200'
                                )}>
                                    {alert.message}
                                </span>
                                <ChevronRight className="h-5 w-5 text-slate-400" />
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickStats.map((stat, index) => (
                    <Card key={index}>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                    <stat.icon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                                </div>
                                <Badge
                                    variant={stat.trend === 'up' ? 'success' : 'danger'}
                                    size="sm"
                                >
                                    <TrendingUp className={cn('h-3 w-3 mr-1', stat.trend === 'down' && 'rotate-180')} />
                                    {stat.change}
                                </Badge>
                            </div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                            <p className="text-sm text-slate-500">{stat.label}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Admin Modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {adminModules.map((module) => (
                    <Link key={module.id} href={module.href}>
                        <Card hover className="h-full group">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className={cn('p-3 rounded-xl bg-gradient-to-br text-white', module.color)}>
                                        <module.icon className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                                            {module.title}
                                        </h3>
                                        <p className="text-sm text-slate-500 mt-1">{module.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <div>
                                        <p className="text-xs text-slate-500">{module.stats.label}</p>
                                        <p className="text-lg font-semibold text-slate-900 dark:text-white">{module.stats.value}</p>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            {/* Recent Activity */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Activity</h2>
                        <p className="text-sm text-slate-500">Latest administrative actions</p>
                    </div>
                    <Link href="/admin/audit-logs">
                        <Button variant="ghost" size="sm">
                            View All <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </Link>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {recentActivity.map((activity, index) => (
                            <div key={index} className="flex items-center gap-4 px-6 py-4">
                                <div className={cn(
                                    'h-2 w-2 rounded-full',
                                    activity.type === 'create' && 'bg-emerald-500',
                                    activity.type === 'update' && 'bg-blue-500',
                                    activity.type === 'delete' && 'bg-red-500',
                                    activity.type === 'approve' && 'bg-purple-500'
                                )} />
                                <p className="flex-1 text-slate-700 dark:text-slate-300">{activity.action}</p>
                                <span className="text-sm text-slate-500">{activity.time}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
