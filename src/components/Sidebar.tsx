'use client';
// ========================================
// Sidebar - Navegação principal (Dark Theme)
// ========================================

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Users,
    CheckSquare,
    DollarSign,
    BarChart3,
    Lightbulb,
    Menu,
    X,
    Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';

const navItems = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'Clientes',
        href: '/clientes',
        icon: Users,
    },
    {
        title: 'Tarefas',
        href: '/tarefas',
        icon: CheckSquare,
    },
    {
        title: 'Financeiro',
        href: '/financeiro',
        icon: DollarSign,
    },
    {
        title: 'Produtividade',
        href: '/produtividade',
        icon: BarChart3,
    },
    {
        title: 'Projetos',
        href: '/projetos',
        icon: Lightbulb,
    },
];

function SidebarContent({ onClose }: { onClose?: () => void }) {
    const pathname = usePathname();

    return (
        <div className="flex h-full flex-col">
            {/* Logo */}
            <div className="flex items-center gap-3 px-6 py-6 border-b border-border/30">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
                    <Zap className="h-5 w-5 text-white" />
                </div>
                <div>
                    <h1 className="text-lg font-bold tracking-tight">FreelaCRM</h1>
                    <p className="text-xs text-muted-foreground">Marketing Digital</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Menu principal">
                {navItems.map((item) => {
                    const isActive =
                        pathname === item.href || pathname?.startsWith(item.href + '/');
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onClose}
                            className={cn(
                                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                                isActive
                                    ? 'bg-blue-500/15 text-blue-400 shadow-sm'
                                    : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                            )}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            <item.icon
                                className={cn(
                                    'h-5 w-5 transition-colors',
                                    isActive ? 'text-blue-400' : ''
                                )}
                            />
                            {item.title}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="border-t border-border/30 px-6 py-4">
                <p className="text-xs text-muted-foreground text-center">
                    © 2026 FreelaCRM
                </p>
            </div>
        </div>
    );
}

export default function Sidebar() {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Desktop Sidebar */}
            <aside
                className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 border-r border-border/30 bg-sidebar z-30"
                aria-label="Sidebar"
            >
                <SidebarContent />
            </aside>

            {/* Mobile Hamburger */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center h-16 px-4 border-b border-border/30 bg-sidebar/95 backdrop-blur supports-[backdrop-filter]:bg-sidebar/80">
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Abrir menu de navegação"
                        >
                            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64 p-0">
                        <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
                        <SidebarContent onClose={() => setOpen(false)} />
                    </SheetContent>
                </Sheet>
                <div className="flex items-center gap-2 ml-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
                        <Zap className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-semibold text-sm">FreelaCRM</span>
                </div>
            </div>
        </>
    );
}
