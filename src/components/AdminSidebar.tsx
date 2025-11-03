'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './AdminSidebar.module.css';

const AdminSidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/disponibilidade', label: 'Agenda' },
    // { href: '/admin/pacientes', label: 'Pacientes' }, // Futuro
    // { href: '/admin/configuracoes', label: 'Configurações' }, // Futuro
  ];

  return (
    <aside className={styles.sidebar}>
      <nav>
        <ul>
          {navItems.map(item => (
            <li key={item.href}>
              <Link href={item.href} className={pathname === item.href ? styles.active : ''}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
