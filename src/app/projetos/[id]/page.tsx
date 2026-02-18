'use client';

import React, { useState, useMemo, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useData } from '@/lib/data-store';
import { generateId } from '@/lib/utils';
import { Block, BlockType } from '@/types';
import {
    Plus,
    ArrowLeft,
    Trash2,
    GripVertical,
    Type,
    Heading1,
    Heading2,
    Heading3,
    CheckSquare,
    Code,
    Quote,
    Minus,
    FileUp,
    ChevronDown,
} from 'lucide-react';
import { toast } from 'sonner';

// Block type menu items
const blockTypes: { type: BlockType; label: string; icon: React.ElementType; description: string }[] = [
    { type: 'heading1', label: 'Título 1', icon: Heading1, description: 'Título principal' },
    { type: 'heading2', label: 'Título 2', icon: Heading2, description: 'Subtítulo' },
    { type: 'heading3', label: 'Título 3', icon: Heading3, description: 'Sub-subtítulo' },
    { type: 'text', label: 'Texto', icon: Type, description: 'Parágrafo de texto' },
    { type: 'checklist', label: 'Checklist', icon: CheckSquare, description: 'Item com checkbox' },
    { type: 'code', label: 'Código', icon: Code, description: 'Bloco de código' },
    { type: 'quote', label: 'Citação', icon: Quote, description: 'Texto em destaque' },
    { type: 'divider', label: 'Divisor', icon: Minus, description: 'Linha separadora' },
    { type: 'file', label: 'Arquivo', icon: FileUp, description: 'Upload de arquivo' },
];

