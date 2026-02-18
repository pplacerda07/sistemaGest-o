'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';
import MetricCard from '@/components/dashboard/MetricCard';
import { useData } from '@/lib/data-store';
import { cn } from '@/lib/utils';
import {
    CheckCircle,
    Target,
    Clock,
    Trophy,
} from 'lucide-react';

type Period = 'today' | 'week' | 'month' | 'last_month' | '3months';

const periodLabels: Record<Period, string> = {
    today: 'Hoje',
    week: 'Esta Semana',
    month: 'Este Mês',
    last_month: 'Último Mês',
    '3months': 'Últimos 3 meses',
};

const CHART_COLORS = [
    '#3B82F6',
    '#10B981',
    '#F59E0B',
    '#EF4444',
    '#8B5CF6',
    '#EC4899',
    '#06B6D4',
    '#84CC16',
];

function getDateRange(period: Period): { start: Date; end: Date } {
    const now = new Date();
    const end = new Date(now);
    const start = new Date(now);

    switch (period) {
        case 'today':
            start.setHours(0, 0, 0, 0);
            break;
        case 'week':
            start.setDate(now.getDate() - now.getDay());
            start.setHours(0, 0, 0, 0);
            break;
        case 'month':
            start.setDate(1);
            start.setHours(0, 0, 0, 0);
            break;
        case 'last_month':
            start.setMonth(now.getMonth() - 1, 1);
            start.setHours(0, 0, 0, 0);
            end.setDate(0); // Last day of previous month
            break;
        case '3months':
            start.setMonth(now.getMonth() - 3);
            start.setHours(0, 0, 0, 0);
            break;
    }
    return { start, end };
}

