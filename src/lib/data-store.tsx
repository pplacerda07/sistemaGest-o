'use client';
// ========================================
// Data Store - Context para gerenciar estado da aplicação
// Substitui Supabase durante a fase de demonstração
// ========================================

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Cliente, Tarefa, Anotacao, Anexo, CustoOperacional, Projeto, ProjetoPage, Block } from '@/types';
import {
    mockClientes,
    mockTarefas,
    mockAnotacoes,
    mockAnexos,
    mockCustos,
    mockProjetos,
    mockProjetoPages,
} from '@/lib/mock-data';
import { generateId } from '@/lib/utils';

interface DataContextType {
    // Clientes
    clientes: Cliente[];
    addCliente: (cliente: Omit<Cliente, 'id' | 'created_at'>) => void;
    updateCliente: (id: string, data: Partial<Cliente>) => void;
    deleteCliente: (id: string) => void;
    getCliente: (id: string) => Cliente | undefined;

    // Tarefas
    tarefas: Tarefa[];
    addTarefa: (tarefa: Omit<Tarefa, 'id' | 'created_at' | 'completed_at'>) => void;
    updateTarefa: (id: string, data: Partial<Tarefa>) => void;
    deleteTarefa: (id: string) => void;
    toggleTarefa: (id: string) => void;

    // Anotações
    anotacoes: Anotacao[];
    addAnotacao: (anotacao: Omit<Anotacao, 'id' | 'created_at'>) => void;
    updateAnotacao: (id: string, data: Partial<Anotacao>) => void;
    deleteAnotacao: (id: string) => void;

    // Anexos
    anexos: Anexo[];
    addAnexo: (anexo: Omit<Anexo, 'id' | 'created_at'>) => void;
    deleteAnexo: (id: string) => void;

    // Custos
    custos: CustoOperacional[];
    addCusto: (custo: Omit<CustoOperacional, 'id' | 'created_at'>) => void;
    updateCusto: (id: string, data: Partial<CustoOperacional>) => void;
    deleteCusto: (id: string) => void;

    // Projetos
    projetos: Projeto[];
    addProjeto: (projeto: Omit<Projeto, 'id' | 'created_at'>) => void;
    updateProjeto: (id: string, data: Partial<Projeto>) => void;
    deleteProjeto: (id: string) => void;
    getProjeto: (id: string) => Projeto | undefined;

    // Projeto Pages
    projetoPages: ProjetoPage[];
    addProjetoPage: (page: Omit<ProjetoPage, 'id' | 'created_at' | 'updated_at'>) => void;
    updateProjetoPage: (id: string, data: Partial<ProjetoPage>) => void;
    deleteProjetoPage: (id: string) => void;
    updatePageBlocks: (pageId: string, blocks: Block[]) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
    const [clientes, setClientes] = useState<Cliente[]>(mockClientes);
    const [tarefas, setTarefas] = useState<Tarefa[]>(mockTarefas);
    const [anotacoes, setAnotacoes] = useState<Anotacao[]>(mockAnotacoes);
    const [anexos, setAnexos] = useState<Anexo[]>(mockAnexos);
    const [custos, setCustos] = useState<CustoOperacional[]>(mockCustos);
    const [projetos, setProjetos] = useState<Projeto[]>(mockProjetos);
    const [projetoPages, setProjetoPages] = useState<ProjetoPage[]>(mockProjetoPages);

    // === CLIENTES ===
    const addCliente = useCallback((data: Omit<Cliente, 'id' | 'created_at'>) => {
        const newCliente: Cliente = {
            ...data,
            id: generateId(),
            created_at: new Date().toISOString(),
        };
        setClientes((prev) => [newCliente, ...prev]);
    }, []);

    const updateCliente = useCallback((id: string, data: Partial<Cliente>) => {
        setClientes((prev) =>
            prev.map((c) => (c.id === id ? { ...c, ...data } : c))
        );
    }, []);

    const deleteCliente = useCallback((id: string) => {
        setClientes((prev) => prev.filter((c) => c.id !== id));
        setTarefas((prev) => prev.filter((t) => t.cliente_id !== id));
        setAnotacoes((prev) => prev.filter((a) => a.cliente_id !== id));
        setAnexos((prev) => prev.filter((a) => a.cliente_id !== id));
    }, []);

    const getCliente = useCallback(
        (id: string) => clientes.find((c) => c.id === id),
        [clientes]
    );

    // === TAREFAS ===
    const addTarefa = useCallback(
        (data: Omit<Tarefa, 'id' | 'created_at' | 'completed_at'>) => {
            const newTarefa: Tarefa = {
                ...data,
                id: generateId(),
                created_at: new Date().toISOString(),
                completed_at: null,
            };
            setTarefas((prev) => [newTarefa, ...prev]);
        },
        []
    );

    const updateTarefa = useCallback((id: string, data: Partial<Tarefa>) => {
        setTarefas((prev) =>
            prev.map((t) => (t.id === id ? { ...t, ...data } : t))
        );
    }, []);

