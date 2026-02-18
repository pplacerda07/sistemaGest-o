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
import { useData } from '@/lib/data-store';
import { formatCurrency, getInitials } from '@/lib/utils';
import { Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Cliente, TipoContrato, StatusCliente } from '@/types';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

const statusConfig: Record<StatusCliente, { label: string; className: string }> = {
    ativo: { label: 'Ativo', className: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' },
    pausado: { label: 'Pausado', className: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100' },
    encerrado: { label: 'Encerrado', className: 'bg-red-100 text-red-700 hover:bg-red-100' },
};

const tipoConfig: Record<TipoContrato, { label: string; className: string }> = {
    contrato_fixo: { label: 'Contrato Fixo', className: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' },
    freelance: { label: 'Freelance', className: 'bg-blue-100 text-blue-700 hover:bg-blue-100' },
};

interface ClienteTableProps {
    clientes: Cliente[];
}

export default function ClienteTable({ clientes }: ClienteTableProps) {
    const { deleteCliente } = useData();
    const [deleteId, setDeleteId] = React.useState<string | null>(null);

    const handleDelete = () => {
        if (deleteId) {
            deleteCliente(deleteId);
            toast.success('Cliente excluído com sucesso!');
            setDeleteId(null);
        }
    };

    if (clientes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-lg font-semibold mb-2">Nenhum cliente encontrado</h3>
                <p className="text-muted-foreground mb-4">
                    Tente ajustar os filtros ou adicione um novo cliente.
                </p>
                <Link href="/clientes/novo">
                    <Button>Adicionar primeiro cliente</Button>
                </Link>
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
                            <TableHead className="w-[250px]">Cliente</TableHead>
                            <TableHead>Serviço</TableHead>
                            <TableHead>Valor Mensal</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-[100px] text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {clientes.map((cliente) => (
                            <TableRow key={cliente.id} className="hover:bg-muted/30">
                                <TableCell>
                                    <Link
                                        href={`/clientes/${cliente.id}`}
                                        className="flex items-center gap-3 hover:text-blue-600 transition-colors"
                                    >
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xs font-medium">
                                            {getInitials(cliente.nome)}
                                        </div>
                                        <span className="font-medium">{cliente.nome}</span>
                                    </Link>
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {cliente.servico}
                                </TableCell>
                                <TableCell className="font-medium">
                                    {formatCurrency(cliente.valor_mensal)}
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className={tipoConfig[cliente.tipo_contrato].className}>
                                        {tipoConfig[cliente.tipo_contrato].label}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className={statusConfig[cliente.status].className}>
                                        {statusConfig[cliente.status].label}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <Link href={`/clientes/${cliente.id}`}>
                                            <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Editar cliente">
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                            onClick={() => setDeleteId(cliente.id)}
                                            aria-label="Excluir cliente"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
                {clientes.map((cliente) => (
                    <Link
                        key={cliente.id}
                        href={`/clientes/${cliente.id}`}
                        className="block rounded-lg border border-border/50 p-4 hover:bg-muted/30 transition-colors"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm font-medium">
                                    {getInitials(cliente.nome)}
                                </div>
                                <div>
                                    <p className="font-medium">{cliente.nome}</p>
                                    <p className="text-xs text-muted-foreground">{cliente.servico}</p>
                                </div>
                            </div>
                            <Badge variant="secondary" className={statusConfig[cliente.status].className}>
                                {statusConfig[cliente.status].label}
                            </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{formatCurrency(cliente.valor_mensal)}</span>
                            <Badge variant="secondary" className={tipoConfig[cliente.tipo_contrato].className}>
                                {tipoConfig[cliente.tipo_contrato].label}
                            </Badge>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Tem certeza?</DialogTitle>
                        <DialogDescription>
                            Esta ação não pode ser desfeita. O cliente e todos os dados associados (tarefas, anotações, arquivos) serão removidos permanentemente.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteId(null)}>
                            Cancelar
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Excluir
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
