'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ClienteTable from '@/components/clientes/ClienteTable';
import { useData } from '@/lib/data-store';
import { formatCurrency } from '@/lib/utils';
import { Plus, Search, Megaphone, Palette, Briefcase, ChevronDown, ChevronRight } from 'lucide-react';
import { CategoriaCliente } from '@/types';

const categoriaConfig: Record<CategoriaCliente, {
    label: string;
    icon: React.ElementType;
    gradient: string;
    iconColor: string;
    badgeBg: string;
    description: string;
}> = {
    trafego: {
        label: 'Tráfego',
        icon: Megaphone,
        gradient: 'from-orange-500 to-red-500',
        iconColor: 'text-orange-600',
        badgeBg: 'bg-orange-100 text-orange-700',
        description: 'Google Ads, Meta Ads, tráfego pago em geral',
    },
    criacao_conteudo: {
        label: 'Criação de Conteúdo',
        icon: Palette,
        gradient: 'from-violet-500 to-purple-500',
        iconColor: 'text-violet-600',
        badgeBg: 'bg-violet-100 text-violet-700',
        description: 'Redes sociais, design, vídeo, email marketing',
    },
    freela: {
        label: 'Freela',
        icon: Briefcase,
        gradient: 'from-emerald-500 to-teal-500',
        iconColor: 'text-emerald-600',
        badgeBg: 'bg-emerald-100 text-emerald-700',
        description: 'Projetos pontuais e trabalhos freelance',
    },
};

const categorias: CategoriaCliente[] = ['trafego', 'criacao_conteudo', 'freela'];

export default function ClientesPage() {
    const { clientes } = useData();
    const [search, setSearch] = useState('');
    const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

    const toggleSection = (cat: string) => {
        setCollapsedSections((prev) => ({ ...prev, [cat]: !prev[cat] }));
    };

    // Filtrar por busca
    const filteredClientes = useMemo(() => {
        if (search === '') return clientes;
        return clientes.filter(
            (c) =>
                c.nome.toLowerCase().includes(search.toLowerCase()) ||
                c.servico.toLowerCase().includes(search.toLowerCase())
        );
    }, [clientes, search]);

    // Agrupar por categoria
    const clientesPorCategoria = useMemo(() => {
        const grouped: Record<CategoriaCliente, typeof filteredClientes> = {
            trafego: [],
            criacao_conteudo: [],
            freela: [],
        };
        filteredClientes.forEach((c) => {
            if (grouped[c.categoria]) {
                grouped[c.categoria].push(c);
            }
        });
        return grouped;
    }, [filteredClientes]);

    // Stats totais
    const totalClientes = clientes.length;
    const totalAtivos = clientes.filter((c) => c.status === 'ativo').length;
    const totalReceita = clientes
        .filter((c) => c.status === 'ativo')
        .reduce((sum, c) => sum + c.valor_mensal, 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Meus Clientes</h1>
                    <p className="text-muted-foreground">
                        {totalClientes} clientes · {totalAtivos} ativos · {formatCurrency(totalReceita)}/mês
                    </p>
                </div>
                <Link href="/clientes/novo">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Novo Cliente
                    </Button>
                </Link>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Buscar por nome ou serviço..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                    aria-label="Buscar clientes"
                />
            </div>

            {/* Category Sections */}
            {categorias.map((cat) => {
                const config = categoriaConfig[cat];
                const clientesCat = clientesPorCategoria[cat];
                const isCollapsed = collapsedSections[cat];
                const Icon = config.icon;
                const ativos = clientesCat.filter((c) => c.status === 'ativo');
                const receitaCat = ativos.reduce((sum, c) => sum + c.valor_mensal, 0);

                return (
                    <Card key={cat} className="overflow-hidden border-border/60">
                        {/* Section Header */}
                        <CardHeader
                            className="cursor-pointer select-none hover:bg-muted/40 transition-colors py-4"
                            onClick={() => toggleSection(cat)}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${config.gradient} text-white`}>
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            {config.label}
                                            <Badge variant="secondary" className="text-xs font-normal">
                                                {clientesCat.length} {clientesCat.length === 1 ? 'cliente' : 'clientes'}
                                            </Badge>
                                        </CardTitle>
                                        <p className="text-sm text-muted-foreground">{config.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    {ativos.length > 0 && (
                                        <span className="text-sm font-medium text-muted-foreground hidden sm:block">
                                            {formatCurrency(receitaCat)}/mês
                                        </span>
                                    )}
                                    {isCollapsed ? (
                                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                    )}
                                </div>
                            </div>
                        </CardHeader>

                        {/* Section Content */}
                        {!isCollapsed && (
                            <CardContent className="pt-0 pb-2">
                                {clientesCat.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-8 text-center">
                                        <Icon className={`h-10 w-10 mb-3 ${config.iconColor} opacity-40`} />
                                        <p className="text-sm text-muted-foreground mb-2">
                                            Nenhum cliente em {config.label.toLowerCase()}
                                        </p>
                                        <Link href="/clientes/novo">
                                            <Button variant="outline" size="sm" className="gap-1">
                                                <Plus className="h-3.5 w-3.5" />
                                                Adicionar
                                            </Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <ClienteTable clientes={clientesCat} />
                                )}
                            </CardContent>
                        )}
                    </Card>
                );
            })}
        </div>
    );
}
