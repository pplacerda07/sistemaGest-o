'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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
import MetricCard from '@/components/dashboard/MetricCard';
import { useData } from '@/lib/data-store';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
    DollarSign,
    TrendingDown,
    TrendingUp,
    Briefcase,
    Plus,
    Pencil,
    Trash2,
} from 'lucide-react';
import { mockRevenueData } from '@/lib/mock-data';
import { CustoOperacional } from '@/types';
import { toast } from 'sonner';

const categorias = ['Software', 'Infraestrutura', 'Marketing', 'Educação', 'Outros'];

const categoriaColors: Record<string, string> = {
    Software: 'bg-blue-100 text-blue-700',
    Infraestrutura: 'bg-purple-100 text-purple-700',
    Marketing: 'bg-green-100 text-green-700',
    Educação: 'bg-amber-100 text-amber-700',
    Outros: 'bg-gray-100 text-gray-700',
};

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

export default function FinanceiroPage() {
    const { clientes, custos, addCusto, updateCusto, deleteCusto } = useData();
    const [showForm, setShowForm] = useState(false);
    const [editingCusto, setEditingCusto] = useState<CustoOperacional | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [form, setForm] = useState({
        descricao: '',
        valor: 0,
        categoria: 'Software',
        data: new Date().toISOString().split('T')[0],
        recorrente: false,
    });

    // Calcular métricas
    const clientesAtivos = clientes.filter((c) => c.status === 'ativo');
    const receitaFixa = clientesAtivos
        .filter((c) => c.tipo_contrato === 'contrato_fixo')
        .reduce((sum, c) => sum + c.valor_mensal, 0);
    const receitaFreelance = clientesAtivos
        .filter((c) => c.tipo_contrato === 'freelance')
        .reduce((sum, c) => sum + c.valor_mensal, 0);
    const receitaTotal = receitaFixa + receitaFreelance;
    const custosRecorrentes = custos
        .filter((c) => c.recorrente)
        .reduce((sum, c) => sum + c.valor, 0);
    const lucro = receitaTotal - custosRecorrentes;
    const margem = receitaTotal > 0 ? ((lucro / receitaTotal) * 100).toFixed(1) : '0';

    // Dados para gráfico de 12 meses
    const revenueData12 = [
        ...Array.from({ length: 6 }, (_, i) => ({
            month: ['Mar/25', 'Abr/25', 'Mai/25', 'Jun/25', 'Jul/25', 'Ago/25'][i],
            receita: [10000, 11500, 12800, 13200, 13800, 14000][i],
            custos: [400, 420, 450, 480, 500, 520][i],
            lucro: [9600, 11080, 12350, 12720, 13300, 13480][i],
        })),
        ...mockRevenueData,
    ];

    const openForm = (custo?: CustoOperacional) => {
        if (custo) {
            setEditingCusto(custo);
            setForm({
                descricao: custo.descricao,
                valor: custo.valor,
                categoria: custo.categoria,
                data: custo.data,
                recorrente: custo.recorrente,
            });
        } else {
            setEditingCusto(null);
            setForm({
                descricao: '',
                valor: 0,
                categoria: 'Software',
                data: new Date().toISOString().split('T')[0],
                recorrente: false,
            });
        }
        setShowForm(true);
    };

    const handleSave = () => {
        if (!form.descricao.trim()) {
            toast.error('Descrição é obrigatória');
            return;
        }
        if (form.valor <= 0) {
            toast.error('Valor deve ser maior que zero');
            return;
        }

        if (editingCusto) {
            updateCusto(editingCusto.id, form);
            toast.success('Custo atualizado!');
        } else {
            addCusto(form);
            toast.success('Custo adicionado!');
        }
        setShowForm(false);
    };

    const handleDelete = () => {
        if (deleteId) {
            deleteCusto(deleteId);
            toast.success('Custo excluído!');
            setDeleteId(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Gestão Financeira</h1>
                    <p className="text-muted-foreground">
                        Controle sua receita e custos operacionais
                    </p>
                </div>
                <Button className="gap-2" onClick={() => openForm()}>
                    <Plus className="h-4 w-4" />
                    Adicionar Custo
                </Button>
            </div>

            {/* Metric Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                    title="Receita Mensal Total"
                    value={formatCurrency(receitaTotal)}
                    subtitle="Contratos + Freelances"
                    icon={DollarSign}
                    iconColor="text-emerald-600"
                    iconBg="bg-emerald-50"
                />
                <MetricCard
                    title="Custos Mensais"
                    value={formatCurrency(custosRecorrentes)}
                    subtitle="Custos recorrentes"
                    icon={TrendingDown}
                    iconColor="text-red-600"
                    iconBg="bg-red-50"
                />
                <MetricCard
                    title="Lucro Mensal"
                    value={formatCurrency(lucro)}
                    subtitle={`Margem: ${margem}%`}
                    icon={TrendingUp}
                    iconColor="text-blue-600"
                    iconBg="bg-blue-50"
                />
                <MetricCard
                    title="Freelances (mês)"
                    value={formatCurrency(receitaFreelance)}
                    subtitle="Projetos pontuais"
                    icon={Briefcase}
                    iconColor="text-violet-600"
                    iconBg="bg-violet-50"
                />
            </div>

            {/* Revenue Evolution Chart */}
            <Card className="border-border/50 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                        Evolução Financeira
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">Últimos 12 meses</p>
                </CardHeader>
                <CardContent>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={revenueData12}
                                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                                <YAxis
                                    tick={{ fontSize: 11 }}
                                    tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend wrapperStyle={{ fontSize: '13px', paddingTop: '10px' }} />
                                <Line type="monotone" dataKey="receita" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} name="Receita" />
                                <Line type="monotone" dataKey="custos" stroke="#EF4444" strokeWidth={2} dot={{ r: 3 }} name="Custos" />
                                <Line type="monotone" dataKey="lucro" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} name="Lucro" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Costs Table */}
            <Card className="border-border/50 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                        Custos Operacionais
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {custos.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">
                            Nenhum custo registrado.
                        </p>
                    ) : (
                        <>
                            {/* Desktop */}
                            <div className="hidden md:block rounded-lg border border-border/50 overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/50">
                                            <TableHead>Descrição</TableHead>
                                            <TableHead>Categoria</TableHead>
                                            <TableHead>Valor</TableHead>
                                            <TableHead>Recorrente</TableHead>
                                            <TableHead>Data</TableHead>
                                            <TableHead className="text-right">Ações</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {custos.map((custo) => (
                                            <TableRow key={custo.id} className="hover:bg-muted/30">
                                                <TableCell className="font-medium">{custo.descricao}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="secondary"
                                                        className={categoriaColors[custo.categoria] || categoriaColors['Outros']}
                                                    >
                                                        {custo.categoria}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="font-medium text-red-600">
                                                    {formatCurrency(custo.valor)}
                                                </TableCell>
                                                <TableCell>
                                                    {custo.recorrente ? (
                                                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                                            Sim
                                                        </Badge>
                                                    ) : (
                                                        <span className="text-muted-foreground text-sm">Não</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {formatDate(custo.data)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={() => openForm(custo)}
                                                            aria-label="Editar custo"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-red-500 hover:text-red-600"
                                                            onClick={() => setDeleteId(custo.id)}
                                                            aria-label="Excluir custo"
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

                            {/* Mobile */}
                            <div className="md:hidden space-y-3">
                                {custos.map((custo) => (
                                    <div key={custo.id} className="rounded-lg border border-border/50 p-4">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <p className="font-medium">{custo.descricao}</p>
                                                <Badge
                                                    variant="secondary"
                                                    className={categoriaColors[custo.categoria] || categoriaColors['Outros']}
                                                >
                                                    {custo.categoria}
                                                </Badge>
                                            </div>
                                            <p className="font-medium text-red-600">
                                                {formatCurrency(custo.valor)}
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                            <span>{formatDate(custo.data)}</span>
                                            <span>{custo.recorrente ? 'Recorrente' : 'Único'}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Cost Form Dialog */}
            <Dialog open={showForm} onOpenChange={(o) => !o && setShowForm(false)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{editingCusto ? 'Editar Custo' : 'Novo Custo'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="custo-descricao">Descrição *</Label>
                            <Input
                                id="custo-descricao"
                                value={form.descricao}
                                onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                                placeholder="Ex: Canva Pro"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label htmlFor="custo-valor">Valor (R$) *</Label>
                                <Input
                                    id="custo-valor"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={form.valor}
                                    onChange={(e) => setForm({ ...form, valor: parseFloat(e.target.value) || 0 })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Categoria</Label>
                                <Select
                                    value={form.categoria}
                                    onValueChange={(val) => setForm({ ...form, categoria: val })}
                                >
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {categorias.map((cat) => (
                                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="custo-data">Data *</Label>
                            <Input
                                id="custo-data"
                                type="date"
                                value={form.data}
                                onChange={(e) => setForm({ ...form, data: e.target.value })}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="custo-recorrente"
                                checked={form.recorrente}
                                onCheckedChange={(checked) => setForm({ ...form, recorrente: !!checked })}
                            />
                            <Label htmlFor="custo-recorrente" className="text-sm">
                                Custo recorrente (mensal)
                            </Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
                        <Button onClick={handleSave}>Salvar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Excluir custo?</DialogTitle>
                        <DialogDescription>Esta ação não pode ser desfeita.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteId(null)}>Cancelar</Button>
                        <Button variant="destructive" onClick={handleDelete}>Excluir</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
