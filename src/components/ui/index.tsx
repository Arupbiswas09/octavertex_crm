'use client';

import * as React from 'react';
import { cn } from '@/utils/helpers';

// ============================================
// Button Component
// ============================================

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, disabled, children, ...props }, ref) => {
        const variants = {
            primary: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/25',
            secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700',
            outline: 'border-2 border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800',
            ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100',
            danger: 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-500/25',
            success: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-500/25',
        };

        const sizes = {
            sm: 'h-8 px-3 text-sm gap-1.5',
            md: 'h-10 px-4 text-sm gap-2',
            lg: 'h-12 px-6 text-base gap-2',
            icon: 'h-10 w-10',
        };

        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={cn(
                    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed',
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            >
                {isLoading && (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                )}
                {children}
            </button>
        );
    }
);
Button.displayName = 'Button';

// ============================================
// Input Component
// ============================================

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, icon, type, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            {icon}
                        </div>
                    )}
                    <input
                        type={type}
                        ref={ref}
                        className={cn(
                            'w-full h-11 px-4 text-slate-900 bg-white border border-slate-200 rounded-xl transition-all duration-200',
                            'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
                            'placeholder:text-slate-400 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed',
                            'dark:bg-slate-900 dark:border-slate-700 dark:text-white dark:placeholder:text-slate-500',
                            icon && 'pl-10',
                            error && 'border-red-500 focus:ring-red-500',
                            className
                        )}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="mt-1.5 text-sm text-red-500">{error}</p>
                )}
            </div>
        );
    }
);
Input.displayName = 'Input';

// ============================================
// Textarea Component
// ============================================

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    className={cn(
                        'w-full min-h-[100px] px-4 py-3 text-slate-900 bg-white border border-slate-200 rounded-xl transition-all duration-200',
                        'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none',
                        'placeholder:text-slate-400 disabled:bg-slate-50 disabled:text-slate-500',
                        'dark:bg-slate-900 dark:border-slate-700 dark:text-white',
                        error && 'border-red-500 focus:ring-red-500',
                        className
                    )}
                    {...props}
                />
                {error && (
                    <p className="mt-1.5 text-sm text-red-500">{error}</p>
                )}
            </div>
        );
    }
);
Textarea.displayName = 'Textarea';

// ============================================
// Select Component
// ============================================

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, label, error, options, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        {label}
                    </label>
                )}
                <select
                    ref={ref}
                    className={cn(
                        'w-full h-11 px-4 text-slate-900 bg-white border border-slate-200 rounded-xl transition-all duration-200',
                        'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none cursor-pointer',
                        'disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed',
                        'dark:bg-slate-900 dark:border-slate-700 dark:text-white',
                        'bg-[url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3e%3cpath stroke=%27%236b7280%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27M6 8l4 4 4-4%27/%3e%3c/svg%3e")] bg-[length:1.5rem_1.5rem] bg-[right_0.5rem_center] bg-no-repeat pr-10',
                        error && 'border-red-500 focus:ring-red-500',
                        className
                    )}
                    {...props}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {error && (
                    <p className="mt-1.5 text-sm text-red-500">{error}</p>
                )}
            </div>
        );
    }
);
Select.displayName = 'Select';

// ============================================
// Checkbox Component
// ============================================

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className, label, ...props }, ref) => {
        return (
            <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                    type="checkbox"
                    ref={ref}
                    className={cn(
                        'h-5 w-5 rounded border-slate-300 text-indigo-600 transition-colors',
                        'focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
                        'dark:border-slate-600 dark:bg-slate-800',
                        className
                    )}
                    {...props}
                />
                {label && (
                    <span className="text-sm text-slate-700 dark:text-slate-300">{label}</span>
                )}
            </label>
        );
    }
);
Checkbox.displayName = 'Checkbox';

// ============================================
// Badge Component
// ============================================

export interface BadgeProps {
    children: React.ReactNode;
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
    size?: 'sm' | 'md';
    className?: string;
}

export function Badge({ children, variant = 'default', size = 'md', className }: BadgeProps) {
    const variants = {
        default: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
        success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
        warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        danger: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    };

    const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm',
    };

    return (
        <span
            className={cn(
                'inline-flex items-center font-medium rounded-full',
                variants[variant],
                sizes[size],
                className
            )}
        >
            {children}
        </span>
    );
}

// ============================================
// Card Component
// ============================================

export interface CardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
    gradient?: boolean;
}

export function Card({ children, className, hover, gradient }: CardProps) {
    return (
        <div
            className={cn(
                'bg-white rounded-2xl border border-slate-200 shadow-sm',
                'dark:bg-slate-900 dark:border-slate-800',
                hover && 'transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer',
                gradient && 'bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800',
                className
            )}
        >
            {children}
        </div>
    );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={cn('px-6 py-4 border-b border-slate-100 dark:border-slate-800', className)}>
            {children}
        </div>
    );
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={cn('px-6 py-4', className)}>
            {children}
        </div>
    );
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={cn('px-6 py-4 border-t border-slate-100 dark:border-slate-800', className)}>
            {children}
        </div>
    );
}

// ============================================
// Avatar Component
// ============================================

export interface AvatarProps {
    src?: string | null;
    alt?: string;
    fallback: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    status?: 'online' | 'offline' | 'busy' | 'away';
}

