'use client';

import React, { useState, useEffect } from 'react';
import styles from '@/styles/PatientDocuments.module.css';
import utils from '@/styles/Utils.module.css';
import { db } from '../lib/firebase';
import { collection, getDocs, query, where, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';

// Define types for the data
interface Patient {
  uid: string;
  name: string;
}

interface Document {
  id: string;
  patientId: string;
  fileName: string;
  fileData?: string; // Base64 content for small files
  externalLink?: string; // URL for large files
  type: 'file' | 'link';
  uploadedAt: Timestamp;
}

const PatientDocuments: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [externalLink, setExternalLink] = useState('');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'upload' | 'link'>('upload');

  // Fetch patients from Firestore
  useEffect(() => {
    const fetchPatients = async () => {
      if (!db) return;
      try {
        const q = query(collection(db, "users"), where("userType", "==", "paciente"));
        const querySnapshot = await getDocs(q);
        const patientList = querySnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as Patient));
        setPatients(patientList);
      } catch (err) {
        console.error("Error fetching patients: ", err);
        setError('Falha ao buscar pacientes.');
      }
    };
    fetchPatients();
  }, []);

  // Fetch documents for the selected patient
  useEffect(() => {
    const fetchDocuments = async () => {
      if (!selectedPatient || !db) {
        setDocuments([]);
        return;
      }
      setLoadingDocs(true);
      try {
        const q = query(collection(db, "documents"), where("patientId", "==", selectedPatient));
        const querySnapshot = await getDocs(q);
        const docsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Document));
        setDocuments(docsList);
      } catch (err) {
        console.error("Error fetching documents: ", err);
        setError('Falha ao buscar documentos.');
      } finally {
        setLoadingDocs(false);
      }
    };
    fetchDocuments();
  }, [selectedPatient]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      // Limit size to ~800KB to fit in Firestore safely (1MB limit)
      if (selectedFile.size > 800 * 1024) {
        alert("O arquivo é muito grande para o upload direto (Máx 800KB). Para arquivos maiores, use a opção 'Link Externo' com Google Drive ou similar.");
        e.target.value = '';
        setFile(null);
        return;
      }
      setFile(selectedFile);
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleSave = async () => {
    if (!selectedPatient || !db) {
      setError('Selecione um paciente.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      let docData: any = {
        patientId: selectedPatient,
        uploadedAt: serverTimestamp(),
      };

      if (mode === 'upload') {
        if (!file) {
          setError('Selecione um arquivo.');
          setUploading(false);
          return;
        }
        const base64Data = await convertToBase64(file);
        docData = {
          ...docData,
          fileName: file.name,
          fileData: base64Data,
          type: 'file'
        };
      } else {
        if (!externalLink) {
          setError('Insira o link externo.');
          setUploading(false);
          return;
        }
        docData = {
          ...docData,
          fileName: 'Documento Externo (Link)',
          externalLink: externalLink,
          type: 'link'
        };
      }

      await addDoc(collection(db, "documents"), docData);

      setFile(null);
      setExternalLink('');
      setUploading(false);

      // Refresh list
      const q = query(collection(db, "documents"), where("patientId", "==", selectedPatient));
      const querySnapshot = await getDocs(q);
      const docsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Document));
      setDocuments(docsList);

    } catch (err) {
      console.error("Error saving document: ", err);
      setError('Falha ao salvar documento.');
      setUploading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Documentos dos Pacientes</h3>
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.controls}>
        <div className={styles.inputGroup}>
          <label>1. Selecione o Paciente</label>
          <select className={styles.select} value={selectedPatient} onChange={(e) => setSelectedPatient(e.target.value)}>
            <option value="">Selecione...</option>
            {patients.map(p => (
              <option key={p.uid} value={p.uid}>{p.name}</option>
            ))}
          </select>
        </div>

        {selectedPatient && (
          <div className={styles.uploadSection}>
            <label>2. Escolha o tipo de anexo</label>
            <div className={styles.radioGroup}>
              <label>
                <input
                  type="radio"
                  checked={mode === 'upload'}
                  onChange={() => setMode('upload')}
                /> Upload (PDF/Imagem peq.)
              </label>
              <label>
                <input
                  type="radio"
                  checked={mode === 'link'}
                  onChange={() => setMode('link')}
                /> Link Externo (Drive/Dropbox)
              </label>
            </div>

            {mode === 'upload' ? (
              <div className={styles.inputGroup}>
                <input type="file" onChange={handleFileChange} className={styles.fileInput} accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" />
                <small className={`${utils.textMuted} ${utils.mt05} ${utils.w100} ${utils.block}`}>Máximo: 800KB. Para arquivos maiores, use "Link Externo".</small>
              </div>
            ) : (
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  placeholder="Cole o link do Google Drive/Dropbox aqui..."
                  value={externalLink}
                  onChange={(e) => setExternalLink(e.target.value)}
                  className={`${styles.textInput} ${utils.w100}`}
                />
              </div>
            )}

            <button className={styles.button} onClick={handleSave} disabled={uploading}>
              {uploading ? 'Salvando...' : 'Salvar Documento'}
            </button>
          </div>
        )}
      </div>

      {loadingDocs ? (
        <p>Carregando documentos...</p>
      ) : (
        <div className={styles.documentList}>
          <h4>Histórico de Documentos</h4>
          {documents.length > 0 ? (
            <ul>
              {documents.map(doc => (
                <li key={doc.id} className={styles.documentItem}>
                  <div className={styles.docInfo}>
                    {doc.type === 'file' ? (
                      <a href={doc.fileData} download={doc.fileName} className={styles.link}>
                        📄 {doc.fileName} (Baixar)
                      </a>
                    ) : (
                      <a href={doc.externalLink} target="_blank" rel="noopener noreferrer" className={styles.link}>
                        🔗 {doc.externalLink} (Acessar Link)
                      </a>
                    )}
                  </div>
                  {doc.uploadedAt && (
                    <span className={styles.date}>{new Date(doc.uploadedAt.seconds * 1000).toLocaleDateString()}</span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.noData}>Nenhum documento encontrado para este paciente.</p>
          )}
        </div>
      )}

      {selectedPatient && (
        <div className={utils.mt2}>
          <h4 className={styles.title}>
            Histórico de Consultas
          </h4>
          <AppointmentsList patientId={selectedPatient} />
        </div>
      )}
    </div>
  );
};

const AppointmentsList = ({ patientId }: { patientId: string }) => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      setLoading(true);
      try {
        // Simplified query
        const q = query(
          collection(db, "appointments"),
          where("patientId", "==", patientId)
        );
        const snap = await getDocs(q);
        // Client-side sort
        const apps = snap.docs.map(d => ({ id: d.id, ...d.data() } as any))
          .sort((a, b) => (b.date?.seconds || 0) - (a.date?.seconds || 0));
        setAppointments(apps);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, [patientId]);

  if (loading) return <p>Carregando consultas...</p>;
  if (appointments.length === 0) return <p className={styles.noData}>Nenhuma consulta registrada.</p>;

  return (
    <table className={`${utils.table} ${utils.textSmall}`}>
      <thead>
        <tr>
          <th>Data</th>
          <th>Título</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {appointments.map(app => (
          <tr key={app.id}>
            <td>{app.date?.seconds ? new Date(app.date.seconds * 1000).toLocaleDateString() : '-'}</td>
            <td>{app.title}</td>
            <td>{app.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PatientDocuments;
