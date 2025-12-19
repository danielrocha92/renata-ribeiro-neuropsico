'use client';

import React, { useState, useEffect } from 'react';
import styles from '@/styles/Admin.module.css';
import utils from '@/styles/Utils.module.css';
import AdminPrivateRoute from '@/components/AdminPrivateRoute';
import { db, storage } from '@/lib/firebase';
import { collection, addDoc, query, getDocs, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Trash2, Plus, Upload, Link as LinkIcon } from 'lucide-react';

interface Content {
    id: string;
    title: string;
    type: string;
    description: string;
    url?: string;
    locked: boolean;
}

const AdminConteudoPage = () => {
    const [contents, setContents] = useState<Content[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        type: 'Artigo',
        description: '',
        url: '',
        locked: false
    });

    const fetchContents = async () => {
        if (!db) return; // Guard clause
        setLoading(true);
        try {
            const q = query(collection(db, 'contents'));
            const snapshot = await getDocs(q);
            setContents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Content)));
        } catch (error) {
            console.error("Error fetching content:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (db) {
            fetchContents();
        }
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let finalUrl = formData.url;

        // If a file is selected, upload it first
        if (selectedFile) {
            if (!storage) {
                alert("Erro: Firebase Storage não está configurado.");
                return;
            }

            const storageRef = ref(storage, `contents/${selectedFile.name}_${Date.now()}`);
            const uploadTask = uploadBytesResumable(storageRef, selectedFile);

            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(progress);
                },
                (error) => {
                    console.error("Upload error:", error);
                    alert("Erro ao fazer upload do arquivo.");
                },
                async () => {
                    finalUrl = await getDownloadURL(uploadTask.snapshot.ref);

                    // After upload, save Firestore document
                    await saveContentToFirestore(finalUrl);
                }
            );
        } else {
            // No file, just save (URL must be present if needed)
            await saveContentToFirestore(finalUrl);
        }
    };

    const saveContentToFirestore = async (url: string) => {
        if (!db) {
            alert("Erro: Banco de dados não inicializado.");
            return;
        }
        try {
            await addDoc(collection(db, 'contents'), {
                ...formData,
                url: url,
                createdAt: new Date()
            });
            alert('Conteúdo adicionado com sucesso!');
            setFormData({ title: '', type: 'Artigo', description: '', url: '', locked: false });
            setSelectedFile(null);
            setUploadProgress(0);
            fetchContents();
        } catch (error) {
            console.error("Error adding content:", error);
            alert('Erro ao adicionar conteúdo no banco de dados.');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir?')) return;
        try {
            await deleteDoc(doc(db, 'contents', id));
            setContents(prev => prev.filter(c => c.id !== id));
        } catch (error) {
            console.error("Error deleting content:", error);
            alert('Erro ao excluir.');
        }
    };

    return (
        <AdminPrivateRoute>
            <div className={styles.container}>
                <header className={styles.header}>
                    <h1>Gerenciar Conteúdos</h1>
                </header>

                <div className={styles.grid}>
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Novo Conteúdo</h2>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Título</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Tipo</label>
                                <select
                                    className={styles.select}
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option value="Artigo">Artigo</option>
                                    <option value="Vídeo">Vídeo</option>
                                    <option value="PDF">PDF</option>
                                    <option value="Link">Link Externo</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Descrição</label>
                                <textarea
                                    className={styles.textarea}
                                    required
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            {/* Conditional Input: File or URL */}
                            {(formData.type === 'PDF' || formData.type === 'Vídeo') ? (
                                <div className={styles.formGroup}>
                                    <div className={styles.alertInfoBox} style={{ backgroundColor: '#fff3cd', color: '#856404', padding: '10px', borderRadius: '5px', marginBottom: '10px' }}>
                                        <strong>Aviso:</strong> O upload de arquivos está temporariamente indisponível no plano gratuito devido a restrições de configuração do servidor. Por favor, utilize a opção "Link Externo" (Google Drive, Dropbox, YouTube) para compartilhar arquivos.
                                    </div>

                                    {/* Link input fallback for files */}
                                    <label className={styles.label}>Link para o Arquivo (Substituto do Upload)</label>
                                    <div className={utils.relative}>
                                        <LinkIcon size={18} className={styles.inputIcon} />
                                        <input
                                            type="url"
                                            className={`${styles.input} ${styles.inputWithIcon}`}
                                            placeholder="https://..."
                                            value={formData.url}
                                            onChange={e => setFormData({ ...formData, url: e.target.value })}
                                        />
                                    </div>

                                    {/* Hidden original file input to prevent errors but disable usage */}
                                    {/*
                                    <label className={styles.label}>Upload de Arquivo (PC ou Celular)</label>
                                    <div className={utils.flexRow}>
                                        <label className={styles.uploadButton}>
                                            <Upload size={18} className={utils.mr05} />
                                            {selectedFile ? 'Alterar Arquivo' : 'Escolher Arquivo'}
                                            <input
                                                type="file"
                                                onChange={handleFileChange}
                                                accept={formData.type === 'PDF' ? "application/pdf" : "video/*"}
                                                className={utils.dNone}
                                                disabled
                                            />
                                        </label>
                                        <span className={`${utils.textSmall} ${utils.textMuted}`}>
                                            {selectedFile ? selectedFile.name : 'Nenhum arquivo selecionado'}
                                        </span>
                                    </div>
                                    */}
                                </div>
                            ) : (
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>URL do Recurso</label>
                                    <div className={utils.relative}>
                                        <LinkIcon size={18} className={styles.inputIcon} />
                                        <input
                                            type="url"
                                            className={`${styles.input} ${styles.inputWithIcon}`}
                                            placeholder="https://..."
                                            value={formData.url}
                                            onChange={e => setFormData({ ...formData, url: e.target.value })}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className={`${styles.formGroup} ${utils.flexRow} ${utils.gap05}`}>
                                <input
                                    type="checkbox"
                                    id="locked"
                                    checked={formData.locked}
                                    onChange={e => setFormData({ ...formData, locked: e.target.checked })}
                                />
                                <label htmlFor="locked">Conteúdo Exclusivo (Bloqueado)</label>
                            </div>

                            <button type="submit" className={styles.button} disabled={uploadProgress > 0 && uploadProgress < 100}>
                                {uploadProgress > 0 && uploadProgress < 100 ? 'Enviando...' : (
                                    <>
                                        <Plus size={18} className={`${utils.verticalAlignMiddle} ${utils.mr05}`} />
                                        {selectedFile ? 'Enviar e Adicionar' : 'Adicionar Conteúdo'}
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Conteúdos Cadastrados</h2>
                        <div className={styles.tableContainer}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Título</th>
                                        <th>Tipo</th>
                                        <th>Status</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {contents.map(content => (
                                        <tr key={content.id}>
                                            <td>
                                                <div className={utils.fw600}>{content.title}</div>
                                                <a href={content.url} target="_blank" rel="noopener noreferrer" className={`${utils.textSmall} ${utils.textPrimary}`}>Ver recurso</a>
                                            </td>
                                            <td>{content.type}</td>
                                            <td>{content.locked ? '🔒 Exclusivo' : '🔓 Aberto'}</td>
                                            <td>
                                                <button
                                                    onClick={() => handleDelete(content.id)}
                                                    className={utils.iconButtonDanger}
                                                    title="Excluir"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {contents.length === 0 && !loading && (
                                        <tr>
                                            <td colSpan={4} className={`${utils.textCenter} ${utils.textMuted}`}>Nenhum conteúdo cadastrado.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AdminPrivateRoute>
    );
};

export default AdminConteudoPage;
