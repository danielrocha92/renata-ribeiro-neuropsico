'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '@/styles/Breadcrumbs.module.css';

const textMap: Record<string, string> = {
    'admin': 'Admin',
    'financeiro': 'Financeiro',
    'conteudo': 'Conteúdos',
    'chat': 'Atendimento Online',
    'ajuda': 'Manual do Sistema',
    'prontuarios': 'Prontuário e Histórico',
    'atendimentos': 'Resumo dos Atendimentos',
    'cliente': 'Área do Cliente',
    'teleterapia': 'Teleterapia',
};

const Breadcrumbs = () => {
    const pathname = usePathname();

    if (!pathname) return null;

    const pathSegments = pathname.split('/').filter(v => v.length > 0);

    // Don't show on home page or if only 1 segment (unless it's admin root? usually dashboard is root)
    if (pathSegments.length === 0) return null;

    const breadcrumbs = pathSegments.map((segment, index) => {
        const href = '/' + pathSegments.slice(0, index + 1).join('/');
        const isLast = index === pathSegments.length - 1;
        const label = textMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);

        return { href, label, isLast };
    });

    return (
        <nav className={styles.breadcrumbs} aria-label="breadcrumbs">
            <div className={styles.crumb}>
                <Link href="/" className={styles.link}>
                    Início
                </Link>
                <span className={styles.separator}>/</span>
            </div>

            {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.href}>
                    <div className={styles.crumb}>
                        {crumb.isLast ? (
                            <span className={styles.current}>{crumb.label}</span>
                        ) : (
                            <Link href={crumb.href} className={styles.link}>
                                {crumb.label}
                            </Link>
                        )}
                        {!crumb.isLast && <span className={styles.separator}>/</span>}
                    </div>
                </React.Fragment>
            ))}
        </nav>
    );
};

export default Breadcrumbs;
