'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, User, Building2, ArrowRight, Sparkles, Check } from 'lucide-react';
import { Button, Input, Card, CardContent } from '@/components/ui';

const registerSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Please enter a valid email'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain an uppercase letter')
        .regex(/[0-9]/, 'Password must contain a number'),
    organizationName: z.string().optional(),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [step, setStep] = useState(1);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const password = watch('password', '');

    const passwordChecks = [
        { label: 'At least 8 characters', valid: password.length >= 8 },
        { label: 'Contains uppercase letter', valid: /[A-Z]/.test(password) },
        { label: 'Contains a number', valid: /[0-9]/.test(password) },
    ];

    const onSubmit = async (data: RegisterFormData) => {
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Registration failed');
            }

            router.push('/login?registered=true');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-500 p-12 flex-col justify-between overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl animate-pulse" />
                    <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-white/10 to-transparent rounded-full blur-3xl animate-pulse delay-700" />
                    <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-white/5 rounded-full blur-2xl" />
                </div>

                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />

                {/* Content */}
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center shadow-2xl">
                            <Sparkles className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-white text-2xl font-bold tracking-tight">Octavertex</span>
                    </div>
                    <p className="text-white/60 text-sm">Media Platform</p>
                </div>

                <div className="relative z-10 space-y-6">
                    <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                        Start your<br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                            journey today
                        </span>
                    </h1>
                    <p className="text-white/70 text-lg max-w-md">
                        Join thousands of teams who use Octavertex to manage their projects, track time, and collaborate effectively.
                    </p>

                    {/* Features */}
                    <div className="space-y-4 pt-4">
                        {[
                            'Unlimited projects and tasks',
                            'Real-time team collaboration',
                            'Time tracking and attendance',
                            'Advanced reporting and analytics',
                        ].map((feature, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center">
                                    <Check className="h-4 w-4 text-white" />
                                </div>
                                <span className="text-white/80">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative z-10 text-white/40 text-sm">
                    © 2025 Octavertex Media. All rights reserved.
                </div>
            </div>

            {/* Right Panel - Register Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-950">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                            <Sparkles className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-slate-900 dark:text-white text-2xl font-bold">Octavertex</span>
                    </div>

                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Create your account</h2>
                        <p className="text-slate-500 dark:text-slate-400">Get started with a free account</p>
                    </div>

                    {/* Progress Steps */}
                    <div className="flex items-center justify-center gap-2 mb-6">
                        {[1, 2].map((s) => (
                            <div key={s} className="flex items-center gap-2">
                                <div
                                    className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${step >= s
                                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                                            : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                                        }`}
                                >
                                    {step > s ? <Check className="h-4 w-4" /> : s}
                                </div>
                                {s < 2 && (
                                    <div className={`w-12 h-1 rounded-full ${step > 1 ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`} />
                                )}
                            </div>
                        ))}
                    </div>

                    <Card className="shadow-xl shadow-slate-200/50 dark:shadow-none border-0">
                        <CardContent className="p-6">
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                {error && (
                                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                                    </div>
                                )}

                                {step === 1 && (
                                    <>
                                        <div className="grid grid-cols-2 gap-4">
                                            <Input
                                                {...register('firstName')}
                                                label="First Name"
                                                placeholder="John"
                                                error={errors.firstName?.message}
                                                icon={<User className="h-5 w-5" />}
                                            />
                                            <Input
                                                {...register('lastName')}
                                                label="Last Name"
                                                placeholder="Doe"
                                                error={errors.lastName?.message}
                                            />
                                        </div>

                                        <Input
                                            {...register('email')}
                                            type="email"
                                            label="Work Email"
                                            placeholder="you@company.com"
                                            error={errors.email?.message}
                                            icon={<Mail className="h-5 w-5" />}
                                        />

                                        <div className="relative">
                                            <Input
                                                {...register('password')}
                                                type={showPassword ? 'text' : 'password'}
                                                label="Password"
                                                placeholder="Create a strong password"
                                                error={errors.password?.message}
                                                icon={<Lock className="h-5 w-5" />}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-[38px] text-slate-400 hover:text-slate-600 transition-colors"
                                            >
                                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </button>
                                        </div>

                                        {/* Password Strength Indicator */}
                                        <div className="space-y-2">
                                            {passwordChecks.map((check, index) => (
                                                <div key={index} className="flex items-center gap-2">
                                                    <div
                                                        className={`h-4 w-4 rounded-full flex items-center justify-center ${check.valid ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'
                                                            }`}
                                                    >
                                                        {check.valid && <Check className="h-3 w-3 text-white" />}
                                                    </div>
                                                    <span className={`text-sm ${check.valid ? 'text-emerald-600' : 'text-slate-500'}`}>
                                                        {check.label}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        <Button
                                            type="button"
                                            onClick={() => setStep(2)}
                                            className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                                            disabled={!passwordChecks.every((c) => c.valid)}
                                        >
                                            Continue
                                            <ArrowRight className="h-4 w-4 ml-2" />
                                        </Button>
                                    </>
                                )}

                                {step === 2 && (
                                    <>
                                        <Input
                                            {...register('organizationName')}
                                            label="Organization Name (Optional)"
                                            placeholder="Your company name"
                                            icon={<Building2 className="h-5 w-5" />}
                                        />
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            Leave blank to join an existing organization later, or enter a name to create a new workspace.
                                        </p>

                                        <div className="flex gap-3">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => setStep(1)}
                                                className="flex-1 h-12"
                                            >
                                                Back
                                            </Button>
                                            <Button
                                                type="submit"
                                                className="flex-1 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                                                isLoading={isLoading}
                                            >
                                                Create Account
                                                <ArrowRight className="h-4 w-4 ml-2" />
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </form>
                        </CardContent>
                    </Card>

                    <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                        Already have an account?{' '}
                        <Link href="/login" className="text-emerald-600 hover:text-emerald-700 font-semibold">
                            Sign in
                        </Link>
                    </p>

                    <p className="mt-4 text-center text-xs text-slate-400">
                        By creating an account, you agree to our{' '}
                        <Link href="/terms" className="underline hover:text-slate-600">Terms of Service</Link>
                        {' '}and{' '}
                        <Link href="/privacy" className="underline hover:text-slate-600">Privacy Policy</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