// Individual Block Renderer
function BlockEditor({
    block,
    onUpdate,
    onDelete,
    onAddBelow,
}: {
    block: Block;
    onUpdate: (updates: Partial<Block>) => void;
    onDelete: () => void;
    onAddBelow: () => void;
}) {
    const [showMenu, setShowMenu] = useState(false);

    const renderBlock = () => {
        switch (block.type) {
            case 'heading1':
                return (
                    <input
                        className="w-full bg-transparent text-2xl font-bold outline-none placeholder:text-muted-foreground/30"
                        value={block.content}
                        onChange={(e) => onUpdate({ content: e.target.value })}
                        placeholder="Título 1"
                    />
                );
            case 'heading2':
                return (
                    <input
                        className="w-full bg-transparent text-xl font-semibold outline-none placeholder:text-muted-foreground/30"
                        value={block.content}
                        onChange={(e) => onUpdate({ content: e.target.value })}
                        placeholder="Título 2"
                    />
                );
            case 'heading3':
                return (
                    <input
                        className="w-full bg-transparent text-lg font-medium outline-none placeholder:text-muted-foreground/30"
                        value={block.content}
                        onChange={(e) => onUpdate({ content: e.target.value })}
                        placeholder="Título 3"
                    />
                );
            case 'text':
                return (
                    <textarea
                        className="w-full bg-transparent text-sm leading-relaxed outline-none resize-none placeholder:text-muted-foreground/30 min-h-[24px]"
                        value={block.content}
                        onChange={(e) => {
                            onUpdate({ content: e.target.value });
                            // Auto-resize
                            e.target.style.height = 'auto';
                            e.target.style.height = e.target.scrollHeight + 'px';
                        }}
                        placeholder="Escreva algo..."
                        rows={1}
                        ref={(el) => {
                            if (el) {
                                el.style.height = 'auto';
                                el.style.height = el.scrollHeight + 'px';
                            }
                        }}
                    />
                );
            case 'checklist':
                return (
                    <div className="flex items-start gap-3">
                        <input
                            type="checkbox"
                            checked={block.checked || false}
                            onChange={(e) => onUpdate({ checked: e.target.checked })}
                            className="mt-1 h-4 w-4 rounded border-border accent-blue-500"
                        />
                        <input
                            className={`flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/30 ${block.checked ? 'line-through text-muted-foreground' : ''
                                }`}
                            value={block.content}
                            onChange={(e) => onUpdate({ content: e.target.value })}
                            placeholder="Item do checklist"
                        />
                    </div>
                );
            case 'code':
                return (
                    <div className="rounded-lg bg-black/30 border border-border/30 overflow-hidden">
                        <div className="flex items-center justify-between px-3 py-1.5 bg-white/5 border-b border-border/20">
                            <input
                                className="bg-transparent text-xs text-muted-foreground outline-none w-24"
                                value={block.language || ''}
                                onChange={(e) => onUpdate({ language: e.target.value })}
                                placeholder="linguagem"
                            />
                        </div>
                        <textarea
                            className="w-full bg-transparent text-sm font-mono p-3 outline-none resize-none min-h-[60px] text-emerald-400"
                            value={block.content}
                            onChange={(e) => {
                                onUpdate({ content: e.target.value });
                                e.target.style.height = 'auto';
                                e.target.style.height = e.target.scrollHeight + 'px';
                            }}
                            placeholder="// código aqui..."
                            ref={(el) => {
                                if (el) {
                                    el.style.height = 'auto';
                                    el.style.height = el.scrollHeight + 'px';
                                }
                            }}
                        />
                    </div>
                );
            case 'quote':
                return (
                    <div className="border-l-3 border-blue-500 pl-4 py-1">
                        <textarea
                            className="w-full bg-transparent text-sm italic text-muted-foreground outline-none resize-none placeholder:text-muted-foreground/30 min-h-[24px]"
                            value={block.content}
                            onChange={(e) => {
                                onUpdate({ content: e.target.value });
                                e.target.style.height = 'auto';
                                e.target.style.height = e.target.scrollHeight + 'px';
                            }}
                            placeholder="Citação..."
                            rows={1}
                            ref={(el) => {
                                if (el) {
                                    el.style.height = 'auto';
                                    el.style.height = el.scrollHeight + 'px';
                                }
                            }}
                        />
                    </div>
                );
            case 'divider':
                return <hr className="border-border/50 my-2" />;
            case 'file':
                return (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-border/30">
                        <FileUp className="h-5 w-5 text-blue-400 shrink-0" />
                        <div className="flex-1">
                            <input
                                className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground/30"
                                value={block.fileName || block.content}
                                onChange={(e) =>
                                    onUpdate({ fileName: e.target.value, content: e.target.value })
                                }
                                placeholder="Nome do arquivo..."
                            />
                            {block.fileSize && (
                                <p className="text-xs text-muted-foreground">
                                    {(block.fileSize / 1024).toFixed(0)} KB
                                </p>
                            )}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="group relative flex gap-1 py-0.5 -ml-12">
            {/* Drag handle + menu */}
            <div className="flex items-start gap-0.5 pt-1 opacity-0 group-hover:opacity-100 transition-opacity w-10 shrink-0">
                <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-0.5 rounded hover:bg-white/10 text-muted-foreground"
                    title="Adicionar bloco"
                >
                    <Plus className="h-4 w-4" />
                </button>
                <button className="p-0.5 rounded hover:bg-white/10 text-muted-foreground cursor-grab">
                    <GripVertical className="h-4 w-4" />
                </button>
            </div>

            {/* Block content */}
            <div className="flex-1 min-w-0">{renderBlock()}</div>

            {/* Delete */}
            {block.type !== 'divider' && (
                <button
                    onClick={onDelete}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-500/10 text-muted-foreground hover:text-red-400 self-start mt-1"
                    title="Excluir bloco"
                >
                    <Trash2 className="h-3.5 w-3.5" />
                </button>
            )}

            {/* Block type menu */}
            {showMenu && (
                <div className="absolute left-0 top-full z-50 mt-1 w-56 rounded-lg border border-border/50 bg-popover p-1 shadow-xl">
                    {blockTypes.map((bt) => (
                        <button
                            key={bt.type}
                            onClick={() => {
                                onAddBelow();
                                setShowMenu(false);
                            }}
                            className="flex items-center gap-3 w-full rounded-md px-3 py-2 text-sm hover:bg-white/5 transition-colors"
                        >
                            <bt.icon className="h-4 w-4 text-muted-foreground" />
                            <div className="text-left">
                                <p className="font-medium">{bt.label}</p>
                                <p className="text-xs text-muted-foreground">{bt.description}</p>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// Main Project Page
export default function ProjetoDetailPage() {
    const params = useParams();
    const router = useRouter();
    const projetoId = params.id as string;

    const {
        getProjeto,
        projetoPages,
        addProjetoPage,
        updateProjetoPage,
        deleteProjetoPage,
        updatePageBlocks,
    } = useData();

    const projeto = getProjeto(projetoId);
    const pages = useMemo(
        () => projetoPages.filter((pp) => pp.projeto_id === projetoId),
        [projetoPages, projetoId]
    );

    const [selectedPageId, setSelectedPageId] = useState<string | null>(
        pages.length > 0 ? pages[0].id : null
    );
    const [showNewPageDialog, setShowNewPageDialog] = useState(false);
    const [newPageTitle, setNewPageTitle] = useState('');
    const [newPageEmoji, setNewPageEmoji] = useState('📄');
    const [showBlockMenu, setShowBlockMenu] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const blockMenuRef = useRef<HTMLDivElement>(null);

    const selectedPage = useMemo(
        () => projetoPages.find((pp) => pp.id === selectedPageId),
        [projetoPages, selectedPageId]
    );

    const PAGE_EMOJIS = ['📄', '📊', '🎯', '🧠', '📋', '💡', '🔥', '⚡', '🏢', '✅', '📝', '🎨'];

    const handleCreatePage = () => {
        if (!newPageTitle.trim()) return;
        const newPage = {
            projeto_id: projetoId,
            titulo: newPageTitle.trim(),
            emoji: newPageEmoji,
            blocks: [
                { id: generateId(), type: 'heading1' as BlockType, content: newPageTitle.trim() },
                { id: generateId(), type: 'text' as BlockType, content: '' },
            ],
        };
        addProjetoPage(newPage);
        toast.success('Página criada!');
        setShowNewPageDialog(false);
        setNewPageTitle('');
        setNewPageEmoji('📄');
        // Select the newly created page
        setTimeout(() => {
            const latest = projetoPages.filter((pp) => pp.projeto_id === projetoId);
            if (latest.length > 0) {
                setSelectedPageId(latest[latest.length - 1].id);
            }
        }, 50);
    };

    const handleDeletePage = (pageId: string) => {
        deleteProjetoPage(pageId);
        if (selectedPageId === pageId) {
            const remaining = pages.filter((p) => p.id !== pageId);
            setSelectedPageId(remaining.length > 0 ? remaining[0].id : null);
        }
        toast.success('Página excluída!');
    };

    const handleUpdateBlock = useCallback(
        (blockId: string, updates: Partial<Block>) => {
            if (!selectedPage) return;
            const newBlocks = selectedPage.blocks.map((b) =>
                b.id === blockId ? { ...b, ...updates } : b
            );
            updatePageBlocks(selectedPage.id, newBlocks);
        },
        [selectedPage, updatePageBlocks]
    );

    const handleDeleteBlock = useCallback(
        (blockId: string) => {
            if (!selectedPage) return;
            const newBlocks = selectedPage.blocks.filter((b) => b.id !== blockId);
            updatePageBlocks(selectedPage.id, newBlocks);
        },
        [selectedPage, updatePageBlocks]
    );

    const handleAddBlock = useCallback(
        (afterBlockId: string | null, type: BlockType = 'text') => {
            if (!selectedPage) return;
            const newBlock: Block = {
                id: generateId(),
                type,
                content: '',
                ...(type === 'checklist' ? { checked: false } : {}),
                ...(type === 'code' ? { language: '' } : {}),
            };
            if (afterBlockId === null) {
                updatePageBlocks(selectedPage.id, [...selectedPage.blocks, newBlock]);
            } else {
                const idx = selectedPage.blocks.findIndex((b) => b.id === afterBlockId);
                const newBlocks = [...selectedPage.blocks];
                newBlocks.splice(idx + 1, 0, newBlock);
                updatePageBlocks(selectedPage.id, newBlocks);
            }
            setShowBlockMenu(false);
        },
        [selectedPage, updatePageBlocks]
    );

    if (!projeto) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <p className="text-muted-foreground mb-4">Projeto não encontrado</p>
                <Button variant="outline" onClick={() => router.push('/projetos')}>
                    Voltar aos projetos
                </Button>
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-5rem)] -m-4 md:-m-6 lg:-m-8">
            {/* Page Sidebar */}
            <div
                className={`border-r border-border/30 bg-sidebar/50 flex flex-col transition-all duration-200 ${sidebarCollapsed ? 'w-0 overflow-hidden' : 'w-64 min-w-[256px]'
                    }`}
            >
                {/* Project info */}
                <div className="p-4 border-b border-border/30">
                    <button
                        onClick={() => router.push('/projetos')}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Projetos
                    </button>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">{projeto.emoji}</span>
                        <h2 className="font-semibold text-sm line-clamp-2">{projeto.nome}</h2>
                    </div>
                </div>

                {/* Pages list */}
                <div className="flex-1 overflow-y-auto p-2">
                    <div className="flex items-center justify-between px-2 py-1 mb-1">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Páginas
                        </span>
                        <button
                            onClick={() => setShowNewPageDialog(true)}
                            className="p-1 rounded hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
                            title="Nova página"
                        >
                            <Plus className="h-3.5 w-3.5" />
                        </button>
                    </div>
                    {pages.map((page) => (
                        <div
                            key={page.id}
                            className="group flex items-center gap-2"
                        >
                            <button
                                onClick={() => setSelectedPageId(page.id)}
                                className={`flex-1 flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors text-left ${selectedPageId === page.id
                                        ? 'bg-blue-500/15 text-blue-400'
                                        : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                                    }`}
                            >
                                <span className="text-base shrink-0">{page.emoji}</span>
                                <span className="truncate">{page.titulo}</span>
                            </button>
                            <button
                                onClick={() => handleDeletePage(page.id)}
                                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-all shrink-0"
                                title="Excluir página"
                            >
                                <Trash2 className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                    {pages.length === 0 && (
                        <p className="text-xs text-muted-foreground text-center py-4">
                            Nenhuma página ainda
                        </p>
                    )}
                </div>
            </div>

            {/* Toggle sidebar */}
            <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1 rounded-r-md bg-card border border-l-0 border-border/30 text-muted-foreground hover:text-foreground transition-colors lg:hidden"
            >
                <ChevronDown
                    className={`h-4 w-4 transition-transform ${sidebarCollapsed ? '-rotate-90' : 'rotate-90'}`}
                />
            </button>

            {/* Editor Area */}
            <div className="flex-1 overflow-y-auto">
                {selectedPage ? (
                    <div className="max-w-3xl mx-auto px-8 py-8 pl-20">
                        {/* Page header */}
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-4xl">{selectedPage.emoji}</span>
                                <input
                                    className="text-3xl font-bold bg-transparent outline-none flex-1 placeholder:text-muted-foreground/30"
                                    value={selectedPage.titulo}
                                    onChange={(e) =>
                                        updateProjetoPage(selectedPage.id, {
                                            titulo: e.target.value,
                                        })
                                    }
                                    placeholder="Título da página"
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Última edição:{' '}
                                {new Date(selectedPage.updated_at).toLocaleDateString('pt-BR', {
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </p>
                        </div>

                        {/* Blocks */}
                        <div className="space-y-0.5">
                            {selectedPage.blocks.map((block) => (
                                <BlockEditor
                                    key={block.id}
                                    block={block}
                                    onUpdate={(updates) => handleUpdateBlock(block.id, updates)}
                                    onDelete={() => handleDeleteBlock(block.id)}
                                    onAddBelow={() => handleAddBlock(block.id)}
                                />
                            ))}
                        </div>

                        {/* Add block button */}
                        <div className="mt-4 relative" ref={blockMenuRef}>
                            <button
                                onClick={() => setShowBlockMenu(!showBlockMenu)}
                                className="flex items-center gap-2 text-sm text-muted-foreground/50 hover:text-muted-foreground transition-colors py-2"
                            >
                                <Plus className="h-4 w-4" />
                                Adicionar bloco
                            </button>

                            {showBlockMenu && (
                                <Card className="absolute left-0 top-full z-50 mt-1 w-64 p-1 shadow-xl border-border/50">
                                    {blockTypes.map((bt) => (
                                        <button
                                            key={bt.type}
                                            onClick={() => handleAddBlock(null, bt.type)}
                                            className="flex items-center gap-3 w-full rounded-md px-3 py-2 text-sm hover:bg-white/5 transition-colors"
                                        >
                                            <bt.icon className="h-4 w-4 text-muted-foreground" />
                                            <div className="text-left">
                                                <p className="font-medium">{bt.label}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {bt.description}
                                                </p>
                                            </div>
                                        </button>
                                    ))}
                                </Card>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <span className="text-6xl mb-4">{projeto.emoji}</span>
                        <h3 className="text-lg font-semibold mb-2">{projeto.nome}</h3>
                        <p className="text-muted-foreground mb-4">
                            {pages.length === 0
                                ? 'Crie sua primeira página para começar'
                                : 'Selecione uma página para editar'}
                        </p>
                        <Button onClick={() => setShowNewPageDialog(true)} className="gap-2">
                            <Plus className="h-4 w-4" />
                            Nova Página
                        </Button>
                    </div>
                )}
            </div>

            {/* New Page Dialog */}
            <Dialog open={showNewPageDialog} onOpenChange={setShowNewPageDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Nova Página</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Título</Label>
                            <Input
                                placeholder="Nome da página..."
                                value={newPageTitle}
                                onChange={(e) => setNewPageTitle(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Emoji</Label>
                            <div className="flex flex-wrap gap-2">
                                {PAGE_EMOJIS.map((emoji) => (
                                    <button
                                        key={emoji}
                                        type="button"
                                        onClick={() => setNewPageEmoji(emoji)}
                                        className={`text-2xl p-1.5 rounded-lg transition-all ${newPageEmoji === emoji
                                                ? 'bg-blue-500/20 ring-2 ring-blue-500 scale-110'
                                                : 'hover:bg-white/5'
                                            }`}
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowNewPageDialog(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleCreatePage} disabled={!newPageTitle.trim()}>
                            Criar Página
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
