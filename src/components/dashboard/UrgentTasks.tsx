'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useData } from '@/lib/data-store';
import { formatDate, isOverdue, cn } from '@/lib/utils';
import { ArrowRight, AlertTriangle, Clock } from 'lucide-react';

const prioridadeConfig = {
    alta: { label: 'Alta', className: 'bg-red-100 text-red-700 hover:bg-red-100' },
    media: { label: 'Média', className: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100' },
    baixa: { label: 'Baixa', className: 'bg-gray-100 text-gray-600 hover:bg-gray-100' },
};

export default function UrgentTasks() {
    const { tarefas, clientes } = useData();

    // Tarefas pendentes com prazo nos próximos 7 dias, ordenadas por prazo
    const now = new Date();
    const in7days = new Date(now);
    in7days.setDate(in7days.getDate() + 7);

    const urgentTarefas = tarefas
        .filter((t) => {
            if (t.status === 'concluida') return false;
            if (!t.prazo) return false;
            const prazoDate = new Date(t.prazo);
            return prazoDate <= in7days;
        })
        .sort((a, b) => new Date(a.prazo).getTime() - new Date(b.prazo).getTime())
        .slice(0, 6);

    const getClienteName = (clienteId: string) => {
        return clientes.find((c) => c.id === clienteId)?.nome ?? 'Cliente';
    };

    return (
        <Card className="border-border/50 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-lg font-semibold">Tarefas Urgentes</CardTitle>
                    <p className="text-sm text-muted-foreground">Prazo nos próximos 7 dias</p>
                </div>
                <Link href="/tarefas">
                    <Button variant="ghost" size="sm" className="gap-1 text-blue-600 hover:text-blue-700">
                        Ver todas
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </Link>
            </CardHeader>
            <CardContent>
                {urgentTarefas.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-6">
                        🎉 Nenhuma tarefa urgente!
                    </p>
                ) : (
                    <div className="space-y-3">
                        {urgentTarefas.map((tarefa) => {
                            const overdue = isOverdue(tarefa.prazo);
                            const config = prioridadeConfig[tarefa.prioridade];

                            return (
                                <div
                                    key={tarefa.id}
                                    className={cn(
                                        'flex items-start gap-3 rounded-lg p-3 transition-colors',
                                        overdue
                                            ? 'bg-red-50/80 border border-red-200/60'
                                            : 'hover:bg-muted/50'
                                    )}
                                >
                                    {/* Icon */}
                                    <div className="mt-0.5">
                                        {overdue ? (
                                            <AlertTriangle className="h-4 w-4 text-red-500" />
                                        ) : (
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium">{tarefa.titulo}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            {getClienteName(tarefa.cliente_id)}
                                        </p>
                                    </div>

                                    {/* Badge + Date */}
                                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                                        <Badge variant="secondary" className={config.className}>
                                            {config.label}
                                        </Badge>
                                        <span
                                            className={cn(
                                                'text-xs',
                                                overdue ? 'text-red-600 font-medium' : 'text-muted-foreground'
                                            )}
                                        >
                                            {overdue ? 'Atrasada • ' : ''}
                                            {formatDate(tarefa.prazo)}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
