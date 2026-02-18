'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useData } from '@/lib/data-store';
import { StatusTarefa, Prioridade } from '@/types';
import { toast } from 'sonner';

interface TarefaFormProps {
    open: boolean;
    onClose: () => void;
    editData?: {
        id: string;
        titulo: string;
        descricao: string;
        cliente_id: string;
        status: StatusTarefa;
        prioridade: Prioridade;
        prazo: string;
    };
}

export default function TarefaForm({ open, onClose, editData }: TarefaFormProps) {
    const { clientes, addTarefa, updateTarefa } = useData();
    const [form, setForm] = React.useState({
        titulo: '',
        descricao: '',
        cliente_id: '',
        status: 'a_fazer' as StatusTarefa,
        prioridade: 'media' as Prioridade,
        prazo: '',
    });

    React.useEffect(() => {
        if (editData) {
            setForm({
                titulo: editData.titulo,
                descricao: editData.descricao,
                cliente_id: editData.cliente_id,
                status: editData.status,
                prioridade: editData.prioridade,
                prazo: editData.prazo,
            });
        } else {
            setForm({
                titulo: '',
                descricao: '',
                cliente_id: '',
                status: 'a_fazer',
                prioridade: 'media',
                prazo: '',
            });
        }
    }, [editData, open]);

    const handleSave = () => {
        if (!form.titulo.trim()) {
            toast.error('Título é obrigatório');
            return;
        }
        if (!form.cliente_id) {
            toast.error('Selecione um cliente');
            return;
        }

        if (editData) {
            updateTarefa(editData.id, form);
            toast.success('Tarefa atualizada!');
        } else {
            addTarefa(form);
            toast.success('Tarefa criada!');
        }
        onClose();
    };

    const clientesAtivos = clientes.filter((c) => c.status === 'ativo');

    return (
        <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{editData ? 'Editar Tarefa' : 'Nova Tarefa'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="tf-titulo">Título *</Label>
                        <Input
                            id="tf-titulo"
                            value={form.titulo}
                            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                            placeholder="Título da tarefa"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="tf-descricao">Descrição</Label>
                        <Textarea
                            id="tf-descricao"
                            value={form.descricao}
                            onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                            placeholder="Descrição da tarefa"
                            rows={3}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Cliente *</Label>
                        <Select
                            value={form.cliente_id}
                            onValueChange={(val) => setForm({ ...form, cliente_id: val })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o cliente" />
                            </SelectTrigger>
                            <SelectContent>
                                {clientesAtivos.map((cliente) => (
                                    <SelectItem key={cliente.id} value={cliente.id}>
                                        {cliente.nome}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <Label>Prioridade</Label>
                            <Select
                                value={form.prioridade}
                                onValueChange={(val) => setForm({ ...form, prioridade: val as Prioridade })}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="baixa">Baixa</SelectItem>
                                    <SelectItem value="media">Média</SelectItem>
                                    <SelectItem value="alta">Alta</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Select
                                value={form.status}
                                onValueChange={(val) => setForm({ ...form, status: val as StatusTarefa })}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="a_fazer">A Fazer</SelectItem>
                                    <SelectItem value="em_andamento">Em Andamento</SelectItem>
                                    <SelectItem value="concluida">Concluída</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="tf-prazo">Prazo</Label>
                        <Input
                            id="tf-prazo"
                            type="date"
                            value={form.prazo}
                            onChange={(e) => setForm({ ...form, prazo: e.target.value })}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancelar</Button>
                    <Button onClick={handleSave}>Salvar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
