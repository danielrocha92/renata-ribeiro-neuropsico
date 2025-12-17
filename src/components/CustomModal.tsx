import React from 'react';
import styles from '@/styles/CustomModal.module.css';

interface CustomModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message: string;
    type?: 'alert' | 'confirm';
    onConfirm?: () => void;
    confirmText?: string;
    cancelText?: string;
}

const CustomModal: React.FC<CustomModalProps> = ({
    isOpen,
    onClose,
    title,
    message,
    type = 'alert',
    onConfirm,
    confirmText = 'OK',
    cancelText = 'Cancelar',
}) => {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                {title && <h2 className={styles.title}>{title}</h2>}
                <p className={styles.message}>{message}</p>

                <div className={styles.footer}>
                    {type === 'confirm' ? (
                        <>
                            <button
                                className={`${styles.button} ${styles.cancelButton}`}
                                onClick={onClose}
                            >
                                {cancelText}
                            </button>
                            <button
                                className={`${styles.button} ${styles.confirmButton}`}
                                onClick={() => {
                                    if (onConfirm) onConfirm();
                                    onClose();
                                }}
                            >
                                {confirmText}
                            </button>
                        </>
                    ) : (
                        <button
                            className={`${styles.button} ${styles.alertButton}`}
                            onClick={onClose}
                        >
                            {confirmText}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CustomModal;
