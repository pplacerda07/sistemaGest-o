// ========================================
// Tipos do Sistema de Gestão de Clientes
// ========================================

// Enums
export type TipoContrato = 'contrato_fixo' | 'freelance';
export type StatusCliente = 'ativo' | 'pausado' | 'encerrado';
export type CategoriaCliente = 'trafego' | 'criacao_conteudo' | 'freela';
export type StatusTarefa = 'a_fazer' | 'em_andamento' | 'concluida';
export type Prioridade = 'baixa' | 'media' | 'alta';

// Tabela: clientes
export interface Cliente {
    id: string;
    nome: string;
    email: string;
    telefone: string;
    servico: string;
    valor_mensal: number;
    tipo_contrato: TipoContrato;
    categoria: CategoriaCliente;
    data_inicio: string;
    status: StatusCliente;
    observacoes: string;
    created_at: string;
}

// Tabela: tarefas
export interface Tarefa {
    id: string;
    cliente_id: string;
    titulo: string;
    descricao: string;
    status: StatusTarefa;
    prioridade: Prioridade;
    prazo: string;
    created_at: string;
    completed_at: string | null;
}

// Tabela: anotacoes
export interface Anotacao {
    id: string;
    cliente_id: string;
    titulo: string;
    conteudo: string;
    created_at: string;
}

// Tabela: anexos
export interface Anexo {
    id: string;
    cliente_id: string;
    nome_arquivo: string;
    url: string;
    tipo: string;
    tamanho: number;
    created_at: string;
}

// Tabela: custos_operacionais
export interface CustoOperacional {
    id: string;
    descricao: string;
    valor: number;
    categoria: string;
    data: string;
    recorrente: boolean;
    created_at: string;
}

// Form types
export interface ClienteFormData {
    nome: string;
    email: string;
    telefone: string;
    servico: string;
    valor_mensal: number;
    tipo_contrato: TipoContrato;
    categoria: CategoriaCliente;
    data_inicio: string;
    status: StatusCliente;
    observacoes: string;
}

export interface TarefaFormData {
    titulo: string;
    descricao: string;
    cliente_id: string;
    status: StatusTarefa;
    prioridade: Prioridade;
    prazo: string;
}

export interface CustoFormData {
    descricao: string;
    valor: number;
    categoria: string;
    data: string;
    recorrente: boolean;
}

export interface AnotacaoFormData {
    titulo: string;
    conteudo: string;
    cliente_id: string;
}

// Revenue data for charts
export interface RevenueData {
    month: string;
    receita: number;
    custos: number;
    lucro: number;
}

// ========================================
// Projetos - Workspace Notion-like
// ========================================

export type BlockType = 'heading1' | 'heading2' | 'heading3' | 'text' | 'checklist' | 'code' | 'quote' | 'divider' | 'file';

export interface Block {
    id: string;
    type: BlockType;
    content: string;
    checked?: boolean; // for checklist
    language?: string; // for code blocks
    fileName?: string; // for file blocks
    fileSize?: number;
}

export interface ProjetoPage {
    id: string;
    projeto_id: string;
    titulo: string;
    emoji: string;
    blocks: Block[];
    created_at: string;
    updated_at: string;
}

export interface Projeto {
    id: string;
    nome: string;
    descricao: string;
    emoji: string;
    cor: string;
    created_at: string;
}
