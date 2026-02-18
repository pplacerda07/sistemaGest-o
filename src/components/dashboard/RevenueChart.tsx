'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';
import { mockRevenueData } from '@/lib/mock-data';
import { formatCurrency } from '@/lib/utils';

// Custom tooltip para o gráfico
function CustomTooltip({ active, payload, label }: {
    active?: boolean;
    payload?: Array<{ value: number; name: string; color: string }>;
    label?: string;
}) {
    if (!active || !payload) return null;

    return (
        <div className="rounded-lg border bg-card p-3 shadow-lg">
            <p className="text-sm font-medium mb-2">{label}</p>
            {payload.map((entry, index) => (
                <p key={index} className="text-sm" style={{ color: entry.color }}>
                    {entry.name}: {formatCurrency(entry.value)}
                </p>
            ))}
        </div>
    );
}

export default function RevenueChart() {
    return (
        <Card className="border-border/50 shadow-sm">
            <CardHeader>
                <CardTitle className="text-lg font-semibold">
                    Receita vs Custos
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                    Últimos 6 meses
                </p>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={mockRevenueData}
                            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                            <XAxis
                                dataKey="month"
                                tick={{ fontSize: 12 }}
                                className="text-muted-foreground"
                            />
                            <YAxis
                                tick={{ fontSize: 12 }}
                                tickFormatter={(value) => `R$${(value / 1000).toFixed(0)}k`}
                                className="text-muted-foreground"
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend
                                wrapperStyle={{ fontSize: '13px', paddingTop: '10px' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="receita"
                                stroke="#10B981"
                                strokeWidth={2.5}
                                dot={{ r: 4, fill: '#10B981' }}
                                activeDot={{ r: 6 }}
                                name="Receita"
                            />
                            <Line
                                type="monotone"
                                dataKey="custos"
                                stroke="#EF4444"
                                strokeWidth={2.5}
                                dot={{ r: 4, fill: '#EF4444' }}
                                activeDot={{ r: 6 }}
                                name="Custos"
                            />
                            <Line
                                type="monotone"
                                dataKey="lucro"
                                stroke="#3B82F6"
                                strokeWidth={2.5}
                                dot={{ r: 4, fill: '#3B82F6' }}
                                activeDot={{ r: 6 }}
                                name="Lucro"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
