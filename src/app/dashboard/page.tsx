'use client';

import React from 'react';
import MetricCard from '@/components/dashboard/MetricCard';
import RevenueChart from '@/components/dashboard/RevenueChart';
import RecentClients from '@/components/dashboard/RecentClients';
import UrgentTasks from '@/components/dashboard/UrgentTasks';
import { useData } from '@/lib/data-store';
import { formatCurrency } from '@/lib/utils';
import { Users, DollarSign, Briefcase, ListTodo } from 'lucide-react';

export default function DashboardPage() {
    const { clientes, tarefas } = useData();

    // Calcular métricas
    const clientesAtivos = clientes.filter((c) => c.status === 'ativo');
    const clientesPausados = clientes.filter((c) => c.status === 'pausado');
    const clientesEncerrados = clientes.filter((c) => c.status === 'encerrado');

    // Receita de contratos fixos ativos
    const receitaMensal = clientesAtivos
        .filter((c) => c.tipo_contrato === 'contrato_fixo')
        .reduce((sum, c) => sum + c.valor_mensal, 0);

    // Freelances ativos (projetos pontuais do mês)
    const freelancesMes = clientesAtivos
        .filter((c) => c.tipo_contrato === 'freelance')
        .reduce((sum, c) => sum + c.valor_mensal, 0);

    // Tarefas pendentes
    const tarefasPendentes = tarefas.filter((t) => t.status !== 'concluida');
    const tarefasEmAndamento = tarefas.filter((t) => t.status === 'em_andamento');

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                    Visão geral do seu negócio de marketing digital
                </p>
            </div>

            {/* Metric Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                    title="Clientes Ativos"
                    value={clientesAtivos.length}
                    subtitle={`${clientesPausados.length} pausados, ${clientesEncerrados.length} encerrados`}
                    icon={Users}
                    iconColor="text-blue-600"
                    iconBg="bg-blue-50"
                />
                <MetricCard
                    title="Receita Mensal"
                    value={formatCurrency(receitaMensal)}
                    subtitle="Contratos fixos"
                    icon={DollarSign}
                    iconColor="text-emerald-600"
                    iconBg="bg-emerald-50"
                />
                <MetricCard
                    title="Freelances do Mês"
                    value={formatCurrency(freelancesMes)}
                    subtitle="Projetos pontuais"
                    icon={Briefcase}
                    iconColor="text-violet-600"
                    iconBg="bg-violet-50"
                />
                <MetricCard
                    title="Tarefas Pendentes"
                    value={tarefasPendentes.length}
                    subtitle={`${tarefasEmAndamento.length} em andamento`}
                    icon={ListTodo}
                    iconColor="text-amber-600"
                    iconBg="bg-amber-50"
                />
            </div>

            {/* Revenue Chart */}
            <RevenueChart />

            {/* Recent Clients + Urgent Tasks */}
            <div className="grid gap-6 lg:grid-cols-2">
                <RecentClients />
                <UrgentTasks />
            </div>
        </div>
    );
}
