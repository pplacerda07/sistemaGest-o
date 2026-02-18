'use client';

import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useData } from '@/lib/data-store';
import { formatDate, isOverdue, cn } from '@/lib/utils';
import { Pencil, Trash2, AlertTriangle, Clock } from 'lucide-react';
import { Tarefa } from '@/types';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import Link from 'next/link';

const prioridadeConfig = {
    alta: { label: 'Alta', className: 'bg-red-100 text-red-700 hover:bg-red-100' },
    media: { label: 'Média', className: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100' },
    baixa: { label: 'Baixa', className: 'bg-gray-100 text-gray-600 hover:bg-gray-100' },
};

const statusConfig = {
    a_fazer: { label: 'A Fazer', className: 'bg-gray-100 text-gray-600 hover:bg-gray-100' },
    em_andamento: { label: 'Em Andamento', className: 'bg-blue-100 text-blue-700 hover:bg-blue-100' },
    concluida: { label: 'Concluída', className: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' },
};

interface TarefaListProps {
    tarefas: Tarefa[];
    onEdit: (tarefa: Tarefa) => void;
}

export default function TarefaList({ tarefas, onEdit }: TarefaListProps) {
    const { toggleTarefa, deleteTarefa, clientes } = useData();
    const [deleteId, setDeleteId] = React.useState<string | null>(null);

    const getClienteName = (clienteId: string) =>
        clientes.find((c) => c.id === clienteId)?.nome ?? 'Cliente';

    const handleDelete = () => {
        if (deleteId) {
            deleteTarefa(deleteId);
            toast.success('Tarefa excluída!');
            setDeleteId(null);
        }
    };

    if (tarefas.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-lg font-semibold mb-2">Nenhuma tarefa encontrada</h3>
                <p className="text-muted-foreground">Tente ajustar os filtros ou crie uma nova tarefa.</p>
            </div>
        );
    }

    return (
        <>
            {/* Desktop Table */}
            <div className="hidden md:block rounded-lg border border-border/50 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead className="w-[50px]"></TableHead>
                            <TableHead>Título</TableHead>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Prioridade</TableHead>
                            <TableHead>Prazo</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-[100px] text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tarefas.map((tarefa) => {
                            const overdue =
                                tarefa.prazo &&
                                isOverdue(tarefa.prazo) &&
                                tarefa.status !== 'concluida';
                            const pConfig = prioridadeConfig[tarefa.prioridade];
                            const sConfig = statusConfig[tarefa.status];

                            return (
                                <TableRow
                                    key={tarefa.id}
                                    className={cn(
                                        'hover:bg-muted/30',
                                        tarefa.status === 'concluida' && 'opacity-60'
                                    )}
                                >
                                    <TableCell>
                                        <Checkbox
                                            checked={tarefa.status === 'concluida'}
                                            onCheckedChange={() => toggleTarefa(tarefa.id)}
                                            aria-label={`Concluir tarefa "${tarefa.titulo}"`}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <p
                                            className={cn(
                                                'font-medium',
                                                tarefa.status === 'concluida' && 'line-through text-muted-foreground'
                                            )}
                                        >
                                            {tarefa.titulo}
                                        </p>
                                        {tarefa.descricao && (
                                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                                                {tarefa.descricao}
                                            </p>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Link
                                            href={`/clientes/${tarefa.cliente_id}`}
                                            className="text-sm text-blue-600 hover:underline"
                                        >
                                            {getClienteName(tarefa.cliente_id)}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className={pConfig.className}>
                                            {pConfig.label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {tarefa.prazo ? (
                                            <span
                                                className={cn(
                                                    'text-sm flex items-center gap-1',
                                                    overdue ? 'text-red-600 font-medium' : 'text-muted-foreground'
                                                )}
                                            >
                                                {overdue && <AlertTriangle className="h-3.5 w-3.5" />}
                                                {formatDate(tarefa.prazo)}
                                            </span>
                                        ) : (
                                            <span className="text-sm text-muted-foreground">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className={sConfig.className}>
                                            {sConfig.label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => onEdit(tarefa)}
                                                aria-label="Editar tarefa"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                                onClick={() => setDeleteId(tarefa.id)}
                                                aria-label="Excluir tarefa"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
                {tarefas.map((tarefa) => {
                    const overdue =
                        tarefa.prazo && isOverdue(tarefa.prazo) && tarefa.status !== 'concluida';
                    const pConfig = prioridadeConfig[tarefa.prioridade];
                    const sConfig = statusConfig[tarefa.status];

                    return (
                        <div
                            key={tarefa.id}
                            className={cn(
                                'rounded-lg border p-4 transition-colors',
                                overdue ? 'border-red-200 bg-red-50/50' : 'border-border/50',
                                tarefa.status === 'concluida' && 'opacity-60'
                            )}
                        >
                            <div className="flex items-start gap-3">
                                <Checkbox
                                    checked={tarefa.status === 'concluida'}
                                    onCheckedChange={() => toggleTarefa(tarefa.id)}
                                    className="mt-1"
                                />
                                <div className="flex-1 min-w-0">
                                    <p
                                        className={cn(
                                            'text-sm font-medium',
                                            tarefa.status === 'concluida' && 'line-through text-muted-foreground'
                                        )}
                                    >
                                        {tarefa.titulo}
                                    </p>
                                    <p className="text-xs text-blue-600 mt-0.5">
                                        {getClienteName(tarefa.cliente_id)}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                                        <Badge variant="secondary" className={pConfig.className}>
                                            {pConfig.label}
                                        </Badge>
                                        <Badge variant="secondary" className={sConfig.className}>
                                            {sConfig.label}
                                        </Badge>
                                        {tarefa.prazo && (
                                            <span
                                                className={cn(
                                                    'text-xs flex items-center gap-1',
                                                    overdue ? 'text-red-600' : 'text-muted-foreground'
                                                )}
                                            >
                                                <Clock className="h-3 w-3" />
                                                {formatDate(tarefa.prazo)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Delete Dialog */}
            <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Excluir tarefa?</DialogTitle>
                        <DialogDescription>Esta ação não pode ser desfeita.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteId(null)}>Cancelar</Button>
                        <Button variant="destructive" onClick={handleDelete}>Excluir</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
