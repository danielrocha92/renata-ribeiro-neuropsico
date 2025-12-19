import React from 'react';

interface WherebyComponentProps {
    roomUrl: string;
}

const WherebyComponent: React.FC<WherebyComponentProps> = ({ roomUrl }) => {
    return (
        <div style={{ width: '100%', height: '100%', minHeight: '600px', borderRadius: '12px', overflow: 'hidden' }}>
            <iframe
                src={roomUrl}
                allow="camera; microphone; fullscreen; speaker; display-capture"
                style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    minHeight: '600px'
                }}
                title="Sala de Teleterapia"
            />
        </div>
    );
};

export default WherebyComponent;
