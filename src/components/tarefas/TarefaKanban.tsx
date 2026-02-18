'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useData } from '@/lib/data-store';
import { formatDate, isOverdue, cn } from '@/lib/utils';
import { Tarefa, StatusTarefa } from '@/types';
import { Clock, AlertTriangle, GripVertical } from 'lucide-react';

const prioridadeColors = {
    alta: 'border-l-red-500',
    media: 'border-l-yellow-500',
    baixa: 'border-l-gray-300',
};

const prioridadeLabels = {
    alta: { label: 'Alta', className: 'bg-red-100 text-red-700' },
    media: { label: 'Média', className: 'bg-yellow-100 text-yellow-700' },
    baixa: { label: 'Baixa', className: 'bg-gray-100 text-gray-600' },
};

const columns: { status: StatusTarefa; title: string; color: string }[] = [
    { status: 'a_fazer', title: 'A Fazer', color: 'bg-gray-500' },
    { status: 'em_andamento', title: 'Em Andamento', color: 'bg-blue-500' },
    { status: 'concluida', title: 'Concluídas', color: 'bg-emerald-500' },
];

interface TarefaKanbanProps {
    tarefas: Tarefa[];
}

export default function TarefaKanban({ tarefas }: TarefaKanbanProps) {
    const { clientes, updateTarefa } = useData();
    const [draggedId, setDraggedId] = React.useState<string | null>(null);

    const getClienteName = (clienteId: string) =>
        clientes.find((c) => c.id === clienteId)?.nome ?? 'Cliente';

    const handleDragStart = (e: React.DragEvent, tarefaId: string) => {
        setDraggedId(tarefaId);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent, newStatus: StatusTarefa) => {
        e.preventDefault();
        if (draggedId) {
            const completedAt =
                newStatus === 'concluida' ? new Date().toISOString() : null;
            updateTarefa(draggedId, {
                status: newStatus,
                completed_at: completedAt,
            });
            setDraggedId(null);
        }
    };

    return (
        <div className="grid gap-4 md:grid-cols-3">
            {columns.map((column) => {
                const columnTarefas = tarefas.filter((t) => t.status === column.status);

                return (
                    <Card
                        key={column.status}
                        className="border-border/50 min-h-[300px]"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, column.status)}
                    >
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                                <div className={cn('h-2.5 w-2.5 rounded-full', column.color)} />
                                {column.title}
                                <Badge variant="secondary" className="ml-auto text-xs">
                                    {columnTarefas.length}
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 pt-0">
                            {columnTarefas.length === 0 ? (
                                <p className="text-xs text-muted-foreground text-center py-8">
                                    Nenhuma tarefa
                                </p>
                            ) : (
                                columnTarefas.map((tarefa) => {
                                    const overdue =
                                        tarefa.prazo &&
                                        isOverdue(tarefa.prazo) &&
                                        tarefa.status !== 'concluida';
                                    const pColor = prioridadeColors[tarefa.prioridade];
                                    const pLabel = prioridadeLabels[tarefa.prioridade];

                                    return (
                                        <div
                                            key={tarefa.id}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, tarefa.id)}
                                            className={cn(
                                                'rounded-lg border border-l-4 p-3 cursor-grab active:cursor-grabbing transition-all hover:shadow-sm bg-card',
                                                pColor,
                                                draggedId === tarefa.id && 'opacity-50'
                                            )}
                                        >
                                            <div className="flex items-start gap-2">
                                                <GripVertical className="h-4 w-4 text-muted-foreground/40 shrink-0 mt-0.5" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium line-clamp-2">
                                                        {tarefa.titulo}
                                                    </p>
                                                    <p className="text-xs text-blue-600 mt-1">
                                                        {getClienteName(tarefa.cliente_id)}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <Badge
                                                            variant="secondary"
                                                            className={cn('text-[10px] px-1.5 py-0', pLabel.className)}
                                                        >
                                                            {pLabel.label}
                                                        </Badge>
                                                        {tarefa.prazo && (
                                                            <span
                                                                className={cn(
                                                                    'text-[11px] flex items-center gap-0.5',
                                                                    overdue
                                                                        ? 'text-red-600 font-medium'
                                                                        : 'text-muted-foreground'
                                                                )}
                                                            >
                                                                {overdue ? (
                                                                    <AlertTriangle className="h-3 w-3" />
                                                                ) : (
                                                                    <Clock className="h-3 w-3" />
                                                                )}
                                                                {formatDate(tarefa.prazo)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
