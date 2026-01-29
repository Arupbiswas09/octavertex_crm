'use client';

import { useState } from 'react';
import {
    Plus,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    FileText,
    Users,
} from 'lucide-react';
import { Card, CardContent, CardHeader, Button, Badge, Avatar, Progress, Input, Select, Textarea } from '@/components/ui';
import { cn, formatDate } from '@/utils/helpers';

// Mock data
const leaveTypes = [
    { id: '1', name: 'Casual Leave', color: '#3b82f6', entitled: 12, used: 4, pending: 1 },
    { id: '2', name: 'Sick Leave', color: '#ef4444', entitled: 12, used: 2, pending: 0 },
    { id: '3', name: 'Earned Leave', color: '#10b981', entitled: 15, used: 5, pending: 0 },
    { id: '4', name: 'Unpaid Leave', color: '#6b7280', entitled: 0, used: 0, pending: 0 },
];

const leaveRequests = [
    {
        id: '1',
        type: 'Casual Leave',
        typeColor: '#3b82f6',
        startDate: '2025-02-05',
        endDate: '2025-02-07',
        days: 3,
        reason: 'Family vacation trip',
        status: 'PENDING',
        appliedOn: '2025-01-28',
        approver: { name: 'John Smith', avatar: null },
    },
    {
        id: '2',
        type: 'Sick Leave',
        typeColor: '#ef4444',
        startDate: '2025-01-23',
        endDate: '2025-01-23',
        days: 1,
        reason: 'Feeling unwell',
        status: 'APPROVED',
        appliedOn: '2025-01-23',
        approver: { name: 'John Smith', avatar: null },
        approvedOn: '2025-01-23',
    },
    {
        id: '3',
        type: 'Earned Leave',
        typeColor: '#10b981',
        startDate: '2024-12-25',
        endDate: '2024-12-31',
        days: 5,
        reason: 'Christmas holidays',
        status: 'APPROVED',
        appliedOn: '2024-12-15',
        approver: { name: 'John Smith', avatar: null },
        approvedOn: '2024-12-16',
    },
    {
        id: '4',
        type: 'Casual Leave',
        typeColor: '#3b82f6',
        startDate: '2024-11-20',
        endDate: '2024-11-20',
        days: 1,
        reason: 'Personal work',
        status: 'REJECTED',
        appliedOn: '2024-11-18',
        approver: { name: 'John Smith', avatar: null },
        rejectedOn: '2024-11-19',
        rejectionReason: 'Critical project deadline',
    },
];

const teamOnLeave = [
    { id: '1', name: 'Sarah Chen', type: 'Vacation', dates: 'Feb 5 - Feb 8', avatar: null },
    { id: '2', name: 'Mike Wilson', type: 'Sick Leave', dates: 'Feb 6', avatar: null },
];

