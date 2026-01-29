'use client';

import { useState } from 'react';
import {
    User,
    Bell,
    Shield,
    Palette,
    Globe,
    Key,
    Smartphone,
    Mail,
    Clock,
    Moon,
    Sun,
    Monitor,
    ChevronRight,
    Check,
} from 'lucide-react';
import { Card, CardContent, CardHeader, Button, Input, Select, Badge } from '@/components/ui';
import { cn } from '@/utils/helpers';
import { useUIStore } from '@/stores';

const settingsSections = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'language', label: 'Language & Region', icon: Globe },
];

const notificationSettings = [
    { id: 'email_tasks', label: 'Task assignments', description: 'Get notified when you are assigned a task', enabled: true },
    { id: 'email_mentions', label: 'Mentions', description: 'Get notified when someone mentions you', enabled: true },
    { id: 'email_projects', label: 'Project updates', description: 'Get notified about project changes', enabled: false },
    { id: 'email_leaves', label: 'Leave updates', description: 'Get notified about leave request status', enabled: true },
    { id: 'email_digest', label: 'Daily digest', description: 'Receive a daily summary of activities', enabled: false },
];

const pushNotifications = [
    { id: 'push_messages', label: 'New messages', enabled: true },
    { id: 'push_tasks', label: 'Task reminders', enabled: true },
    { id: 'push_attendance', label: 'Attendance alerts', enabled: true },
    { id: 'push_approvals', label: 'Approval requests', enabled: true },
];

const themes = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'system', label: 'System', icon: Monitor },
];

