import React from 'react';
import styles from '@/styles/WherebyComponent.module.css';

interface WherebyComponentProps {
    roomUrl: string;
}

const WherebyComponent: React.FC<WherebyComponentProps> = ({ roomUrl }) => {
    return (
        <div className={styles.container}>
            <iframe
                src={roomUrl}
                allow="camera; microphone; fullscreen; speaker; display-capture"
                className={styles.iframe}
                title="Sala de Teleterapia"
            />
        </div>
    );
};

export default WherebyComponent;
