import React from 'react';
import styles from '@/styles/DashboardGrid.module.css';
import DashboardCard from './DashboardCard';

export interface DashboardItem {
    title: string;
    description: string;
    icon: React.ReactNode;
    onClick?: () => void;
    variant?: 'default' | 'highlight';
    notificationCount?: number;
}

interface DashboardGridProps {
    items: DashboardItem[];
}

const DashboardGrid: React.FC<DashboardGridProps> = ({ items }) => {
    return (
        <div className={styles.grid}>
            {items.map((item, index) => (
                <DashboardCard
                    key={index}
                    title={item.title}
                    description={item.description}
                    icon={item.icon}
                    onClick={item.onClick}
                    variant={item.variant}
                    notificationCount={item.notificationCount}
                />
            ))}
        </div>
    );
};

export default DashboardGrid;