const statusConfig: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
    PENDING: { color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/30', icon: <Clock className="h-4 w-4" /> },
    APPROVED: { color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/30', icon: <CheckCircle2 className="h-4 w-4" /> },
    REJECTED: { color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30', icon: <XCircle className="h-4 w-4" /> },
    CANCELLED: { color: 'text-slate-600', bg: 'bg-slate-100 dark:bg-slate-800', icon: <XCircle className="h-4 w-4" /> },
};

export default function LeavePage() {
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [selectedYear, setSelectedYear] = useState(2025);

    const totalEntitled = leaveTypes.reduce((sum, type) => sum + type.entitled, 0);
    const totalUsed = leaveTypes.reduce((sum, type) => sum + type.used, 0);
    const totalPending = leaveTypes.reduce((sum, type) => sum + type.pending, 0);
    const totalAvailable = totalEntitled - totalUsed - totalPending;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Leave Management</h1>
                    <p className="text-slate-500 dark:text-slate-400">Apply for leave and track your balances</p>
                </div>
                <Button onClick={() => setShowApplyModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Apply Leave
                </Button>
            </div>

            {/* Leave Balances */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {leaveTypes.map((type) => {
                    const available = type.entitled - type.used - type.pending;
                    const usedPercentage = type.entitled > 0 ? (type.used / type.entitled) * 100 : 0;
                    return (
                        <Card key={type.id} className="relative overflow-hidden group hover:shadow-lg transition-all">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div
                                        className="h-3 w-3 rounded-full"
                                        style={{ backgroundColor: type.color }}
                                    />
                                    <span className="text-xs text-slate-500">{selectedYear}</span>
                                </div>
                                <h3 className="font-medium text-slate-900 dark:text-white mb-1">{type.name}</h3>
                                <div className="flex items-baseline gap-1 mb-4">
                                    <span className="text-3xl font-bold text-slate-900 dark:text-white">{available}</span>
                                    <span className="text-sm text-slate-500">/ {type.entitled} days</span>
                                </div>
                                <Progress
                                    value={type.used + type.pending}
                                    max={type.entitled || 1}
                                    size="sm"
                                    color={usedPercentage > 80 ? 'danger' : 'default'}
                                />
                                <div className="flex justify-between text-xs text-slate-500 mt-2">
                                    <span>{type.used} used</span>
                                    {type.pending > 0 && <span className="text-amber-600">{type.pending} pending</span>}
                                </div>
                                {/* Decorative */}
                                <div
                                    className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full opacity-10"
                                    style={{ backgroundColor: type.color }}
                                />
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Summary Card */}
            <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white overflow-hidden relative">
                <CardContent className="p-6 relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div>
                            <p className="text-white/60 text-sm mb-1">Total Entitled</p>
                            <p className="text-3xl font-bold">{totalEntitled}</p>
                            <p className="text-white/60 text-xs">days/year</p>
                        </div>
                        <div>
                            <p className="text-white/60 text-sm mb-1">Used</p>
                            <p className="text-3xl font-bold">{totalUsed}</p>
                            <p className="text-white/60 text-xs">days</p>
                        </div>
                        <div>
                            <p className="text-white/60 text-sm mb-1">Pending</p>
                            <p className="text-3xl font-bold text-amber-300">{totalPending}</p>
                            <p className="text-white/60 text-xs">days</p>
                        </div>
                        <div>
                            <p className="text-white/60 text-sm mb-1">Available</p>
                            <p className="text-3xl font-bold text-emerald-300">{totalAvailable}</p>
                            <p className="text-white/60 text-xs">days</p>
                        </div>
                    </div>
                </CardContent>
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Leave Requests */}
                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Leave Requests</h2>
                            <p className="text-sm text-slate-500">Your leave applications</p>
                        </div>
                        <select className="text-sm bg-slate-100 dark:bg-slate-800 border-0 rounded-lg px-3 py-1.5">
                            <option>All Status</option>
                            <option>Pending</option>
                            <option>Approved</option>
                            <option>Rejected</option>
                        </select>
                    </CardHeader>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {leaveRequests.map((request) => {
                            const config = statusConfig[request.status];
                            return (
                                <div key={request.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <div className="flex items-start gap-4">
                                        <div
                                            className="h-12 w-12 rounded-xl flex items-center justify-center text-white font-semibold"
                                            style={{ backgroundColor: request.typeColor }}
                                        >
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <h4 className="font-medium text-slate-900 dark:text-white">{request.type}</h4>
                                                    <p className="text-sm text-slate-500">
                                                        {formatDate(request.startDate)}
                                                        {request.startDate !== request.endDate && ` - ${formatDate(request.endDate)}`}
                                                        <span className="mx-2">•</span>
                                                        {request.days} day{request.days > 1 ? 's' : ''}
                                                    </p>
                                                </div>
                                                <Badge className={cn(config.bg, config.color)}>
                                                    <span className="flex items-center gap-1">
                                                        {config.icon}
                                                        {request.status}
                                                    </span>
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{request.reason}</p>
                                            <div className="flex items-center justify-between text-xs text-slate-500">
                                                <span>Applied on {formatDate(request.appliedOn)}</span>
                                                <div className="flex items-center gap-2">
                                                    <Avatar
                                                        src={request.approver.avatar}
                                                        fallback={request.approver.name.split(' ').map(n => n[0]).join('')}
                                                        size="xs"
                                                    />
                                                    <span>{request.approver.name}</span>
                                                </div>
                                            </div>
                                            {request.status === 'REJECTED' && request.rejectionReason && (
                                                <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                                    <p className="text-sm text-red-600 dark:text-red-400">
                                                        <span className="font-medium">Reason:</span> {request.rejectionReason}
                                                    </p>
                                                </div>
                                            )}
                                            {request.status === 'PENDING' && (
                                                <div className="mt-3 flex gap-2">
                                                    <Button variant="outline" size="sm">
                                                        Edit
                                                    </Button>
                                                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                                        Cancel
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>

                {/* Team on Leave */}
                <Card>
                    <CardHeader>
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Team on Leave</h2>
                        <p className="text-sm text-slate-500">Upcoming team absences</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {teamOnLeave.length === 0 ? (
                            <div className="text-center py-6 text-slate-500">
                                <Users className="h-10 w-10 mx-auto mb-2 text-slate-300" />
                                <p>No team members on leave</p>
                            </div>
                        ) : (
                            teamOnLeave.map((member) => (
                                <div
                                    key={member.id}
                                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50"
                                >
                                    <Avatar
                                        src={member.avatar}
                                        fallback={member.name.split(' ').map(n => n[0]).join('')}
                                        size="md"
                                    />
                                    <div className="flex-1">
                                        <p className="font-medium text-slate-900 dark:text-white">{member.name}</p>
                                        <p className="text-sm text-slate-500">{member.type}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-slate-900 dark:text-white">{member.dates}</p>
                                    </div>
                                </div>
                            ))
                        )}

                        {/* Calendar Preview */}
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex items-center justify-between mb-4">
                                <Button variant="ghost" size="icon">
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <span className="text-sm font-medium">February 2025</span>
                                <Button variant="ghost" size="icon">
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="grid grid-cols-7 gap-1 text-center text-xs">
                                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                                    <div key={i} className="py-1 text-slate-400">{day}</div>
                                ))}
                                {Array.from({ length: 35 }, (_, i) => {
                                    const date = i - 5; // February starts on Saturday (index 6)
                                    const isValid = date >= 1 && date <= 28;
                                    const hasLeave = [5, 6, 7, 8].includes(date);
                                    return (
                                        <div
                                            key={i}
                                            className={cn(
                                                'py-1 rounded',
                                                !isValid && 'text-slate-300',
                                                hasLeave && 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
                                                date === 30 && isValid && 'bg-indigo-500 text-white font-medium'
                                            )}
                                        >
                                            {isValid ? date : ''}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Apply Leave Modal */}
            {showApplyModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <Card className="w-full max-w-lg mx-4 max-h-[90vh] overflow-auto">
                        <CardHeader className="flex flex-row items-center justify-between border-b">
                            <h2 className="text-lg font-semibold">Apply for Leave</h2>
                            <button
                                onClick={() => setShowApplyModal(false)}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                            >
                                <XCircle className="h-5 w-5" />
                            </button>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <Select
                                label="Leave Type"
                                options={leaveTypes.map(t => ({ value: t.id, label: t.name }))}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <Input label="Start Date" type="date" />
                                <Input label="End Date" type="date" />
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="halfDay" className="rounded" />
                                <label htmlFor="halfDay" className="text-sm text-slate-700 dark:text-slate-300">
                                    Half Day
                                </label>
                            </div>
                            <Textarea label="Reason" placeholder="Enter reason for leave..." />
                            <div className="flex gap-3 pt-4">
                                <Button variant="outline" onClick={() => setShowApplyModal(false)} className="flex-1">
                                    Cancel
                                </Button>
                                <Button className="flex-1">
                                    Submit Request
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
