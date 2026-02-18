'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useData } from '@/lib/data-store';
import { formatCurrency, getInitials } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

export default function RecentClients() {
    const { clientes } = useData();

    // Últimos 5 clientes por data de criação
    const recentClientes = [...clientes]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);

    return (
        <Card className="border-border/50 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-lg font-semibold">Clientes Recentes</CardTitle>
                    <p className="text-sm text-muted-foreground">Últimos adicionados</p>
                </div>
                <Link href="/clientes">
                    <Button variant="ghost" size="sm" className="gap-1 text-blue-600 hover:text-blue-700">
                        Ver todos
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </Link>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {recentClientes.map((cliente) => (
                        <Link
                            key={cliente.id}
                            href={`/clientes/${cliente.id}`}
                            className="flex items-center gap-4 rounded-lg p-3 hover:bg-muted/50 transition-colors"
                        >
                            {/* Avatar */}
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm font-medium">
                                {getInitials(cliente.nome)}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{cliente.nome}</p>
                                <p className="text-xs text-muted-foreground truncate">
                                    {cliente.servico}
                                </p>
                            </div>

                            {/* Value & Type */}
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium hidden sm:inline">
                                    {formatCurrency(cliente.valor_mensal)}
                                </span>
                                <Badge
                                    variant={cliente.tipo_contrato === 'contrato_fixo' ? 'default' : 'secondary'}
                                    className={
                                        cliente.tipo_contrato === 'contrato_fixo'
                                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                                            : 'bg-blue-100 text-blue-700 hover:bg-blue-100'
                                    }
                                >
                                    {cliente.tipo_contrato === 'contrato_fixo' ? 'Fixo' : 'Freelance'}
                                </Badge>
                            </div>
                        </Link>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
