'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: LucideIcon;
    iconColor?: string;
    iconBg?: string;
    trend?: {
        value: number;
        positive: boolean;
    };
}

export default function MetricCard({
    title,
    value,
    subtitle,
    icon: Icon,
    iconColor = 'text-blue-600',
    iconBg = 'bg-blue-50',
}: MetricCardProps) {
    return (
        <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <p className="text-3xl font-bold tracking-tight">{value}</p>
                        {subtitle && (
                            <p className="text-xs text-muted-foreground">{subtitle}</p>
                        )}
                    </div>
                    <div
                        className={cn(
                            'flex h-12 w-12 items-center justify-center rounded-xl',
                            iconBg
                        )}
                    >
                        <Icon className={cn('h-6 w-6', iconColor)} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
