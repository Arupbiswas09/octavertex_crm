'use client';

import { useState } from 'react';
import {
    Search,
    Plus,
    MoreHorizontal,
    Mail,
    Phone,
    MapPin,
    Grid3X3,
    List,
    Filter,
    UserPlus,
    Shield,
    Calendar,
} from 'lucide-react';
import { Card, CardContent, Button, Input, Badge, Avatar, Select } from '@/components/ui';
import { cn, formatDate } from '@/utils/helpers';

// Mock data
const teamMembers = [
    {
        id: '1',
        firstName: 'Sarah',
        lastName: 'Chen',
        email: 'sarah.chen@octavertex.com',
        phone: '+1 (555) 123-4567',
        avatar: null,
        role: 'PROJECT_ADMIN',
        title: 'Senior Frontend Developer',
        department: 'Engineering',
        team: 'Web Platform',
        status: 'online',
        startDate: '2023-03-15',
        skills: ['React', 'TypeScript', 'Next.js', 'Tailwind'],
        tasksCompleted: 142,
        projectsActive: 3,
    },
    {
        id: '2',
        firstName: 'Mike',
        lastName: 'Wilson',
        email: 'mike.wilson@octavertex.com',
        phone: '+1 (555) 234-5678',
        avatar: null,
        role: 'TEAM_LEAD',
        title: 'Engineering Manager',
        department: 'Engineering',
        team: 'Mobile',
        status: 'away',
        startDate: '2022-06-01',
        skills: ['React Native', 'iOS', 'Android', 'Flutter'],
        tasksCompleted: 215,
        projectsActive: 4,
    },
    {
        id: '3',
        firstName: 'Emily',
        lastName: 'Brown',
        email: 'emily.brown@octavertex.com',
        phone: '+1 (555) 345-6789',
        avatar: null,
        role: 'EMPLOYEE',
        title: 'UI/UX Designer',
        department: 'Design',
        team: 'Product Design',
        status: 'online',
        startDate: '2023-09-10',
        skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping'],
        tasksCompleted: 87,
        projectsActive: 2,
    },
    {
        id: '4',
        firstName: 'David',
        lastName: 'Lee',
        email: 'david.lee@octavertex.com',
        phone: '+1 (555) 456-7890',
        avatar: null,
        role: 'EMPLOYEE',
        title: 'Backend Developer',
        department: 'Engineering',
        team: 'API Platform',
        status: 'online',
        startDate: '2023-01-20',
        skills: ['Node.js', 'Python', 'PostgreSQL', 'AWS'],
        tasksCompleted: 168,
        projectsActive: 3,
    },
    {
        id: '5',
        firstName: 'Amy',
        lastName: 'Zhang',
        email: 'amy.zhang@octavertex.com',
        phone: '+1 (555) 567-8901',
        avatar: null,
        role: 'EMPLOYEE',
        title: 'Marketing Manager',
        department: 'Marketing',
        team: 'Growth',
        status: 'offline',
        startDate: '2022-11-15',
        skills: ['Digital Marketing', 'SEO', 'Content Strategy', 'Analytics'],
        tasksCompleted: 94,
        projectsActive: 2,
    },
    {
        id: '6',
        firstName: 'Kevin',
        lastName: 'Johnson',
        email: 'kevin.johnson@octavertex.com',
        phone: '+1 (555) 678-9012',
        avatar: null,
        role: 'HR_ADMIN',
        title: 'HR Director',
        department: 'Human Resources',
        team: 'HR',
        status: 'online',
        startDate: '2021-08-01',
        skills: ['Recruitment', 'Employee Relations', 'Policy Development'],
        tasksCompleted: 56,
        projectsActive: 1,
    },
];

const departments = ['All', 'Engineering', 'Design', 'Marketing', 'Human Resources'];
const roles = ['All', 'SUPER_ADMIN', 'HR_ADMIN', 'PROJECT_ADMIN', 'TEAM_LEAD', 'EMPLOYEE'];

