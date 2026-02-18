'use client';

import React, { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useData } from '@/lib/data-store';
import {
    formatCurrency,
    formatDate,
    formatFileSize,
    getInitials,
    cn,
    generateId,
} from '@/lib/utils';
import {
    ArrowLeft,
    Pencil,
    Trash2,
    Plus,
    Mail,
    Phone,
    Calendar,
    FileText,
    Upload,
    Download,
    BarChart3,
    Clock,
    AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';
import ClienteForm from '@/components/clientes/ClienteForm';
import { ClienteFormData, StatusTarefa, Prioridade } from '@/types';

const statusConfig = {
    ativo: { label: 'Ativo', className: 'bg-emerald-100 text-emerald-700' },
    pausado: { label: 'Pausado', className: 'bg-yellow-100 text-yellow-700' },
    encerrado: { label: 'Encerrado', className: 'bg-red-100 text-red-700' },
};

const prioridadeConfig = {
    alta: { label: 'Alta', className: 'bg-red-100 text-red-700' },
    media: { label: 'Média', className: 'bg-yellow-100 text-yellow-700' },
    baixa: { label: 'Baixa', className: 'bg-gray-100 text-gray-600' },
};

const tarefaStatusConfig = {
    a_fazer: { label: 'A Fazer', className: 'bg-gray-100 text-gray-600' },
    em_andamento: { label: 'Em Andamento', className: 'bg-blue-100 text-blue-700' },
    concluida: { label: 'Concluída', className: 'bg-emerald-100 text-emerald-700' },
};

export default function ClienteDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const {
        getCliente,
        updateCliente,
        deleteCliente,
        tarefas,
        addTarefa,
        updateTarefa,
        deleteTarefa,
        toggleTarefa,
        anotacoes,
        addAnotacao,
        updateAnotacao,
        deleteAnotacao,
        anexos,
        addAnexo,
        deleteAnexo,
    } = useData();

    const cliente = getCliente(id);
    const clienteTarefas = tarefas.filter((t) => t.cliente_id === id);
    const clienteAnotacoes = anotacoes.filter((a) => a.cliente_id === id);
    const clienteAnexos = anexos.filter((a) => a.cliente_id === id);

    // States
    const [isEditing, setIsEditing] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [tarefaFilterStatus, setTarefaFilterStatus] = useState<string>('todas');

    // Tarefa form
    const [showTarefaForm, setShowTarefaForm] = useState(false);
    const [editingTarefaId, setEditingTarefaId] = useState<string | null>(null);
    const [tarefaForm, setTarefaForm] = useState({
        titulo: '',
        descricao: '',
        prioridade: 'media' as Prioridade,
        status: 'a_fazer' as StatusTarefa,
        prazo: '',
    });

    // Anotação form
    const [showAnotacaoForm, setShowAnotacaoForm] = useState(false);
    const [editingAnotacaoId, setEditingAnotacaoId] = useState<string | null>(null);
    const [anotacaoForm, setAnotacaoForm] = useState({
        titulo: '',
        conteudo: '',
    });

    if (!cliente) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-6xl mb-4">😕</div>
                <h2 className="text-xl font-semibold mb-2">Cliente não encontrado</h2>
                <p className="text-muted-foreground mb-4">O cliente que você procura não existe.</p>
                <Button onClick={() => router.push('/clientes')}>Voltar para clientes</Button>
            </div>
        );
    }

    // Handlers
    const handleEditSubmit = (data: ClienteFormData) => {
        updateCliente(id, data);
        toast.success('Cliente atualizado com sucesso!');
        setIsEditing(false);
    };

    const handleDelete = () => {
        deleteCliente(id);
        toast.success('Cliente excluído com sucesso!');
        router.push('/clientes');
    };

    // Tarefa handlers
    const resetTarefaForm = () => {
        setTarefaForm({ titulo: '', descricao: '', prioridade: 'media', status: 'a_fazer', prazo: '' });
        setEditingTarefaId(null);
        setShowTarefaForm(false);
    };

    const handleSaveTarefa = () => {
        if (!tarefaForm.titulo.trim()) {
            toast.error('Título da tarefa é obrigatório');
            return;
        }
        if (editingTarefaId) {
            updateTarefa(editingTarefaId, tarefaForm);
            toast.success('Tarefa atualizada!');
        } else {
            addTarefa({ ...tarefaForm, cliente_id: id });
            toast.success('Tarefa criada!');
        }
        resetTarefaForm();
    };

    const handleEditTarefa = (tarefaId: string) => {
        const tarefa = tarefas.find((t) => t.id === tarefaId);
        if (tarefa) {
            setTarefaForm({
                titulo: tarefa.titulo,
                descricao: tarefa.descricao,
                prioridade: tarefa.prioridade,
                status: tarefa.status,
                prazo: tarefa.prazo,
            });
            setEditingTarefaId(tarefaId);
            setShowTarefaForm(true);
        }
    };

    // Anotação handlers
    const resetAnotacaoForm = () => {
        setAnotacaoForm({ titulo: '', conteudo: '' });
        setEditingAnotacaoId(null);
        setShowAnotacaoForm(false);
    };

    const handleSaveAnotacao = () => {
        if (!anotacaoForm.conteudo.trim()) {
            toast.error('Conteúdo da anotação é obrigatório');
            return;
        }
        if (editingAnotacaoId) {
            updateAnotacao(editingAnotacaoId, anotacaoForm);
            toast.success('Anotação atualizada!');
        } else {
            addAnotacao({ ...anotacaoForm, cliente_id: id });
            toast.success('Anotação criada!');
        }
        resetAnotacaoForm();
    };

    const handleEditAnotacao = (anotacaoId: string) => {
        const anotacao = anotacoes.find((a) => a.id === anotacaoId);
        if (anotacao) {
            setAnotacaoForm({ titulo: anotacao.titulo, conteudo: anotacao.conteudo });
            setEditingAnotacaoId(anotacaoId);
            setShowAnotacaoForm(true);
        }
    };

    // File upload handler (simulated)
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            Array.from(files).forEach((file) => {
                addAnexo({
                    cliente_id: id,
                    nome_arquivo: file.name,
                    url: '#',
                    tipo: file.type,
                    tamanho: file.size,
                });
            });
            toast.success(`${files.length} arquivo(s) adicionado(s)!`);
        }
        e.target.value = '';
    };

    const filteredTarefas = clienteTarefas.filter((t) =>
        tarefaFilterStatus === 'todas' ? true : t.status === tarefaFilterStatus
    );

    if (isEditing) {
        return (
            <div className="max-w-3xl mx-auto">
                <Card className="border-border/50 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">Editar Cliente</CardTitle>
                        <p className="text-sm text-muted-foreground">Atualize os dados do cliente</p>
                    </CardHeader>
                    <CardContent>
                        <ClienteForm
                            defaultValues={{
                                nome: cliente.nome,
                                email: cliente.email,
                                telefone: cliente.telefone,
                                servico: cliente.servico,
                                valor_mensal: cliente.valor_mensal,
                                tipo_contrato: cliente.tipo_contrato,
                                data_inicio: cliente.data_inicio,
                                status: cliente.status,
                                observacoes: cliente.observacoes,
                            }}
                            onSubmit={handleEditSubmit}
                            onCancel={() => setIsEditing(false)}
                            isEditing
                        />
                    </CardContent>
                </Card>
            </div>
        );
    }

    const statusInfo = statusConfig[cliente.status];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push('/clientes')}
                        aria-label="Voltar"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white text-lg font-semibold">
                        {getInitials(cliente.nome)}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">{cliente.nome}</h1>
                        <p className="text-sm text-muted-foreground">{cliente.servico}</p>
                    </div>
                    <Badge variant="secondary" className={statusInfo.className}>
                        {statusInfo.label}
                    </Badge>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2" onClick={() => setIsEditing(true)}>
                        <Pencil className="h-4 w-4" />
                        Editar
                    </Button>
                    <Button
                        variant="outline"
                        className="gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => setDeleteConfirm(true)}
                    >
                        <Trash2 className="h-4 w-4" />
                        Excluir
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="bg-muted/50">
                    <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                    <TabsTrigger value="tarefas">Tarefas ({clienteTarefas.length})</TabsTrigger>
                    <TabsTrigger value="anotacoes">Anotações ({clienteAnotacoes.length})</TabsTrigger>
                    <TabsTrigger value="arquivos">Arquivos ({clienteAnexos.length})</TabsTrigger>
                    <TabsTrigger value="metricas">Métricas</TabsTrigger>
                </TabsList>

                {/* TAB: Visão Geral */}
                <TabsContent value="overview" className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card className="border-border/50">
                            <CardHeader>
                                <CardTitle className="text-base">Informações do Cliente</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {cliente.email && (
                                    <div className="flex items-center gap-3">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">{cliente.email}</span>
                                    </div>
                                )}
                                {cliente.telefone && (
                                    <div className="flex items-center gap-3">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">{cliente.telefone}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">Início: {formatDate(cliente.data_inicio)}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">
                                        {cliente.tipo_contrato === 'contrato_fixo' ? 'Contrato Fixo' : 'Freelance'}
                                    </span>
                                </div>
                                <div className="pt-2 border-t">
                                    <p className="text-sm font-medium mb-1">Valor Mensal</p>
                                    <p className="text-2xl font-bold text-emerald-600">
                                        {formatCurrency(cliente.valor_mensal)}
                                    </p>
                                </div>
                                {cliente.observacoes && (
                                    <div className="pt-2 border-t">
                                        <p className="text-sm font-medium mb-1">Observações</p>
                                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                            {cliente.observacoes}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="border-border/50">
                            <CardHeader>
                                <CardTitle className="text-base">Resumo</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-3 rounded-lg bg-muted/50">
                                        <p className="text-2xl font-bold">{clienteTarefas.length}</p>
                                        <p className="text-xs text-muted-foreground">Total Tarefas</p>
                                    </div>
                                    <div className="text-center p-3 rounded-lg bg-muted/50">
                                        <p className="text-2xl font-bold">
                                            {clienteTarefas.filter((t) => t.status === 'concluida').length}
                                        </p>
                                        <p className="text-xs text-muted-foreground">Concluídas</p>
                                    </div>
                                    <div className="text-center p-3 rounded-lg bg-muted/50">
                                        <p className="text-2xl font-bold">{clienteAnotacoes.length}</p>
                                        <p className="text-xs text-muted-foreground">Anotações</p>
                                    </div>
                                    <div className="text-center p-3 rounded-lg bg-muted/50">
                                        <p className="text-2xl font-bold">{clienteAnexos.length}</p>
                                        <p className="text-xs text-muted-foreground">Arquivos</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* TAB: Tarefas */}
                <TabsContent value="tarefas" className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Select value={tarefaFilterStatus} onValueChange={setTarefaFilterStatus}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filtrar status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todas">Todas</SelectItem>
                                <SelectItem value="a_fazer">A Fazer</SelectItem>
                                <SelectItem value="em_andamento">Em Andamento</SelectItem>
                                <SelectItem value="concluida">Concluídas</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button
                            className="gap-2"
                            onClick={() => {
                                resetTarefaForm();
                                setShowTarefaForm(true);
                            }}
                        >
                            <Plus className="h-4 w-4" />
                            Nova Tarefa
                        </Button>
                    </div>

                    {filteredTarefas.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                            <p>Nenhuma tarefa encontrada.</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filteredTarefas.map((tarefa) => {
                                const pConfig = prioridadeConfig[tarefa.prioridade];
                                const sConfig = tarefaStatusConfig[tarefa.status];
                                const isOverdue =
                                    tarefa.prazo &&
                                    new Date(tarefa.prazo) < new Date() &&
                                    tarefa.status !== 'concluida';

                                return (
                                    <div
                                        key={tarefa.id}
                                        className={cn(
                                            'flex items-start gap-3 rounded-lg border p-4 transition-colors',
                                            tarefa.status === 'concluida' ? 'bg-muted/30 opacity-75' : 'bg-card',
                                            isOverdue ? 'border-red-200 bg-red-50/50' : 'border-border/50'
                                        )}
                                    >
                                        <Checkbox
                                            checked={tarefa.status === 'concluida'}
                                            onCheckedChange={() => toggleTarefa(tarefa.id)}
                                            className="mt-1"
                                            aria-label={`Marcar "${tarefa.titulo}" como ${tarefa.status === 'concluida' ? 'pendente' : 'concluída'}`}
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
                                            {tarefa.descricao && (
                                                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                                    {tarefa.descricao}
                                                </p>
                                            )}
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
                                                            isOverdue ? 'text-red-600' : 'text-muted-foreground'
                                                        )}
                                                    >
                                                        {isOverdue ? (
                                                            <AlertTriangle className="h-3 w-3" />
                                                        ) : (
                                                            <Clock className="h-3 w-3" />
                                                        )}
                                                        {formatDate(tarefa.prazo)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 shrink-0">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => handleEditTarefa(tarefa.id)}
                                                aria-label="Editar tarefa"
                                            >
                                                <Pencil className="h-3.5 w-3.5" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-red-500 hover:text-red-600"
                                                onClick={() => {
                                                    deleteTarefa(tarefa.id);
                                                    toast.success('Tarefa excluída!');
                                                }}
                                                aria-label="Excluir tarefa"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </TabsContent>

                {/* TAB: Anotações */}
                <TabsContent value="anotacoes" className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Minhas Anotações</h3>
                        <Button
                            className="gap-2"
                            onClick={() => {
                                resetAnotacaoForm();
                                setShowAnotacaoForm(true);
                            }}
                        >
                            <Plus className="h-4 w-4" />
                            Nova Anotação
                        </Button>
                    </div>

                    {clienteAnotacoes.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                            <p>Nenhuma anotação ainda.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {clienteAnotacoes.map((anotacao) => (
                                <Card key={anotacao.id} className="border-border/50">
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1 min-w-0">
                                                {anotacao.titulo && (
                                                    <h4 className="text-sm font-semibold mb-1">{anotacao.titulo}</h4>
                                                )}
                                                <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-4">
                                                    {anotacao.conteudo}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-2">
                                                    {formatDate(anotacao.created_at)}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-1 shrink-0 ml-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => handleEditAnotacao(anotacao.id)}
                                                    aria-label="Editar anotação"
                                                >
                                                    <Pencil className="h-3.5 w-3.5" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-red-500 hover:text-red-600"
                                                    onClick={() => {
                                                        deleteAnotacao(anotacao.id);
                                                        toast.success('Anotação excluída!');
                                                    }}
                                                    aria-label="Excluir anotação"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>

                {/* TAB: Arquivos */}
                <TabsContent value="arquivos" className="space-y-4">
                    {/* Upload Area */}
                    <div className="rounded-lg border-2 border-dashed border-border/50 p-8 text-center hover:border-blue-400 transition-colors">
                        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                        <p className="text-sm font-medium mb-1">Arraste arquivos aqui ou clique para enviar</p>
                        <p className="text-xs text-muted-foreground mb-3">PDF, imagens, documentos</p>
                        <label>
                            <Input
                                type="file"
                                multiple
                                className="hidden"
                                onChange={handleFileUpload}
                                accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.gif"
                            />
                            <Button variant="outline" size="sm" asChild>
                                <span>Selecionar Arquivos</span>
                            </Button>
                        </label>
                    </div>

                    {clienteAnexos.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                            <p>Nenhum arquivo anexado.</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {clienteAnexos.map((anexo) => (
                                <div
                                    key={anexo.id}
                                    className="flex items-center gap-3 rounded-lg border border-border/50 p-3"
                                >
                                    <FileText className="h-8 w-8 text-blue-500 shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{anexo.nome_arquivo}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatFileSize(anexo.tamanho)} • {formatDate(anexo.created_at)}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0">
                                        <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Baixar arquivo">
                                            <Download className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-red-500 hover:text-red-600"
                                            onClick={() => {
                                                deleteAnexo(anexo.id);
                                                toast.success('Arquivo excluído!');
                                            }}
                                            aria-label="Excluir arquivo"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </TabsContent>

                {/* TAB: Métricas */}
                <TabsContent value="metricas">
                    <Card className="border-border/50">
                        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                            <BarChart3 className="h-16 w-16 text-muted-foreground/30 mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Dashboard de Métricas</h3>
                            <p className="text-sm text-muted-foreground mb-4 max-w-md">
                                Integração com Meta Ads em breve. Aqui você poderá visualizar métricas de Facebook e Instagram Ads.
                            </p>
                            <Button disabled className="gap-2">
                                <BarChart3 className="h-4 w-4" />
                                Exportar PDF
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteConfirm} onOpenChange={setDeleteConfirm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Excluir cliente?</DialogTitle>
                        <DialogDescription>
                            Esta ação não pode ser desfeita. Todos os dados associados ao cliente (tarefas, anotações, arquivos) serão removidos.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteConfirm(false)}>
                            Cancelar
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Excluir
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Tarefa Form Dialog */}
            <Dialog open={showTarefaForm} onOpenChange={(open) => !open && resetTarefaForm()}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{editingTarefaId ? 'Editar Tarefa' : 'Nova Tarefa'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="tarefa-titulo">Título *</Label>
                            <Input
                                id="tarefa-titulo"
                                value={tarefaForm.titulo}
                                onChange={(e) => setTarefaForm({ ...tarefaForm, titulo: e.target.value })}
                                placeholder="Título da tarefa"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tarefa-descricao">Descrição</Label>
                            <Textarea
                                id="tarefa-descricao"
                                value={tarefaForm.descricao}
                                onChange={(e) => setTarefaForm({ ...tarefaForm, descricao: e.target.value })}
                                placeholder="Descrição da tarefa"
                                rows={3}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label>Prioridade</Label>
                                <Select
                                    value={tarefaForm.prioridade}
                                    onValueChange={(val) => setTarefaForm({ ...tarefaForm, prioridade: val as Prioridade })}
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
                                    value={tarefaForm.status}
                                    onValueChange={(val) => setTarefaForm({ ...tarefaForm, status: val as StatusTarefa })}
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
                            <Label htmlFor="tarefa-prazo">Prazo</Label>
                            <Input
                                id="tarefa-prazo"
                                type="date"
                                value={tarefaForm.prazo}
                                onChange={(e) => setTarefaForm({ ...tarefaForm, prazo: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={resetTarefaForm}>Cancelar</Button>
                        <Button onClick={handleSaveTarefa}>Salvar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Anotação Form Dialog */}
            <Dialog open={showAnotacaoForm} onOpenChange={(open) => !open && resetAnotacaoForm()}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{editingAnotacaoId ? 'Editar Anotação' : 'Nova Anotação'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="anotacao-titulo">Título</Label>
                            <Input
                                id="anotacao-titulo"
                                value={anotacaoForm.titulo}
                                onChange={(e) => setAnotacaoForm({ ...anotacaoForm, titulo: e.target.value })}
                                placeholder="Título (opcional)"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="anotacao-conteudo">Conteúdo *</Label>
                            <Textarea
                                id="anotacao-conteudo"
                                value={anotacaoForm.conteudo}
                                onChange={(e) => setAnotacaoForm({ ...anotacaoForm, conteudo: e.target.value })}
                                placeholder="Escreva sua anotação..."
                                rows={6}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={resetAnotacaoForm}>Cancelar</Button>
                        <Button onClick={handleSaveAnotacao}>Salvar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