export function Avatar({ src, alt, fallback, size = 'md', className, status }: AvatarProps) {
    const sizes = {
        xs: 'h-6 w-6 text-xs',
        sm: 'h-8 w-8 text-sm',
        md: 'h-10 w-10 text-base',
        lg: 'h-12 w-12 text-lg',
        xl: 'h-16 w-16 text-xl',
    };

    const statusColors = {
        online: 'bg-emerald-500',
        offline: 'bg-slate-400',
        busy: 'bg-red-500',
        away: 'bg-amber-500',
    };

    const statusSizes = {
        xs: 'h-1.5 w-1.5',
        sm: 'h-2 w-2',
        md: 'h-2.5 w-2.5',
        lg: 'h-3 w-3',
        xl: 'h-3.5 w-3.5',
    };

    return (
        <div className={cn('relative inline-flex shrink-0', className)}>
            {src ? (
                <img
                    src={src}
                    alt={alt || fallback}
                    className={cn(
                        'rounded-full object-cover ring-2 ring-white dark:ring-slate-900',
                        sizes[size]
                    )}
                />
            ) : (
                <div
                    className={cn(
                        'rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold ring-2 ring-white dark:ring-slate-900',
                        sizes[size]
                    )}
                >
                    {fallback}
                </div>
            )}
            {status && (
                <span
                    className={cn(
                        'absolute bottom-0 right-0 rounded-full border-2 border-white dark:border-slate-900',
                        statusColors[status],
                        statusSizes[size]
                    )}
                />
            )}
        </div>
    );
}

// ============================================
// Avatar Group Component
// ============================================

export interface AvatarGroupProps {
    avatars: { src?: string | null; fallback: string }[];
    max?: number;
    size?: AvatarProps['size'];
    className?: string;
}

export function AvatarGroup({ avatars, max = 4, size = 'md', className }: AvatarGroupProps) {
    const displayed = avatars.slice(0, max);
    const remaining = avatars.length - max;

    return (
        <div className={cn('flex -space-x-2', className)}>
            {displayed.map((avatar, index) => (
                <Avatar
                    key={index}
                    src={avatar.src}
                    fallback={avatar.fallback}
                    size={size}
                />
            ))}
            {remaining > 0 && (
                <div
                    className={cn(
                        'rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-medium ring-2 ring-white dark:ring-slate-900',
                        size === 'xs' && 'h-6 w-6 text-xs',
                        size === 'sm' && 'h-8 w-8 text-xs',
                        size === 'md' && 'h-10 w-10 text-sm',
                        size === 'lg' && 'h-12 w-12 text-sm',
                        size === 'xl' && 'h-16 w-16 text-base'
                    )}
                >
                    +{remaining}
                </div>
            )}
        </div>
    );
}

// ============================================
// Progress Component
// ============================================

export interface ProgressProps {
    value: number;
    max?: number;
    size?: 'sm' | 'md' | 'lg';
    color?: 'default' | 'success' | 'warning' | 'danger';
    showLabel?: boolean;
    className?: string;
}

export function Progress({ value, max = 100, size = 'md', color = 'default', showLabel, className }: ProgressProps) {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const sizes = {
        sm: 'h-1',
        md: 'h-2',
        lg: 'h-3',
    };

    const colors = {
        default: 'bg-gradient-to-r from-indigo-500 to-purple-500',
        success: 'bg-gradient-to-r from-emerald-500 to-teal-500',
        warning: 'bg-gradient-to-r from-amber-500 to-orange-500',
        danger: 'bg-gradient-to-r from-red-500 to-rose-500',
    };

    return (
        <div className={className}>
            {showLabel && (
                <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600 dark:text-slate-400">Progress</span>
                    <span className="font-medium text-slate-900 dark:text-white">{Math.round(percentage)}%</span>
                </div>
            )}
            <div className={cn('w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden', sizes[size])}>
                <div
                    className={cn('h-full rounded-full transition-all duration-500', colors[color])}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}

// ============================================
// Skeleton Component
// ============================================

export interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular';
    width?: string | number;
    height?: string | number;
}

export function Skeleton({ className, variant = 'text', width, height }: SkeletonProps) {
    return (
        <div
            className={cn(
                'animate-pulse bg-slate-200 dark:bg-slate-700',
                variant === 'circular' && 'rounded-full',
                variant === 'rectangular' && 'rounded-lg',
                variant === 'text' && 'rounded h-4',
                className
            )}
            style={{ width, height }}
        />
    );
}

// ============================================
// Spinner Component
// ============================================

export interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
    const sizes = {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
    };

    return (
        <svg
            className={cn('animate-spin text-indigo-600', sizes[size], className)}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
        </svg>
    );
}

// ============================================
// Divider Component
// ============================================

export interface DividerProps {
    className?: string;
    children?: React.ReactNode;
}

export function Divider({ className, children }: DividerProps) {
    if (children) {
        return (
            <div className={cn('flex items-center gap-4', className)}>
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                <span className="text-sm text-slate-500">{children}</span>
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
            </div>
        );
    }

    return (
        <div className={cn('h-px bg-slate-200 dark:bg-slate-700', className)} />
    );
}

// ============================================
// Empty State Component
// ============================================

export interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: React.ReactNode;
    className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
    return (
        <div className={cn('flex flex-col items-center justify-center py-12 px-4', className)}>
            {icon && (
                <div className="mb-4 p-4 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400">
                    {icon}
                </div>
            )}
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">{title}</h3>
            {description && (
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-sm mb-4">
                    {description}
                </p>
            )}
            {action}
        </div>
    );
}
