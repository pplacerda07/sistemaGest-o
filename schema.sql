-- ========================================
-- Schema do Banco de Dados - Sistema de Gestão de Clientes
-- Compatível com Supabase (PostgreSQL)
-- ========================================

-- ========================================
-- Habilitar extensões necessárias
-- ========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- Tipos ENUM
-- ========================================
CREATE TYPE tipo_contrato AS ENUM ('contrato_fixo', 'freelance');
CREATE TYPE status_cliente AS ENUM ('ativo', 'pausado', 'encerrado');
CREATE TYPE categoria_cliente AS ENUM ('trafego', 'criacao_conteudo', 'freela');
CREATE TYPE status_tarefa AS ENUM ('a_fazer', 'em_andamento', 'concluida');
CREATE TYPE prioridade AS ENUM ('baixa', 'media', 'alta');
CREATE TYPE block_type AS ENUM ('heading1', 'heading2', 'heading3', 'text', 'checklist', 'code', 'quote', 'divider', 'file');

-- ========================================
-- Tabela: clientes
-- ========================================
CREATE TABLE clientes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefone VARCHAR(30) NOT NULL,
    servico VARCHAR(255) NOT NULL,
    valor_mensal DECIMAL(10, 2) NOT NULL DEFAULT 0,
    tipo_contrato tipo_contrato NOT NULL DEFAULT 'contrato_fixo',
    categoria categoria_cliente NOT NULL DEFAULT 'trafego',
    data_inicio DATE NOT NULL,
    status status_cliente NOT NULL DEFAULT 'ativo',
    observacoes TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ========================================
-- Tabela: tarefas
-- ========================================
CREATE TABLE tarefas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT DEFAULT '',
    status status_tarefa NOT NULL DEFAULT 'a_fazer',
    prioridade prioridade NOT NULL DEFAULT 'media',
    prazo DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ DEFAULT NULL
);

-- ========================================
-- Tabela: anotacoes
-- ========================================
CREATE TABLE anotacoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    titulo VARCHAR(255) NOT NULL,
    conteudo TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ========================================
-- Tabela: anexos
-- ========================================
CREATE TABLE anexos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    nome_arquivo VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    tipo VARCHAR(100) NOT NULL,
    tamanho BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ========================================
-- Tabela: custos_operacionais
-- ========================================
CREATE TABLE custos_operacionais (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    descricao VARCHAR(255) NOT NULL,
    valor DECIMAL(10, 2) NOT NULL DEFAULT 0,
    categoria VARCHAR(100) NOT NULL,
    data DATE NOT NULL,
    recorrente BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ========================================
-- Tabela: projetos
-- ========================================
CREATE TABLE projetos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    descricao TEXT DEFAULT '',
    emoji VARCHAR(10) DEFAULT '📁',
    cor VARCHAR(20) DEFAULT '#3B82F6',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ========================================
-- Tabela: projeto_pages
-- ========================================
CREATE TABLE projeto_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    projeto_id UUID NOT NULL REFERENCES projetos(id) ON DELETE CASCADE,
    titulo VARCHAR(255) NOT NULL,
    emoji VARCHAR(10) DEFAULT '📄',
    blocks JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ========================================
-- Índices para performance
-- ========================================

-- Tarefas: busca por cliente e por status
CREATE INDEX idx_tarefas_cliente_id ON tarefas(cliente_id);
CREATE INDEX idx_tarefas_status ON tarefas(status);
CREATE INDEX idx_tarefas_prioridade ON tarefas(prioridade);
CREATE INDEX idx_tarefas_prazo ON tarefas(prazo);

-- Anotações: busca por cliente
CREATE INDEX idx_anotacoes_cliente_id ON anotacoes(cliente_id);

-- Anexos: busca por cliente
CREATE INDEX idx_anexos_cliente_id ON anexos(cliente_id);

-- Clientes: busca por status e categoria
CREATE INDEX idx_clientes_status ON clientes(status);
CREATE INDEX idx_clientes_categoria ON clientes(categoria);

-- Custos: busca por data e categoria
CREATE INDEX idx_custos_data ON custos_operacionais(data);
CREATE INDEX idx_custos_categoria ON custos_operacionais(categoria);
CREATE INDEX idx_custos_recorrente ON custos_operacionais(recorrente);

-- Projeto Pages: busca por projeto
CREATE INDEX idx_projeto_pages_projeto_id ON projeto_pages(projeto_id);

-- ========================================
-- Trigger: atualizar updated_at automaticamente em projeto_pages
-- ========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_projeto_pages_updated_at
    BEFORE UPDATE ON projeto_pages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- Row Level Security (RLS) - Supabase
-- Habilitado mas sem políticas restritivas
-- (configurar conforme necessidade de autenticação)
-- ========================================
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tarefas ENABLE ROW LEVEL SECURITY;
ALTER TABLE anotacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE anexos ENABLE ROW LEVEL SECURITY;
ALTER TABLE custos_operacionais ENABLE ROW LEVEL SECURITY;
ALTER TABLE projetos ENABLE ROW LEVEL SECURITY;
ALTER TABLE projeto_pages ENABLE ROW LEVEL SECURITY;

-- Políticas permissivas (acesso total - ajustar quando houver auth)
CREATE POLICY "Acesso total clientes" ON clientes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso total tarefas" ON tarefas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso total anotacoes" ON anotacoes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso total anexos" ON anexos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso total custos" ON custos_operacionais FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso total projetos" ON projetos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso total projeto_pages" ON projeto_pages FOR ALL USING (true) WITH CHECK (true);
