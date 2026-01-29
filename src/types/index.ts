import { Role, UserStatus, ProjectStatus, TaskStatus, Priority, LeaveStatus, AttendanceStatus, NotificationType, ChannelType } from '@prisma/client';

// Re-export Prisma enums for use throughout the app
export { Role, UserStatus, ProjectStatus, TaskStatus, Priority, LeaveStatus, AttendanceStatus, NotificationType, ChannelType };

// ============================================
// User Types
// ============================================

export interface UserBasic {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
    role: Role;
    status: UserStatus;
}

export interface UserProfile extends UserBasic {
    phone: string | null;
    title: string | null;
    bio: string | null;
    skills: string[];
    timezone: string;
    organizationId: string | null;
    departmentId: string | null;
    managerId: string | null;
    startDate: Date | null;
    lastLogin: Date | null;
}

export interface FullUser extends UserProfile {
    organization: OrganizationBasic | null;
    department: DepartmentBasic | null;
    manager: UserBasic | null;
    directReports: UserBasic[];
    teamMemberships: TeamMemberWithTeam[];
}

// ============================================
// Organization Types
// ============================================

export interface OrganizationBasic {
    id: string;
    name: string;
    slug: string;
    logo: string | null;
}

export interface DepartmentBasic {
    id: string;
    name: string;
    description: string | null;
}

// ============================================
// Team Types
// ============================================

export interface TeamBasic {
    id: string;
    name: string;
    description: string | null;
    color: string | null;
}

export interface TeamMemberWithTeam {
    id: string;
    teamId: string;
    userId: string;
    role: string;
    team: TeamBasic;
}

export interface TeamWithMembers extends TeamBasic {
    members: (TeamMemberWithTeam & { user: UserBasic })[];
}

// ============================================
// Project Types
// ============================================

export interface ProjectBasic {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    color: string | null;
    icon: string | null;
    status: ProjectStatus;
}

export interface ProjectWithDetails extends ProjectBasic {
    visibility: string;
    startDate: Date | null;
    endDate: Date | null;
    estimatedHours: number | null;
    team: TeamBasic | null;
    createdBy: UserBasic;
    _count: {
        tasks: number;
    };
}

// ============================================
// Task Types
// ============================================

export interface TaskBasic {
    id: string;
    title: string;
    status: TaskStatus;
    priority: Priority;
    dueDate: Date | null;
    position: number;
}

export interface TaskWithDetails extends TaskBasic {
    description: string | null;
    estimatedHours: number | null;
    storyPoints: number | null;
    startDate: Date | null;
    completedAt: Date | null;
    project: ProjectBasic;
    parent: TaskBasic | null;
    milestone: MilestoneBasic | null;
    createdBy: UserBasic;
    assignees: TaskAssigneeWithUser[];
    labels: TaskLabelWithLabel[];
    _count: {
        subtasks: number;
        comments: number;
        attachments: number;
    };
}

export interface TaskAssigneeWithUser {
    id: string;
    assignedAt: Date;
    user: UserBasic;
}

export interface TaskLabelWithLabel {
    id: string;
    label: LabelBasic;
}

export interface LabelBasic {
    id: string;
    name: string;
    color: string;
}

export interface MilestoneBasic {
    id: string;
    name: string;
    description: string | null;
    dueDate: Date | null;
    completed: boolean;
}

// ============================================
// Time & Attendance Types
// ============================================

export interface TimeEntryBasic {
    id: string;
    description: string | null;
    startTime: Date;
    endTime: Date | null;
    duration: number | null;
    billable: boolean;
    date: Date;
    approved: boolean;
}

export interface TimeEntryWithDetails extends TimeEntryBasic {
    user: UserBasic;
    task: TaskBasic | null;
    project: ProjectBasic | null;
}

export interface AttendanceRecord {
    id: string;
    date: Date;
    status: AttendanceStatus;
    clockIn: Date | null;
    clockOut: Date | null;
    workHours: number | null;
    overtimeHours: number | null;
    notes: string | null;
    approved: boolean;
    locked: boolean;
}

export interface AttendanceWithUser extends AttendanceRecord {
    user: UserBasic;
}

// ============================================
// Leave Types
// ============================================

export interface LeaveTypeBasic {
    id: string;
    name: string;
    description: string | null;
    color: string | null;
    defaultDays: number;
    requiresApproval: boolean;
    paid: boolean;
}

export interface LeaveBalanceInfo {
    id: string;
    year: number;
    entitled: number;
    used: number;
    pending: number;
    carriedOver: number;
    available: number;
    leaveType: LeaveTypeBasic;
}

export interface LeaveRequestInfo {
    id: string;
    startDate: Date;
    endDate: Date;
    days: number;
    halfDay: boolean;
    halfDayType: string | null;
    reason: string | null;
    status: LeaveStatus;
    approvedAt: Date | null;
    rejectionReason: string | null;
    user: UserBasic;
    leaveType: LeaveTypeBasic;
    approver: UserBasic | null;
}

// ============================================
// Chat Types
// ============================================

export interface ChannelBasic {
    id: string;
    name: string | null;
    description: string | null;
    type: ChannelType;
}

export interface ChannelWithDetails extends ChannelBasic {
    project: ProjectBasic | null;
    team: TeamBasic | null;
    members: ChannelMemberWithUser[];
    _count: {
        messages: number;
    };
}

export interface ChannelMemberWithUser {
    id: string;
    role: string;
    lastRead: Date;
    muted: boolean;
    user: UserBasic;
}

export interface ChatMessageInfo {
    id: string;
    content: string;
    edited: boolean;
    deleted: boolean;
    attachments: unknown[];
    reactions: Record<string, string[]>;
    mentions: string[];
    createdAt: Date;
    sender: UserBasic;
    replies?: ChatMessageInfo[];
}

// ============================================
// Notification Types
// ============================================

export interface NotificationInfo {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    data: Record<string, unknown>;
    read: boolean;
    readAt: Date | null;
    actionUrl: string | null;
    createdAt: Date;
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasMore: boolean;
}

// ============================================
// Dashboard Types
// ============================================

export interface DashboardStats {
    totalProjects: number;
    activeProjects: number;
    totalTasks: number;
    completedTasks: number;
    overdueTasks: number;
    todayAttendance: AttendanceRecord | null;
    pendingLeaves: number;
    unreadNotifications: number;
    weeklyHours: number;
    todayTasks: TaskBasic[];
}

// ============================================
// Report Types
// ============================================

export interface TimesheetReport {
    userId: string;
    userName: string;
    date: Date;
    totalHours: number;
    billableHours: number;
    entries: TimeEntryBasic[];
}

export interface AttendanceReport {
    userId: string;
    userName: string;
    month: number;
    year: number;
    presentDays: number;
    absentDays: number;
    halfDays: number;
    lateDays: number;
    leaveDays: number;
    totalWorkHours: number;
    totalOvertime: number;
}
