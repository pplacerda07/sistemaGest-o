'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useData } from '@/lib/data-store';
import { Plus, Search, Trash2, FolderOpen } from 'lucide-react';
import { toast } from 'sonner';

const EMOJIS = ['🚀', '✍️', '🎯', '📊', '💡', '🧠', '📚', '🔥', '⚡', '🎨', '📈', '🏆', '🛠️', '🌟', '📝'];
const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#06B6D4', '#F97316'];

export default function ProjetosPage() {
    const { projetos, projetoPages, addProjeto, deleteProjeto } = useData();
    const [search, setSearch] = useState('');
    const [showNewDialog, setShowNewDialog] = useState(false);
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [selectedEmoji, setSelectedEmoji] = useState('💡');
    const [selectedColor, setSelectedColor] = useState('#3B82F6');
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const filteredProjetos = useMemo(() => {
        if (search === '') return projetos;
        return projetos.filter(
            (p) =>
                p.nome.toLowerCase().includes(search.toLowerCase()) ||
                p.descricao.toLowerCase().includes(search.toLowerCase())
        );
    }, [projetos, search]);

    const handleCreate = () => {
        if (!nome.trim()) return;
        addProjeto({
            nome: nome.trim(),
            descricao: descricao.trim(),
            emoji: selectedEmoji,
            cor: selectedColor,
        });
        toast.success('Projeto criado!');
        setShowNewDialog(false);
        setNome('');
        setDescricao('');
        setSelectedEmoji('💡');
        setSelectedColor('#3B82F6');
    };

    const handleDelete = () => {
        if (deleteId) {
            deleteProjeto(deleteId);
            toast.success('Projeto excluído!');
            setDeleteId(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Projetos</h1>
                    <p className="text-muted-foreground">
                        Seu espaço criativo de estudo e elaboração
                    </p>
                </div>
                <Button className="gap-2" onClick={() => setShowNewDialog(true)}>
                    <Plus className="h-4 w-4" />
                    Novo Projeto
                </Button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Buscar projetos..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                />
            </div>

            {/* Project Grid */}
            {filteredProjetos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <FolderOpen className="h-16 w-16 text-muted-foreground/30 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Nenhum projeto encontrado</h3>
                    <p className="text-muted-foreground mb-4">
                        Crie seu primeiro projeto para começar a organizar suas ideias
                    </p>
                    <Button onClick={() => setShowNewDialog(true)} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Criar Projeto
                    </Button>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredProjetos.map((projeto) => {
                        const pages = projetoPages.filter(
                            (pp) => pp.projeto_id === projeto.id
                        );
                        return (
                            <Link
                                key={projeto.id}
                                href={`/projetos/${projeto.id}`}
                                className="group block"
                            >
                                <Card className="h-full border-border/40 hover:border-border transition-all duration-200 hover:shadow-lg hover:shadow-black/10 overflow-hidden">
                                    {/* Color bar */}
                                    <div
                                        className="h-1.5"
                                        style={{ backgroundColor: projeto.cor }}
                                    />
                                    <CardContent className="p-5">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <span className="text-3xl">{projeto.emoji}</span>
                                                <div>
                                                    <h3 className="font-semibold group-hover:text-blue-400 transition-colors line-clamp-1">
                                                        {projeto.nome}
                                                    </h3>
                                                    <p className="text-xs text-muted-foreground">
                                                        {pages.length} {pages.length === 1 ? 'página' : 'páginas'}
                                                    </p>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-400 hover:bg-red-500/10"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    setDeleteId(projeto.id);
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {projeto.descricao || 'Sem descrição'}
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}

                    {/* New project card */}
                    <Card
                        className="h-full border-dashed border-border/40 hover:border-blue-500/50 transition-all duration-200 cursor-pointer flex items-center justify-center min-h-[160px]"
                        onClick={() => setShowNewDialog(true)}
                    >
                        <div className="text-center p-5">
                            <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 mb-3">
                                <Plus className="h-6 w-6" />
                            </div>
                            <p className="text-sm font-medium text-muted-foreground">
                                Novo Projeto
                            </p>
                        </div>
                    </Card>
                </div>
            )}

            {/* New Project Dialog */}
            <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Novo Projeto</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Nome do Projeto</Label>
                            <Input
                                placeholder="Ex: Estratégias de Growth..."
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Descrição</Label>
                            <Textarea
                                placeholder="Sobre o que é este projeto..."
                                value={descricao}
                                onChange={(e) => setDescricao(e.target.value)}
                                rows={2}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Emoji</Label>
                            <div className="flex flex-wrap gap-2">
                                {EMOJIS.map((emoji) => (
                                    <button
                                        key={emoji}
                                        type="button"
                                        onClick={() => setSelectedEmoji(emoji)}
                                        className={`text-2xl p-1.5 rounded-lg transition-all ${selectedEmoji === emoji
                                                ? 'bg-blue-500/20 ring-2 ring-blue-500 scale-110'
                                                : 'hover:bg-white/5'
                                            }`}
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Cor</Label>
                            <div className="flex gap-2">
                                {COLORS.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() => setSelectedColor(color)}
                                        className={`h-8 w-8 rounded-full transition-all ${selectedColor === color
                                                ? 'ring-2 ring-offset-2 ring-offset-background scale-110'
                                                : 'hover:scale-105'
                                            }`}
                                        style={{
                                            backgroundColor: color,
                                            ringColor: color,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowNewDialog(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleCreate} disabled={!nome.trim()}>
                            Criar Projeto
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Excluir projeto?</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground">
                        Todas as páginas e conteúdos deste projeto serão removidos permanentemente.
                    </p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteId(null)}>
                            Cancelar
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Excluir
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
