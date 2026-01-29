'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { MainLayout } from '@/components/layout';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { status } = useSession({
        required: true,
        onUnauthenticated() {
            redirect('/login');
        },
    });

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center animate-pulse">
                        <span className="text-white font-bold text-xl">O</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce" />
                        <div className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce delay-100" />
                        <div className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce delay-200" />
                    </div>
                </div>
            </div>
        );
    }

    return <MainLayout>{children}</MainLayout>;
}
