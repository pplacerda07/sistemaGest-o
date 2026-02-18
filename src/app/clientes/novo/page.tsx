'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ClienteForm from '@/components/clientes/ClienteForm';
import { useData } from '@/lib/data-store';
import { ClienteFormData } from '@/types';
import { toast } from 'sonner';

export default function NovoClientePage() {
    const router = useRouter();
    const { addCliente } = useData();

    const handleSubmit = (data: ClienteFormData) => {
        addCliente({
            ...data,
            email: data.email || '',
            telefone: data.telefone || '',
            data_inicio: data.data_inicio || new Date().toISOString().split('T')[0],
            observacoes: data.observacoes || '',
        });
        toast.success('Cliente criado com sucesso!');
        router.push('/clientes');
    };

    return (
        <div className="max-w-3xl mx-auto">
            <Card className="border-border/50 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-xl font-bold">Novo Cliente</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Preencha os dados do novo cliente
                    </p>
                </CardHeader>
                <CardContent>
                    <ClienteForm
                        onSubmit={handleSubmit}
                        onCancel={() => router.push('/clientes')}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
