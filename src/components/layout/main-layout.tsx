'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import {
    LayoutDashboard,
    FolderKanban,
    CheckSquare,
    Clock,
    Calendar,
    MessageSquare,
    Users,
    BarChart3,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Building2,
    Bell,
    FileText,
    Search,
    Plus,
    Sparkles,
    ChevronDown,
    Star,
    CircleDot,
    Inbox,
    Target,
    Zap,
    Command,
    HelpCircle,
} from 'lucide-react';
import { cn } from '@/utils/helpers';
import { useUIStore } from '@/stores';
import { Avatar, Badge } from '@/components/ui';

interface NavItem {
    href: string;
    label: string;
    icon: React.ReactNode;
    badge?: number;
    roles?: string[];
}

const mainNavItems: NavItem[] = [
    { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { href: '/inbox', label: 'Inbox', icon: <Inbox className="h-5 w-5" />, badge: 5 },
    { href: '/tasks', label: 'My Tasks', icon: <CheckSquare className="h-5 w-5" />, badge: 12 },
    { href: '/time-tracking', label: 'Time Tracking', icon: <Clock className="h-5 w-5" /> },
];

const workspaceNavItems: NavItem[] = [
    { href: '/projects', label: 'Projects', icon: <FolderKanban className="h-5 w-5" /> },
    { href: '/goals', label: 'Goals', icon: <Target className="h-5 w-5" /> },
    { href: '/team', label: 'Team', icon: <Users className="h-5 w-5" /> },
    { href: '/chat', label: 'Messages', icon: <MessageSquare className="h-5 w-5" />, badge: 3 },
];

const hrNavItems: NavItem[] = [
    { href: '/attendance', label: 'Attendance', icon: <Calendar className="h-5 w-5" /> },
    { href: '/leave', label: 'Leave', icon: <FileText className="h-5 w-5" /> },
    { href: '/reports', label: 'Reports', icon: <BarChart3 className="h-5 w-5" /> },
];

const adminNavItems: NavItem[] = [
    { href: '/admin', label: 'Admin', icon: <Building2 className="h-5 w-5" />, roles: ['SUPER_ADMIN', 'HR_ADMIN'] },
    { href: '/settings', label: 'Settings', icon: <Settings className="h-5 w-5" /> },
];

// Favorite projects (mock data - would come from API)
const favoriteProjects = [
    { id: '1', name: 'Website Redesign', color: '#6366f1', icon: '🌐' },
    { id: '2', name: 'Mobile App v2', color: '#10b981', icon: '📱' },
    { id: '3', name: 'Marketing Q1', color: '#f59e0b', icon: '📣' },
];

export function Sidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const { sidebarCollapsed, toggleSidebarCollapse } = useUIStore();
    const [projectsExpanded, setProjectsExpanded] = useState(true);

    const isActive = (href: string) => {
        if (href === '/dashboard') return pathname === href;
        return pathname.startsWith(href);
    };

    const user = session?.user;
    const userRole = user?.role || 'EMPLOYEE';

    const filteredAdminItems = adminNavItems.filter(
        item => !item.roles || item.roles.includes(userRole)
    );

    const NavLink = ({ item }: { item: NavItem }) => (
        <Link
            href={item.href}
            className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-150 group relative',
                isActive(item.href)
                    ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800',
                sidebarCollapsed && 'justify-center px-2'
            )}
        >
            <span className={cn(
                'transition-colors shrink-0',
                isActive(item.href) && 'text-indigo-500'
            )}>
                {item.icon}
            </span>
            {!sidebarCollapsed && (
                <>
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                        <span className="ml-auto px-1.5 py-0.5 text-xs font-medium bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded">
                            {item.badge}
                        </span>
                    )}
                </>
            )}
            {sidebarCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-lg">
                    {item.label}
                    {item.badge && <span className="ml-2 text-indigo-400">({item.badge})</span>}
                </div>
            )}
        </Link>
    );

    return (
        <aside
            className={cn(
                'fixed left-0 top-0 z-40 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 flex flex-col',
                sidebarCollapsed ? 'w-16' : 'w-60'
            )}
        >
            {/* Logo Header */}
            <div className={cn(
                'h-14 flex items-center border-b border-slate-200 dark:border-slate-800 px-3',
                sidebarCollapsed ? 'justify-center' : 'justify-between'
            )}>
                <Link href="/dashboard" className="flex items-center gap-2">
                    <Image
                        src="/logo.png"
                        alt="Octavertex Media"
                        width={sidebarCollapsed ? 32 : 120}
                        height={32}
                        className="object-contain"
                    />
                </Link>
                {!sidebarCollapsed && (
                    <button
                        onClick={toggleSidebarCollapse}
                        className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* Quick Actions - ClickUp style */}
            {!sidebarCollapsed && (
                <div className="px-3 py-3 border-b border-slate-200 dark:border-slate-800">
                    <button className="w-full flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-opacity shadow-sm">
                        <Plus className="h-4 w-4" />
                        <span className="font-medium">Create</span>
                    </button>
                </div>
            )}

            {sidebarCollapsed && (
                <div className="p-2 border-b border-slate-200 dark:border-slate-800">
                    <button
                        onClick={toggleSidebarCollapse}
                        className="w-full p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                    >
                        <Plus className="h-4 w-4 mx-auto" />
                    </button>
                </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-5">
                {/* Main Nav */}
                <div className="space-y-0.5">
                    {mainNavItems.map((item) => (
                        <NavLink key={item.href} item={item} />
                    ))}
                </div>

                {/* Favorites / Projects - Jira style */}
                {!sidebarCollapsed && (
                    <div className="space-y-1">
                        <button
                            onClick={() => setProjectsExpanded(!projectsExpanded)}
                            className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hover:text-slate-700 dark:hover:text-slate-300"
                        >
                            <span className="flex items-center gap-2">
                                <Star className="h-3 w-3" />
                                Favorites
                            </span>
                            <ChevronDown className={cn(
                                'h-3 w-3 transition-transform',
                                !projectsExpanded && '-rotate-90'
                            )} />
                        </button>
                        {projectsExpanded && (
                            <div className="space-y-0.5">
                                {favoriteProjects.map((project) => (
                                    <Link
                                        key={project.id}
                                        href={`/projects/${project.id}`}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm"
                                    >
                                        <span className="text-sm">{project.icon}</span>
                                        <span className="truncate">{project.name}</span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Workspace Nav */}
                <div className="space-y-0.5">
                    {!sidebarCollapsed && (
                        <p className="px-3 py-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Workspace
                        </p>
                    )}
                    {workspaceNavItems.map((item) => (
                        <NavLink key={item.href} item={item} />
                    ))}
                </div>

                {/* HR Nav */}
                <div className="space-y-0.5">
                    {!sidebarCollapsed && (
                        <p className="px-3 py-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            HR & Admin
                        </p>
                    )}
                    {hrNavItems.map((item) => (
                        <NavLink key={item.href} item={item} />
                    ))}
                    {filteredAdminItems.map((item) => (
                        <NavLink key={item.href} item={item} />
                    ))}
                </div>
            </nav>

            {/* User Profile - Bottom */}
            <div className="border-t border-slate-200 dark:border-slate-800 p-3">
                <div className={cn(
                    'flex items-center gap-3',
                    sidebarCollapsed && 'justify-center'
                )}>
                    <Link href="/profile" className="shrink-0">
                        <Avatar
                            src={user?.avatar}
                            fallback={user ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}` : 'U'}
                            size="sm"
                            status="online"
                        />
                    </Link>
                    {!sidebarCollapsed && (
                        <>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                    {user?.firstName} {user?.lastName}
                                </p>
                                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                            </div>
                            <button
                                onClick={() => signOut({ callbackUrl: '/login' })}
                                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                                title="Sign out"
                            >
                                <LogOut className="h-4 w-4" />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </aside>
    );
}

export function Header() {
    const { data: session } = useSession();
    const { sidebarCollapsed } = useUIStore();
    const [searchFocused, setSearchFocused] = useState(false);
    const user = session?.user;

    return (
        <header
            className={cn(
                'fixed top-0 right-0 z-30 h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-all duration-300',
                sidebarCollapsed ? 'left-16' : 'left-60'
            )}
        >
            <div className="h-full px-4 flex items-center justify-between gap-4">
                {/* Global Search - Jira/ClickUp style */}
                <div className={cn(
                    'flex-1 max-w-xl transition-all',
                    searchFocused && 'max-w-2xl'
                )}>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search everything..."
                            onFocus={() => setSearchFocused(true)}
                            onBlur={() => setSearchFocused(false)}
                            className={cn(
                                'w-full h-9 pl-9 pr-20 text-sm bg-slate-100 dark:bg-slate-800 border-0 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all placeholder:text-slate-400',
                            )}
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                            <kbd className="px-1.5 py-0.5 text-xs text-slate-400 bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 font-mono">
                                <Command className="h-3 w-3 inline" />
                            </kbd>
                            <kbd className="px-1.5 py-0.5 text-xs text-slate-400 bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 font-mono">
                                K
                            </kbd>
                        </div>
                    </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-1">
                    {/* Quick Actions */}
                    <button className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" title="AI Assistant">
                        <Sparkles className="h-5 w-5" />
                    </button>

                    <button className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" title="Automations">
                        <Zap className="h-5 w-5" />
                    </button>

                    {/* Notifications */}
                    <button className="relative p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
                    </button>

                    {/* Help */}
                    <button className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" title="Help">
                        <HelpCircle className="h-5 w-5" />
                    </button>

                    {/* User Menu */}
                    <div className="flex items-center gap-2 pl-2 ml-2 border-l border-slate-200 dark:border-slate-700">
                        <Link href="/profile" className="flex items-center gap-2 px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                            <Avatar
                                src={user?.avatar}
                                fallback={user ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}` : 'U'}
                                size="sm"
                            />
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-medium text-slate-900 dark:text-white leading-tight">
                                    {user?.firstName}
                                </p>
                            </div>
                            <ChevronDown className="h-4 w-4 text-slate-400" />
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}

export function MainLayout({ children }: { children: React.ReactNode }) {
    const { sidebarCollapsed } = useUIStore();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <Sidebar />
            <Header />
            <main
                className={cn(
                    'pt-14 min-h-screen transition-all duration-300',
                    sidebarCollapsed ? 'pl-16' : 'pl-60'
                )}
            >
                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