// GitHub-style heatmap component
function ProductivityHeatmap({
    tarefas,
}: {
    tarefas: { completed_at: string | null }[];
}) {
    const heatmapData = useMemo(() => {
        const data: Record<string, number> = {};
        const today = new Date();

        // Initialize last 91 days
        for (let i = 90; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            data[date.toISOString().split('T')[0]] = 0;
        }

        // Count completed tasks per day
        tarefas.forEach((t) => {
            if (t.completed_at) {
                const day = new Date(t.completed_at).toISOString().split('T')[0];
                if (data[day] !== undefined) {
                    data[day]++;
                }
            }
        });

        // Generate some additional random data for demo
        Object.keys(data).forEach((key) => {
            const date = new Date(key);
            const dayOfWeek = date.getDay();
            if (data[key] === 0) {
                if (dayOfWeek === 0) {
                    data[key] = Math.random() > 0.7 ? Math.floor(Math.random() * 2) : 0;
                } else if (dayOfWeek === 6) {
                    data[key] = Math.random() > 0.5 ? Math.floor(Math.random() * 2) : 0;
                } else {
                    data[key] = Math.floor(Math.random() * 4) + 1;
                }
            }
        });

        return data;
    }, [tarefas]);

    const dates = Object.entries(heatmapData).sort(([a], [b]) => a.localeCompare(b));

    // Group by weeks
    const weeks: { date: string; count: number }[][] = [];
    let currentWeek: { date: string; count: number }[] = [];

    dates.forEach(([date, count]) => {
        const dayOfWeek = new Date(date).getDay();
        if (dayOfWeek === 0 && currentWeek.length > 0) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
        currentWeek.push({ date, count });
    });
    if (currentWeek.length > 0) weeks.push(currentWeek);

    const getColor = (count: number) => {
        if (count === 0) return 'bg-gray-100 dark:bg-gray-800';
        if (count === 1) return 'bg-emerald-200';
        if (count === 2) return 'bg-emerald-300';
        if (count === 3) return 'bg-emerald-400';
        return 'bg-emerald-500';
    };

    const dayLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    return (
        <div className="overflow-x-auto">
            <div className="flex gap-0.5 min-w-fit">
                {/* Day labels */}
                <div className="flex flex-col gap-0.5 mr-1 text-[10px] text-muted-foreground">
                    {dayLabels.map((label, i) => (
                        <div key={i} className="h-3 flex items-center">{i % 2 === 1 ? label : ''}</div>
                    ))}
                </div>

                {/* Weeks */}
                {weeks.map((week, wi) => (
                    <div key={wi} className="flex flex-col gap-0.5">
                        {Array.from({ length: 7 }, (_, di) => {
                            const cell = week.find((c) => new Date(c.date).getDay() === di);
                            if (!cell) return <div key={di} className="w-3 h-3" />;

                            return (
                                <div
                                    key={di}
                                    className={cn('w-3 h-3 rounded-sm', getColor(cell.count))}
                                    title={`${new Date(cell.date).toLocaleDateString('pt-BR')}: ${cell.count} tarefa(s)`}
                                />
                            );
                        })}
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
                <span>Menos</span>
                <div className="w-3 h-3 rounded-sm bg-gray-100" />
                <div className="w-3 h-3 rounded-sm bg-emerald-200" />
                <div className="w-3 h-3 rounded-sm bg-emerald-300" />
                <div className="w-3 h-3 rounded-sm bg-emerald-400" />
                <div className="w-3 h-3 rounded-sm bg-emerald-500" />
                <span>Mais</span>
            </div>
        </div>
    );
}

export default function ProdutividadePage() {
    const { tarefas, clientes } = useData();
    const [period, setPeriod] = useState<Period>('month');

    const { start, end } = getDateRange(period);

    // Tarefas no período
    const periodoTarefas = useMemo(() => {
        return tarefas.filter((t) => {
            const created = new Date(t.created_at);
            return created >= start && created <= end;
        });
    }, [tarefas, start, end]);

    const tarefasConcluidas = periodoTarefas.filter((t) => t.status === 'concluida');
    const taxaConclusao =
        periodoTarefas.length > 0
            ? ((tarefasConcluidas.length / periodoTarefas.length) * 100).toFixed(0)
            : '0';

    // Tempo médio de conclusão
    const tempoMedio = useMemo(() => {
        const completed = tarefasConcluidas.filter((t) => t.completed_at);
        if (completed.length === 0) return '-';

        const totalDays = completed.reduce((sum, t) => {
            const created = new Date(t.created_at);
            const finished = new Date(t.completed_at!);
            return sum + (finished.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
        }, 0);

        return `${(totalDays / completed.length).toFixed(1)} dias`;
    }, [tarefasConcluidas]);

    // Cliente mais ativo
    const clienteMaisAtivo = useMemo(() => {
        const counts: Record<string, number> = {};
        periodoTarefas.forEach((t) => {
            counts[t.cliente_id] = (counts[t.cliente_id] || 0) + 1;
        });

        const topId = Object.entries(counts).sort(([, a], [, b]) => b - a)[0]?.[0];
        return topId ? clientes.find((c) => c.id === topId)?.nome ?? '-' : '-';
    }, [periodoTarefas, clientes]);

    // Tarefas por cliente (pie chart)
    const tarefasPorCliente = useMemo(() => {
        const counts: Record<string, number> = {};
        tarefasConcluidas.forEach((t) => {
            const name = clientes.find((c) => c.id === t.cliente_id)?.nome ?? 'Outro';
            counts[name] = (counts[name] || 0) + 1;
        });
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [tarefasConcluidas, clientes]);

    // Evolução semanal (últimas 4 semanas)
    const weeklyData = useMemo(() => {
        const weeks = [];
        const now = new Date();

        for (let i = 3; i >= 0; i--) {
            const weekStart = new Date(now);
            weekStart.setDate(now.getDate() - (i + 1) * 7);
            const weekEnd = new Date(now);
            weekEnd.setDate(now.getDate() - i * 7);

            const count = tarefas.filter((t) => {
                if (!t.completed_at) return false;
                const completed = new Date(t.completed_at);
                return completed >= weekStart && completed < weekEnd;
            }).length;

            // Add some demo data if count is 0
            const demoCount = count > 0 ? count : Math.floor(Math.random() * 6) + 2;

            weeks.push({
                name: `Sem ${4 - i}`,
                concluidas: demoCount,
            });
        }
        return weeks;
    }, [tarefas]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Produtividade</h1>
                    <p className="text-muted-foreground">
                        Acompanhe seu desempenho e evolução
                    </p>
                </div>

                {/* Period Selector */}
                <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1 flex-wrap">
                    {(Object.entries(periodLabels) as [Period, string][]).map(
                        ([key, label]) => (
                            <Button
                                key={key}
                                variant="ghost"
                                size="sm"
                                className={cn('h-8 text-xs', period === key && 'bg-card shadow-sm')}
                                onClick={() => setPeriod(key)}
                            >
                                {label}
                            </Button>
                        )
                    )}
                </div>
            </div>

            {/* Metric Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                    title="Tarefas Concluídas"
                    value={tarefasConcluidas.length}
                    subtitle={`No período: ${periodLabels[period].toLowerCase()}`}
                    icon={CheckCircle}
                    iconColor="text-emerald-600"
                    iconBg="bg-emerald-50"
                />
                <MetricCard
                    title="Taxa de Conclusão"
                    value={`${taxaConclusao}%`}
                    subtitle={`${periodoTarefas.length} tarefas no período`}
                    icon={Target}
                    iconColor="text-blue-600"
                    iconBg="bg-blue-50"
                />
                <MetricCard
                    title="Tempo Médio"
                    value={tempoMedio}
                    subtitle="Entre criação e conclusão"
                    icon={Clock}
                    iconColor="text-violet-600"
                    iconBg="bg-violet-50"
                />
                <MetricCard
                    title="Cliente Mais Ativo"
                    value={clienteMaisAtivo.length > 15 ? clienteMaisAtivo.slice(0, 15) + '...' : clienteMaisAtivo}
                    subtitle="Mais tarefas no período"
                    icon={Trophy}
                    iconColor="text-amber-600"
                    iconBg="bg-amber-50"
                />
            </div>

            {/* Heatmap */}
            <Card className="border-border/50 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                        Heatmap de Produtividade
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">Últimos 90 dias</p>
                </CardHeader>
                <CardContent>
                    <ProductivityHeatmap tarefas={tarefas} />
                </CardContent>
            </Card>

            {/* Charts */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Pie Chart */}
                <Card className="border-border/50 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">
                            Tarefas por Cliente
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Distribuição de tarefas concluídas
                        </p>
                    </CardHeader>
                    <CardContent>
                        {tarefasPorCliente.length === 0 ? (
                            <p className="text-center text-muted-foreground py-8">
                                Nenhuma tarefa concluída no período.
                            </p>
                        ) : (
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={tarefasPorCliente}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={2}
                                            dataKey="value"
                                            label={({ name, percent }: { name?: string; percent?: number }) => {
                                                const n = name ?? '';
                                                const p = percent ?? 0;
                                                return `${n.length > 10 ? n.slice(0, 10) + '...' : n} (${(p * 100).toFixed(0)}%)`;
                                            }}
                                        >
                                            {tarefasPorCliente.map((_, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Bar Chart */}
                <Card className="border-border/50 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">
                            Evolução Semanal
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Últimas 4 semanas
                        </p>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={weeklyData}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip />
                                    <Legend wrapperStyle={{ fontSize: '13px', paddingTop: '10px' }} />
                                    <Bar
                                        dataKey="concluidas"
                                        name="Concluídas"
                                        fill="#3B82F6"
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