const roleColors: Record<string, { bg: string; text: string }> = {
    SUPER_ADMIN: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-400' },
    HR_ADMIN: { bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-700 dark:text-pink-400' },
    PROJECT_ADMIN: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400' },
    TEAM_LEAD: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400' },
    EMPLOYEE: { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300' },
};

const statusColors: Record<string, string> = {
    online: 'bg-emerald-500',
    away: 'bg-amber-500',
    offline: 'bg-slate-400',
    busy: 'bg-red-500',
};

export default function TeamPage() {
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [search, setSearch] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('All');
    const [roleFilter, setRoleFilter] = useState('All');

    const filteredMembers = teamMembers.filter((member) => {
        const matchesSearch =
            `${member.firstName} ${member.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
            member.email.toLowerCase().includes(search.toLowerCase()) ||
            member.title.toLowerCase().includes(search.toLowerCase());
        const matchesDepartment = departmentFilter === 'All' || member.department === departmentFilter;
        const matchesRole = roleFilter === 'All' || member.role === roleFilter;
        return matchesSearch && matchesDepartment && matchesRole;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Team</h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        {teamMembers.length} team members across {departments.length - 1} departments
                    </p>
                </div>
                <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite Member
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <Input
                        placeholder="Search by name, email, or title..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        icon={<Search className="h-5 w-5" />}
                    />
                </div>
                <div className="flex items-center gap-3">
                    <select
                        value={departmentFilter}
                        onChange={(e) => setDepartmentFilter(e.target.value)}
                        className="h-11 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                    >
                        {departments.map((dept) => (
                            <option key={dept} value={dept}>{dept === 'All' ? 'All Departments' : dept}</option>
                        ))}
                    </select>
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="h-11 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                    >
                        {roles.map((role) => (
                            <option key={role} value={role}>{role === 'All' ? 'All Roles' : role.replace('_', ' ')}</option>
                        ))}
                    </select>
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

            {/* Team Grid */}
            {view === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMembers.map((member) => (
                        <Card key={member.id} hover className="group">
                            <CardContent className="p-6">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="relative">
                                        <Avatar
                                            src={member.avatar}
                                            fallback={`${member.firstName[0]}${member.lastName[0]}`}
                                            size="lg"
                                        />
                                        <span className={cn(
                                            'absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white dark:border-slate-900',
                                            statusColors[member.status]
                                        )} />
                                    </div>
                                    <button className="p-2 opacity-0 group-hover:opacity-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all">
                                        <MoreHorizontal className="h-5 w-5 text-slate-400" />
                                    </button>
                                </div>

                                {/* Info */}
                                <div className="mb-4">
                                    <h3 className="font-semibold text-slate-900 dark:text-white">
                                        {member.firstName} {member.lastName}
                                    </h3>
                                    <p className="text-sm text-slate-500">{member.title}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Badge className={cn(roleColors[member.role].bg, roleColors[member.role].text)} size="sm">
                                            <Shield className="h-3 w-3 mr-1" />
                                            {member.role.replace('_', ' ')}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Department & Team */}
                                <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                                    <span>{member.department}</span>
                                    <span>•</span>
                                    <span>{member.team}</span>
                                </div>

                                {/* Skills */}
                                <div className="flex flex-wrap gap-1.5 mb-4">
                                    {member.skills.slice(0, 3).map((skill, index) => (
                                        <span
                                            key={index}
                                            className="px-2 py-0.5 text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                    {member.skills.length > 3 && (
                                        <span className="px-2 py-0.5 text-xs text-slate-500">
                                            +{member.skills.length - 3}
                                        </span>
                                    )}
                                </div>

                                {/* Contact */}
                                <div className="flex items-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <Button variant="ghost" size="sm" className="flex-1">
                                        <Mail className="h-4 w-4 mr-1" />
                                        Email
                                    </Button>
                                    <Button variant="ghost" size="sm" className="flex-1">
                                        <Phone className="h-4 w-4 mr-1" />
                                        Call
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-800">
                                    <th className="text-left py-4 px-6 text-sm font-medium text-slate-500">Name</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-slate-500">Role</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-slate-500">Department</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-slate-500">Status</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-slate-500">Join Date</th>
                                    <th className="py-4 px-6"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filteredMembers.map((member) => (
                                    <tr key={member.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="relative">
                                                    <Avatar
                                                        src={member.avatar}
                                                        fallback={`${member.firstName[0]}${member.lastName[0]}`}
                                                        size="md"
                                                    />
                                                    <span className={cn(
                                                        'absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-slate-900',
                                                        statusColors[member.status]
                                                    )} />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-900 dark:text-white">
                                                        {member.firstName} {member.lastName}
                                                    </p>
                                                    <p className="text-sm text-slate-500">{member.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <Badge className={cn(roleColors[member.role].bg, roleColors[member.role].text)} size="sm">
                                                {member.role.replace('_', ' ')}
                                            </Badge>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div>
                                                <p className="text-slate-900 dark:text-white">{member.department}</p>
                                                <p className="text-sm text-slate-500">{member.team}</p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="flex items-center gap-2 text-sm">
                                                <span className={cn('h-2 w-2 rounded-full', statusColors[member.status])} />
                                                <span className="capitalize text-slate-600 dark:text-slate-400">{member.status}</span>
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-slate-500">
                                            {formatDate(member.startDate)}
                                        </td>
                                        <td className="py-4 px-6">
                                            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
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
