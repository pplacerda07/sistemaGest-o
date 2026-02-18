// ========================================
// Dados iniciais (sistema limpo)
// ========================================

import { Cliente, Tarefa, Anotacao, Anexo, CustoOperacional, Projeto, ProjetoPage } from '@/types';

export const mockClientes: Cliente[] = [];

export const mockTarefas: Tarefa[] = [];

export const mockAnotacoes: Anotacao[] = [];

export const mockAnexos: Anexo[] = [];

export const mockCustos: CustoOperacional[] = [];

// Dados de receita mensal para gráficos
export const mockRevenueData: { month: string; receita: number; custos: number; lucro: number }[] = [];

// Dados do heatmap de produtividade
export function generateHeatmapData(): Record<string, number> {
    return {};
}

// ========================================
// Projetos - Workspace Notion-like
// ========================================

export const mockProjetos: Projeto[] = [];

export const mockProjetoPages: ProjetoPage[] = [];
