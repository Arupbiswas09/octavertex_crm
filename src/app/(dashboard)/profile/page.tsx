'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Camera,
    Shield,
    Clock,
    TrendingUp,
    Award,
    Edit2,
    Save,
} from 'lucide-react';
import { Card, CardContent, CardHeader, Button, Input, Textarea, Avatar, Badge, Progress } from '@/components/ui';
import { cn, formatDate } from '@/utils/helpers';

// Mock data
const userStats = [
    { label: 'Tasks Completed', value: 142, icon: TrendingUp, color: 'text-emerald-500' },
    { label: 'Hours This Month', value: '168h', icon: Clock, color: 'text-blue-500' },
    { label: 'Projects Active', value: 4, icon: Award, color: 'text-purple-500' },
];

const skills = ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Node.js', 'PostgreSQL'];

const workHistory = [
    { title: 'Senior Frontend Developer', department: 'Engineering', period: '2024 - Present' },
    { title: 'Frontend Developer', department: 'Engineering', period: '2023 - 2024' },
    { title: 'Junior Developer', department: 'Engineering', period: '2022 - 2023' },
];

export default function ProfilePage() {
    const { data: session } = useSession();
    const user = session?.user;
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: user?.firstName || 'John',
        lastName: user?.lastName || 'Doe',
        email: user?.email || 'john.doe@octavertex.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        bio: 'Passionate frontend developer with 5+ years of experience building modern web applications. Love working with React and TypeScript to create beautiful, performant user interfaces.',
        title: 'Senior Frontend Developer',
        department: 'Engineering',
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Profile</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage your personal information</p>
                </div>
                <Button
                    onClick={() => setIsEditing(!isEditing)}
                    variant={isEditing ? 'primary' : 'outline'}
                >
                    {isEditing ? (
                        <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                        </>
                    ) : (
                        <>
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit Profile
                        </>
                    )}
                </Button>
            </div>

            {/* Profile Header Card */}
            <Card className="relative overflow-hidden">
                {/* Banner */}
                <div className="h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

                <CardContent className="relative px-6 pb-6">
                    {/* Avatar */}
                    <div className="absolute -top-16 left-6">
                        <div className="relative">
                            <Avatar
                                src={user?.avatar || null}
                                fallback={`${formData.firstName[0]}${formData.lastName[0]}`}
                                size="2xl"
                                className="ring-4 ring-white dark:ring-slate-900"
                            />
                            {isEditing && (
                                <button className="absolute bottom-0 right-0 p-2 bg-indigo-500 rounded-full text-white hover:bg-indigo-600 transition-colors">
                                    <Camera className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="ml-36 pt-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                    {formData.firstName} {formData.lastName}
                                </h2>
                                <p className="text-slate-500">{formData.title}</p>
                                <div className="flex items-center gap-3 mt-2">
                                    <Badge variant="info" size="sm">
                                        <Shield className="h-3 w-3 mr-1" />
                                        {user?.role || 'EMPLOYEE'}
                                    </Badge>
                                    <span className="text-sm text-slate-500">{formData.department}</span>
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-6 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                            {userStats.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <stat.icon className={cn('h-6 w-6 mx-auto mb-2', stat.color)} />
                                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                                    <p className="text-sm text-slate-500">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Personal Information */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Personal Information</h2>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="First Name"
                                value={formData.firstName}
                                onChange={(e) => handleInputChange('firstName', e.target.value)}
                                disabled={!isEditing}
                            />
                            <Input
                                label="Last Name"
                                value={formData.lastName}
                                onChange={(e) => handleInputChange('lastName', e.target.value)}
                                disabled={!isEditing}
                            />
                        </div>
                        <Input
                            label="Email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            disabled
                            icon={<Mail className="h-5 w-5" />}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Phone"
                                value={formData.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                disabled={!isEditing}
                                icon={<Phone className="h-5 w-5" />}
                            />
                            <Input
                                label="Location"
                                value={formData.location}
                                onChange={(e) => handleInputChange('location', e.target.value)}
                                disabled={!isEditing}
                                icon={<MapPin className="h-5 w-5" />}
                            />
                        </div>
                        <Textarea
                            label="Bio"
                            value={formData.bio}
                            onChange={(e) => handleInputChange('bio', e.target.value)}
                            disabled={!isEditing}
                            rows={4}
                        />
                    </CardContent>
                </Card>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Skills */}
                    <Card>
                        <CardHeader>
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Skills</h2>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1.5 text-sm bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-full"
                                    >
                                        {skill}
                                    </span>
                                ))}
                                {isEditing && (
                                    <button className="px-3 py-1.5 text-sm border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-500 rounded-full hover:border-indigo-500 hover:text-indigo-500 transition-colors">
                                        + Add Skill
                                    </button>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Work History */}
                    <Card>
                        <CardHeader>
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Work History</h2>
                        </CardHeader>
                        <CardContent>
                            <div className="relative">
                                <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-slate-200 dark:bg-slate-700" />
                                <div className="space-y-4">
                                    {workHistory.map((history, index) => (
                                        <div key={index} className="relative flex gap-4">
                                            <div className={cn(
                                                'h-6 w-6 rounded-full border-2 bg-white dark:bg-slate-900 z-10',
                                                index === 0 ? 'border-indigo-500' : 'border-slate-300 dark:border-slate-600'
                                            )} />
                                            <div>
                                                <p className="font-medium text-slate-900 dark:text-white">{history.title}</p>
                                                <p className="text-sm text-slate-500">{history.department}</p>
                                                <p className="text-xs text-slate-400 mt-1">{history.period}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Join Date */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                                    <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Member Since</p>
                                    <p className="font-semibold text-slate-900 dark:text-white">
                                        {formatDate('2022-03-15', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
