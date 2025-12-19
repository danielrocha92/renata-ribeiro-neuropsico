import React, { ReactNode } from 'react';
import styles from '@/styles/Cliente.module.css';

interface HelpSectionProps {
    title: string;
    icon: ReactNode;
    description: ReactNode;
    items: ReactNode[];
}

const HelpSection: React.FC<HelpSectionProps> = ({ title, icon, description, items }) => {
    return (
        <div className={styles.helpSection}>
            <h2>
                <span className={styles.helpIcon}>{icon}</span>
                {title}
            </h2>
            <div className={styles.helpText}>
                {description}
            </div>
            <ul className={styles.helpList}>
                {items.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        </div>
    );
};

export default HelpSection;
