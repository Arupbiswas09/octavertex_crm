import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ============================================
// UI Store - Sidebar, Theme, Modal states
// ============================================

interface UIState {
    sidebarOpen: boolean;
    sidebarCollapsed: boolean;
    theme: 'light' | 'dark' | 'system';
    modalOpen: string | null;
    modalData: Record<string, unknown> | null;

    // Actions
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
    toggleSidebarCollapse: () => void;
    setTheme: (theme: 'light' | 'dark' | 'system') => void;
    openModal: (modalId: string, data?: Record<string, unknown>) => void;
    closeModal: () => void;
}

export const useUIStore = create<UIState>()(
    persist(
        (set) => ({
            sidebarOpen: true,
            sidebarCollapsed: false,
            theme: 'system',
            modalOpen: null,
            modalData: null,

            toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
            setSidebarOpen: (open) => set({ sidebarOpen: open }),
            toggleSidebarCollapse: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
            setTheme: (theme) => set({ theme }),
            openModal: (modalId, data) => set({ modalOpen: modalId, modalData: data || null }),
            closeModal: () => set({ modalOpen: null, modalData: null }),
        }),
        {
            name: 'octavertex-ui',
            partialize: (state) => ({
                sidebarCollapsed: state.sidebarCollapsed,
                theme: state.theme,
            }),
        }
    )
);

// ============================================
// Notification Store
// ============================================

interface NotificationItem {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
    duration?: number;
}

interface NotificationState {
    notifications: NotificationItem[];
    unreadCount: number;

    // Actions
    addNotification: (notification: Omit<NotificationItem, 'id'>) => void;
    removeNotification: (id: string) => void;
    clearAll: () => void;
    setUnreadCount: (count: number) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
    notifications: [],
    unreadCount: 0,

    addNotification: (notification) => {
        const id = Math.random().toString(36).substring(7);
        set((state) => ({
            notifications: [...state.notifications, { ...notification, id }],
        }));

        // Auto-remove after duration
        const duration = notification.duration || 5000;
        if (duration > 0) {
            setTimeout(() => {
                set((state) => ({
                    notifications: state.notifications.filter((n) => n.id !== id),
                }));
            }, duration);
        }
    },

    removeNotification: (id) =>
        set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
        })),

    clearAll: () => set({ notifications: [] }),

    setUnreadCount: (count) => set({ unreadCount: count }),
}));

// ============================================
// Attendance Store - Clock In/Out state
// ============================================

interface AttendanceState {
    isClockedIn: boolean;
    clockInTime: Date | null;
    currentAttendanceId: string | null;
    isOnBreak: boolean;
    breakStartTime: Date | null;
    todayWorkSeconds: number;

    // Actions
    clockIn: (attendanceId: string) => void;
    clockOut: () => void;
    startBreak: () => void;
    endBreak: () => void;
    updateWorkSeconds: (seconds: number) => void;
    reset: () => void;
}

export const useAttendanceStore = create<AttendanceState>()(
    persist(
        (set) => ({
            isClockedIn: false,
            clockInTime: null,
            currentAttendanceId: null,
            isOnBreak: false,
            breakStartTime: null,
            todayWorkSeconds: 0,

            clockIn: (attendanceId) =>
                set({
                    isClockedIn: true,
                    clockInTime: new Date(),
                    currentAttendanceId: attendanceId,
                }),

            clockOut: () =>
                set({
                    isClockedIn: false,
                    clockInTime: null,
                    currentAttendanceId: null,
                    isOnBreak: false,
                    breakStartTime: null,
                }),

            startBreak: () =>
                set({
                    isOnBreak: true,
                    breakStartTime: new Date(),
                }),

            endBreak: () =>
                set({
                    isOnBreak: false,
                    breakStartTime: null,
                }),

            updateWorkSeconds: (seconds) => set({ todayWorkSeconds: seconds }),

            reset: () =>
                set({
                    isClockedIn: false,
                    clockInTime: null,
                    currentAttendanceId: null,
                    isOnBreak: false,
                    breakStartTime: null,
                    todayWorkSeconds: 0,
                }),
        }),
        {
            name: 'octavertex-attendance',
        }
    )
);