export default function SettingsPage() {
    const [activeSection, setActiveSection] = useState('account');
    const { theme, setTheme } = useUIStore();
    const [notifications, setNotifications] = useState(notificationSettings);
    const [pushSettings, setPushSettings] = useState(pushNotifications);

    const toggleNotification = (id: string) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, enabled: !n.enabled } : n)
        );
    };

    const togglePushSetting = (id: string) => {
        setPushSettings(prev =>
            prev.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p)
        );
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
                <p className="text-slate-500 dark:text-slate-400">Manage your account preferences</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar Navigation */}
                <div className="lg:w-64 shrink-0">
                    <Card>
                        <CardContent className="p-2">
                            <nav className="space-y-1">
                                {settingsSections.map((section) => (
                                    <button
                                        key={section.id}
                                        onClick={() => setActiveSection(section.id)}
                                        className={cn(
                                            'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors',
                                            activeSection === section.id
                                                ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400'
                                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                        )}
                                    >
                                        <section.icon className="h-5 w-5" />
                                        <span className="font-medium">{section.label}</span>
                                    </button>
                                ))}
                            </nav>
                        </CardContent>
                    </Card>
                </div>

                {/* Settings Content */}
                <div className="flex-1 space-y-6">
                    {/* Account Settings */}
                    {activeSection === 'account' && (
                        <Card>
                            <CardHeader>
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Account Settings</h2>
                                <p className="text-sm text-slate-500">Manage your account details and preferences</p>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="First Name" defaultValue="John" />
                                    <Input label="Last Name" defaultValue="Doe" />
                                </div>
                                <Input label="Email" type="email" defaultValue="john.doe@octavertex.com" disabled />
                                <Input label="Phone" type="tel" defaultValue="+1 (555) 123-4567" />
                                <div className="flex justify-end pt-4">
                                    <Button>Save Changes</Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Notification Settings */}
                    {activeSection === 'notifications' && (
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Email Notifications</h2>
                                    <p className="text-sm text-slate-500">Configure what emails you receive</p>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {notifications.map((setting) => (
                                            <div key={setting.id} className="flex items-center justify-between py-3">
                                                <div>
                                                    <p className="font-medium text-slate-900 dark:text-white">{setting.label}</p>
                                                    <p className="text-sm text-slate-500">{setting.description}</p>
                                                </div>
                                                <button
                                                    onClick={() => toggleNotification(setting.id)}
                                                    className={cn(
                                                        'relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors',
                                                        setting.enabled ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-700'
                                                    )}
                                                >
                                                    <span
                                                        className={cn(
                                                            'inline-block h-5 w-5 rounded-full bg-white shadow-lg transition-transform',
                                                            setting.enabled ? 'translate-x-5 mt-0.5' : 'translate-x-0.5 mt-0.5'
                                                        )}
                                                    />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Push Notifications</h2>
                                    <p className="text-sm text-slate-500">Manage your in-app notifications</p>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-4">
                                        {pushSettings.map((setting) => (
                                            <div
                                                key={setting.id}
                                                className={cn(
                                                    'p-4 rounded-xl border-2 cursor-pointer transition-all',
                                                    setting.enabled
                                                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                                                        : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                                                )}
                                                onClick={() => togglePushSetting(setting.id)}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="font-medium text-slate-900 dark:text-white">{setting.label}</span>
                                                    {setting.enabled && <Check className="h-5 w-5 text-indigo-500" />}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Appearance Settings */}
                    {activeSection === 'appearance' && (
                        <Card>
                            <CardHeader>
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Appearance</h2>
                                <p className="text-sm text-slate-500">Customize how the app looks</p>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 block">
                                        Theme
                                    </label>
                                    <div className="grid grid-cols-3 gap-4">
                                        {themes.map((t) => (
                                            <button
                                                key={t.id}
                                                onClick={() => setTheme(t.id as 'light' | 'dark' | 'system')}
                                                className={cn(
                                                    'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                                                    theme === t.id
                                                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                                                        : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                                                )}
                                            >
                                                <t.icon className={cn(
                                                    'h-6 w-6',
                                                    theme === t.id ? 'text-indigo-600' : 'text-slate-500'
                                                )} />
                                                <span className={cn(
                                                    'font-medium',
                                                    theme === t.id ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'
                                                )}>
                                                    {t.label}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 block">
                                        Sidebar
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" className="rounded border-slate-300" defaultChecked />
                                            <span className="text-sm text-slate-700 dark:text-slate-300">Collapsed by default</span>
                                        </label>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Security Settings */}
                    {activeSection === 'security' && (
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Change Password</h2>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <Input label="Current Password" type="password" />
                                    <Input label="New Password" type="password" />
                                    <Input label="Confirm New Password" type="password" />
                                    <div className="flex justify-end pt-4">
                                        <Button>Update Password</Button>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Two-Factor Authentication</h2>
                                    <p className="text-sm text-slate-500">Add an extra layer of security to your account</p>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                                                <Smartphone className="h-5 w-5 text-amber-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900 dark:text-white">Authenticator App</p>
                                                <p className="text-sm text-slate-500">Use an app like Google Authenticator</p>
                                            </div>
                                        </div>
                                        <Button variant="outline">Enable</Button>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Active Sessions</h2>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <Monitor className="h-5 w-5 text-slate-500" />
                                                <div>
                                                    <p className="font-medium text-slate-900 dark:text-white">MacBook Pro - Chrome</p>
                                                    <p className="text-sm text-slate-500">San Francisco, US • Current session</p>
                                                </div>
                                            </div>
                                            <Badge variant="success">Active</Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Language & Region */}
                    {activeSection === 'language' && (
                        <Card>
                            <CardHeader>
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Language & Region</h2>
                                <p className="text-sm text-slate-500">Set your preferred language and timezone</p>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <Select
                                    label="Language"
                                    options={[
                                        { value: 'en', label: 'English (US)' },
                                        { value: 'en-gb', label: 'English (UK)' },
                                        { value: 'es', label: 'Español' },
                                        { value: 'fr', label: 'Français' },
                                        { value: 'de', label: 'Deutsch' },
                                    ]}
                                    defaultValue="en"
                                />
                                <Select
                                    label="Timezone"
                                    options={[
                                        { value: 'pst', label: 'Pacific Time (PT)' },
                                        { value: 'mst', label: 'Mountain Time (MT)' },
                                        { value: 'cst', label: 'Central Time (CT)' },
                                        { value: 'est', label: 'Eastern Time (ET)' },
                                        { value: 'utc', label: 'UTC' },
                                    ]}
                                    defaultValue="pst"
                                />
                                <Select
                                    label="Date Format"
                                    options={[
                                        { value: 'mdy', label: 'MM/DD/YYYY' },
                                        { value: 'dmy', label: 'DD/MM/YYYY' },
                                        { value: 'ymd', label: 'YYYY-MM-DD' },
                                    ]}
                                    defaultValue="mdy"
                                />
                                <div className="flex justify-end pt-4">
                                    <Button>Save Preferences</Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
