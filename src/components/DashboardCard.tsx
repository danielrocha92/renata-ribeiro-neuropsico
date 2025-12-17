import React from 'react';
import styles from '@/styles/DashboardCard.module.css';

interface DashboardCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    onClick?: () => void;
    variant?: 'default' | 'highlight';
}

const DashboardCard: React.FC<DashboardCardProps> = ({
    title,
    description,
    icon,
    onClick,
    variant = 'default'
}) => {
    return (
        <div
            className={`${styles.card} ${variant === 'highlight' ? styles.highlight : ''}`}
            onClick={onClick}
        >
            <div className={styles.icon}>
                {icon}
            </div>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.description}>{description}</p>
        </div>
    );
};

export default DashboardCard;