    const deleteTarefa = useCallback((id: string) => {
        setTarefas((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const toggleTarefa = useCallback((id: string) => {
        setTarefas((prev) =>
            prev.map((t) => {
                if (t.id !== id) return t;
                if (t.status === 'concluida') {
                    return { ...t, status: 'a_fazer' as const, completed_at: null };
                }
                return {
                    ...t,
                    status: 'concluida' as const,
                    completed_at: new Date().toISOString(),
                };
            })
        );
    }, []);

    // === ANOTAÇÕES ===
    const addAnotacao = useCallback(
        (data: Omit<Anotacao, 'id' | 'created_at'>) => {
            const newAnotacao: Anotacao = {
                ...data,
                id: generateId(),
                created_at: new Date().toISOString(),
            };
            setAnotacoes((prev) => [newAnotacao, ...prev]);
        },
        []
    );

    const updateAnotacao = useCallback((id: string, data: Partial<Anotacao>) => {
        setAnotacoes((prev) =>
            prev.map((a) => (a.id === id ? { ...a, ...data } : a))
        );
    }, []);

    const deleteAnotacao = useCallback((id: string) => {
        setAnotacoes((prev) => prev.filter((a) => a.id !== id));
    }, []);

    // === ANEXOS ===
    const addAnexo = useCallback((data: Omit<Anexo, 'id' | 'created_at'>) => {
        const newAnexo: Anexo = {
            ...data,
            id: generateId(),
            created_at: new Date().toISOString(),
        };
        setAnexos((prev) => [newAnexo, ...prev]);
    }, []);

    const deleteAnexo = useCallback((id: string) => {
        setAnexos((prev) => prev.filter((a) => a.id !== id));
    }, []);

    // === CUSTOS ===
    const addCusto = useCallback(
        (data: Omit<CustoOperacional, 'id' | 'created_at'>) => {
            const newCusto: CustoOperacional = {
                ...data,
                id: generateId(),
                created_at: new Date().toISOString(),
            };
            setCustos((prev) => [newCusto, ...prev]);
        },
        []
    );

    const updateCusto = useCallback(
        (id: string, data: Partial<CustoOperacional>) => {
            setCustos((prev) =>
                prev.map((c) => (c.id === id ? { ...c, ...data } : c))
            );
        },
        []
    );

    const deleteCusto = useCallback((id: string) => {
        setCustos((prev) => prev.filter((c) => c.id !== id));
    }, []);

    // === PROJETOS ===
    const addProjeto = useCallback((data: Omit<Projeto, 'id' | 'created_at'>) => {
        const newProjeto: Projeto = {
            ...data,
            id: generateId(),
            created_at: new Date().toISOString(),
        };
        setProjetos((prev) => [newProjeto, ...prev]);
    }, []);

    const updateProjeto = useCallback((id: string, data: Partial<Projeto>) => {
        setProjetos((prev) =>
            prev.map((p) => (p.id === id ? { ...p, ...data } : p))
        );
    }, []);

    const deleteProjeto = useCallback((id: string) => {
        setProjetos((prev) => prev.filter((p) => p.id !== id));
        setProjetoPages((prev) => prev.filter((pp) => pp.projeto_id !== id));
    }, []);

    const getProjeto = useCallback(
        (id: string) => projetos.find((p) => p.id === id),
        [projetos]
    );

    // === PROJETO PAGES ===
    const addProjetoPage = useCallback(
        (data: Omit<ProjetoPage, 'id' | 'created_at' | 'updated_at'>) => {
            const now = new Date().toISOString();
            const newPage: ProjetoPage = {
                ...data,
                id: generateId(),
                created_at: now,
                updated_at: now,
            };
            setProjetoPages((prev) => [...prev, newPage]);
        },
        []
    );

    const updateProjetoPage = useCallback((id: string, data: Partial<ProjetoPage>) => {
        setProjetoPages((prev) =>
            prev.map((pp) =>
                pp.id === id ? { ...pp, ...data, updated_at: new Date().toISOString() } : pp
            )
        );
    }, []);

    const deleteProjetoPage = useCallback((id: string) => {
        setProjetoPages((prev) => prev.filter((pp) => pp.id !== id));
    }, []);

    const updatePageBlocks = useCallback((pageId: string, blocks: Block[]) => {
        setProjetoPages((prev) =>
            prev.map((pp) =>
                pp.id === pageId
                    ? { ...pp, blocks, updated_at: new Date().toISOString() }
                    : pp
            )
        );
    }, []);

    return (
        <DataContext.Provider
            value={{
                clientes,
                addCliente,
                updateCliente,
                deleteCliente,
                getCliente,
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
                custos,
                addCusto,
                updateCusto,
                deleteCusto,
                projetos,
                addProjeto,
                updateProjeto,
                deleteProjeto,
                getProjeto,
                projetoPages,
                addProjetoPage,
                updateProjetoPage,
                deleteProjetoPage,
                updatePageBlocks,
            }}
        >
            {children}
        </DataContext.Provider>
    );
}

export function useData() {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
}
