import React from 'react';
import styles from '@/styles/DashboardCard.module.css';

interface DashboardCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    onClick?: () => void;
    variant?: 'default' | 'highlight';
    notificationCount?: number;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
    title,
    description,
    icon,
    onClick,
    variant = 'default',
    notificationCount = 0
}) => {
    return (
        <div
            className={`${styles.card} ${variant === 'highlight' ? styles.highlight : ''}`}
            onClick={onClick}
        >
            {notificationCount > 0 && (
                <span className={styles.notificationBadge}>{notificationCount}</span>
            )}
            <div className={styles.icon}>
                {icon}
            </div>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.description}>{description}</p>
        </div>
    );
};

export default DashboardCard;