// ============================================
// Timer Store - Task Time Tracking
// ============================================

interface TimerState {
    activeTaskId: string | null;
    startTime: Date | null;
    elapsedSeconds: number;
    isPaused: boolean;

    // Actions
    startTimer: (taskId: string) => void;
    stopTimer: () => void;
    pauseTimer: () => void;
    resumeTimer: () => void;
    updateElapsed: (seconds: number) => void;
    reset: () => void;
}

export const useTimerStore = create<TimerState>((set) => ({
    activeTaskId: null,
    startTime: null,
    elapsedSeconds: 0,
    isPaused: false,

    startTimer: (taskId) =>
        set({
            activeTaskId: taskId,
            startTime: new Date(),
            elapsedSeconds: 0,
            isPaused: false,
        }),

    stopTimer: () =>
        set({
            activeTaskId: null,
            startTime: null,
            elapsedSeconds: 0,
            isPaused: false,
        }),

    pauseTimer: () => set({ isPaused: true }),
    resumeTimer: () => set({ isPaused: false }),
    updateElapsed: (seconds) => set({ elapsedSeconds: seconds }),
    reset: () =>
        set({
            activeTaskId: null,
            startTime: null,
            elapsedSeconds: 0,
            isPaused: false,
        }),
}));

// ============================================
// Chat Store
// ============================================

interface ChatState {
    activeChannelId: string | null;
    unreadMessages: Record<string, number>;
    isTyping: Record<string, string[]>; // channelId -> userIds

    // Actions
    setActiveChannel: (channelId: string | null) => void;
    setUnreadCount: (channelId: string, count: number) => void;
    clearUnread: (channelId: string) => void;
    setTyping: (channelId: string, userIds: string[]) => void;
}

export const useChatStore = create<ChatState>((set) => ({
    activeChannelId: null,
    unreadMessages: {},
    isTyping: {},

    setActiveChannel: (channelId) => set({ activeChannelId: channelId }),

    setUnreadCount: (channelId, count) =>
        set((state) => ({
            unreadMessages: { ...state.unreadMessages, [channelId]: count },
        })),

    clearUnread: (channelId) =>
        set((state) => ({
            unreadMessages: { ...state.unreadMessages, [channelId]: 0 },
        })),

    setTyping: (channelId, userIds) =>
        set((state) => ({
            isTyping: { ...state.isTyping, [channelId]: userIds },
        })),
}));

// ============================================
// Project/Task Filter Store
// ============================================

interface FilterState {
    projectFilters: {
        status: string[];
        teamId: string | null;
        search: string;
    };
    taskFilters: {
        status: string[];
        priority: string[];
        assigneeId: string | null;
        projectId: string | null;
        search: string;
        view: 'kanban' | 'list' | 'calendar';
    };

    // Actions
    setProjectFilters: (filters: Partial<FilterState['projectFilters']>) => void;
    setTaskFilters: (filters: Partial<FilterState['taskFilters']>) => void;
    resetFilters: () => void;
}

const defaultFilters: Omit<FilterState, 'setProjectFilters' | 'setTaskFilters' | 'resetFilters'> = {
    projectFilters: {
        status: [],
        teamId: null,
        search: '',
    },
    taskFilters: {
        status: [],
        priority: [],
        assigneeId: null,
        projectId: null,
        search: '',
        view: 'kanban',
    },
};

export const useFilterStore = create<FilterState>((set) => ({
    ...defaultFilters,

    setProjectFilters: (filters) =>
        set((state) => ({
            projectFilters: { ...state.projectFilters, ...filters },
        })),

    setTaskFilters: (filters) =>
        set((state) => ({
            taskFilters: { ...state.taskFilters, ...filters },
        })),

    resetFilters: () => set(defaultFilters),
}));
