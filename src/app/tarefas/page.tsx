'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import TarefaList from '@/components/tarefas/TarefaList';
import TarefaKanban from '@/components/tarefas/TarefaKanban';
import TarefaForm from '@/components/tarefas/TarefaForm';
import { useData } from '@/lib/data-store';
import { Plus, Search, List, Columns3 } from 'lucide-react';
import { Tarefa } from '@/types';
import { cn } from '@/lib/utils';

type ViewMode = 'list' | 'kanban';

export default function TarefasPage() {
    const { tarefas, clientes } = useData();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('todas');
    const [prioridadeFilter, setPrioridadeFilter] = useState('todas');
    const [clienteFilter, setClienteFilter] = useState('todos');
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [showForm, setShowForm] = useState(false);
    const [editingTarefa, setEditingTarefa] = useState<Tarefa | null>(null);

    // Filtrar tarefas
    const filteredTarefas = useMemo(() => {
        return tarefas.filter((tarefa) => {
            const matchSearch =
                search === '' ||
                tarefa.titulo.toLowerCase().includes(search.toLowerCase());

            const matchStatus =
                statusFilter === 'todas' || tarefa.status === statusFilter;

            const matchPrioridade =
                prioridadeFilter === 'todas' || tarefa.prioridade === prioridadeFilter;

            const matchCliente =
                clienteFilter === 'todos' || tarefa.cliente_id === clienteFilter;

            return matchSearch && matchStatus && matchPrioridade && matchCliente;
        });
    }, [tarefas, search, statusFilter, prioridadeFilter, clienteFilter]);

    const handleEdit = (tarefa: Tarefa) => {
        setEditingTarefa(tarefa);
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingTarefa(null);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Minhas Tarefas</h1>
                    <p className="text-muted-foreground">
                        Gerencie todas as suas tarefas
                    </p>
                </div>
                <Button className="gap-2" onClick={() => setShowForm(true)}>
                    <Plus className="h-4 w-4" />
                    Nova Tarefa
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por título..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                            aria-label="Buscar tarefas"
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full sm:w-[160px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="todas">Todos Status</SelectItem>
                            <SelectItem value="a_fazer">A Fazer</SelectItem>
                            <SelectItem value="em_andamento">Em Andamento</SelectItem>
                            <SelectItem value="concluida">Concluídas</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={prioridadeFilter} onValueChange={setPrioridadeFilter}>
                        <SelectTrigger className="w-full sm:w-[160px]">
                            <SelectValue placeholder="Prioridade" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="todas">Todas</SelectItem>
                            <SelectItem value="alta">Alta</SelectItem>
                            <SelectItem value="media">Média</SelectItem>
                            <SelectItem value="baixa">Baixa</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={clienteFilter} onValueChange={setClienteFilter}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Cliente" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="todos">Todos Clientes</SelectItem>
                            {clientes
                                .filter((c) => c.status === 'ativo')
                                .map((cliente) => (
                                    <SelectItem key={cliente.id} value={cliente.id}>
                                        {cliente.nome}
                                    </SelectItem>
                                ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* View Toggle */}
                <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1 w-fit">
                    <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                            'gap-2 h-8',
                            viewMode === 'list' && 'bg-card shadow-sm'
                        )}
                        onClick={() => setViewMode('list')}
                    >
                        <List className="h-4 w-4" />
                        Lista
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                            'gap-2 h-8',
                            viewMode === 'kanban' && 'bg-card shadow-sm'
                        )}
                        onClick={() => setViewMode('kanban')}
                    >
                        <Columns3 className="h-4 w-4" />
                        Kanban
                    </Button>
                </div>
            </div>

            {/* View */}
            {viewMode === 'list' ? (
                <TarefaList tarefas={filteredTarefas} onEdit={handleEdit} />
            ) : (
                <TarefaKanban tarefas={filteredTarefas} />
            )}

            {/* Form Modal */}
            <TarefaForm
                open={showForm}
                onClose={handleCloseForm}
                editData={
                    editingTarefa
                        ? {
                            id: editingTarefa.id,
                            titulo: editingTarefa.titulo,
                            descricao: editingTarefa.descricao,
                            cliente_id: editingTarefa.cliente_id,
                            status: editingTarefa.status,
                            prioridade: editingTarefa.prioridade,
                            prazo: editingTarefa.prazo,
                        }
                        : undefined
                }
            />
        </div>
    );
}
