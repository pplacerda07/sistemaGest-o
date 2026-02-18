'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { ClienteFormData } from '@/types';

// Schema de validação com Zod
const clienteSchema = z.object({
    nome: z.string().min(1, 'Nome é obrigatório'),
    email: z.string().email('Email inválido').or(z.literal('')).default(''),
    telefone: z.string().default(''),
    servico: z.string().min(1, 'Serviço é obrigatório'),
    valor_mensal: z.coerce.number().min(0.01, 'Valor deve ser maior que zero'),
    tipo_contrato: z.enum(['contrato_fixo', 'freelance']),
    categoria: z.enum(['trafego', 'criacao_conteudo', 'freela']),
    data_inicio: z.string().default(''),
    status: z.enum(['ativo', 'pausado', 'encerrado']),
    observacoes: z.string().default(''),
});

type ClienteSchemaType = z.infer<typeof clienteSchema>;

interface ClienteFormProps {
    defaultValues?: Partial<ClienteFormData>;
    onSubmit: (data: ClienteFormData) => void;
    onCancel: () => void;
    isEditing?: boolean;
}

export default function ClienteForm({
    defaultValues,
    onSubmit,
    onCancel,
    isEditing = false,
}: ClienteFormProps) {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<ClienteFormData>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(clienteSchema) as any,
        defaultValues: {
            nome: '',
            email: '',
            telefone: '',
            servico: '',
            valor_mensal: 0,
            tipo_contrato: 'contrato_fixo',
            categoria: 'trafego',
            data_inicio: new Date().toISOString().split('T')[0],
            status: 'ativo',
            observacoes: '',
            ...defaultValues,
        },
    });

    const tipoContrato = watch('tipo_contrato');
    const categoria = watch('categoria');
    const status = watch('status');

    // Máscara de telefone
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);

        if (value.length > 7) {
            value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
        } else if (value.length > 2) {
            value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
        } else if (value.length > 0) {
            value = `(${value}`;
        }

        setValue('telefone', value);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
                {/* Nome */}
                <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="nome">Nome *</Label>
                    <Input
                        id="nome"
                        placeholder="Nome do cliente ou empresa"
                        {...register('nome')}
                        aria-invalid={!!errors.nome}
                    />
                    {errors.nome && (
                        <p className="text-sm text-red-500">{errors.nome.message}</p>
                    )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="email@exemplo.com"
                        {...register('email')}
                    />
                    {errors.email && (
                        <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                </div>

                {/* Telefone */}
                <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                        id="telefone"
                        placeholder="(XX) XXXXX-XXXX"
                        {...register('telefone')}
                        onChange={handlePhoneChange}
                    />
                </div>

                {/* Serviço */}
                <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="servico">Serviço *</Label>
                    <Input
                        id="servico"
                        placeholder="Ex: Gestão de Redes Sociais, Tráfego Pago..."
                        {...register('servico')}
                        aria-invalid={!!errors.servico}
                    />
                    {errors.servico && (
                        <p className="text-sm text-red-500">{errors.servico.message}</p>
                    )}
                </div>

                {/* Valor Mensal */}
                <div className="space-y-2">
                    <Label htmlFor="valor_mensal">Valor Mensal (R$) *</Label>
                    <Input
                        id="valor_mensal"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0,00"
                        {...register('valor_mensal')}
                        aria-invalid={!!errors.valor_mensal}
                    />
                    {errors.valor_mensal && (
                        <p className="text-sm text-red-500">{errors.valor_mensal.message}</p>
                    )}
                </div>

                {/* Data Início */}
                <div className="space-y-2">
                    <Label htmlFor="data_inicio">Data de Início</Label>
                    <Input
                        id="data_inicio"
                        type="date"
                        {...register('data_inicio')}
                    />
                </div>

                {/* Tipo de Contrato */}
                <div className="space-y-2">
                    <Label>Tipo de Contrato *</Label>
                    <Select
                        value={tipoContrato}
                        onValueChange={(val) =>
                            setValue('tipo_contrato', val as 'contrato_fixo' | 'freelance')
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="contrato_fixo">Contrato Fixo</SelectItem>
                            <SelectItem value="freelance">Freelance</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Categoria */}
                <div className="space-y-2">
                    <Label>Categoria *</Label>
                    <Select
                        value={categoria}
                        onValueChange={(val) =>
                            setValue('categoria', val as 'trafego' | 'criacao_conteudo' | 'freela')
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="trafego">Tráfego</SelectItem>
                            <SelectItem value="criacao_conteudo">Criação de Conteúdo</SelectItem>
                            <SelectItem value="freela">Freela</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Status */}
                <div className="space-y-2">
                    <Label>Status *</Label>
                    <Select
                        value={status}
                        onValueChange={(val) =>
                            setValue('status', val as 'ativo' | 'pausado' | 'encerrado')
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ativo">Ativo</SelectItem>
                            <SelectItem value="pausado">Pausado</SelectItem>
                            <SelectItem value="encerrado">Encerrado</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Observações */}
                <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="observacoes">Observações</Label>
                    <Textarea
                        id="observacoes"
                        placeholder="Anotações relevantes sobre o cliente..."
                        rows={4}
                        {...register('observacoes')}
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Salvando...' : isEditing ? 'Salvar Alterações' : 'Criar Cliente'}
                </Button>
            </div>
        </form>
    );
}
