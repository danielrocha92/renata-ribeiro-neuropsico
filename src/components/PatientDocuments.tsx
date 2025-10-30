'use client';

import React, { useState, useEffect } from 'react';
import { db, storage } from '../lib/firebase';
import { collection, getDocs, query, where, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

// Define types for the data
interface Patient {
  uid: string;
  name: string;
}

interface Document {
  id: string;
  fileName: string;
  fileURL: string;
  uploadedAt: Timestamp;
}

const PatientDocuments: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch patients from Firestore
  useEffect(() => {
    const fetchPatients = async () => {
      // Esta verificação está correta
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
      // Esta verificação está correta
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
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !selectedPatient || !storage || !db) {
      setError('Selecione um paciente e um arquivo para fazer o upload.');
      return;
    }
    setUploading(true);
    setError(null);

    const storageRef = ref(storage, `documents/${selectedPatient}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      () => {
        // Progress function not used in this case
      },
      (err) => {
        console.error("Upload error: ", err);
        setError('Falha no upload do arquivo.');
        setUploading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

        // ***** INÍCIO DA CORREÇÃO *****
        // Verificação necessária que estava faltando
        if (!db) {
          console.error("Erro: Conexão com o banco de dados não estabelecida.");
          setError('Falha ao salvar o documento no banco.');
          setUploading(false);
          return;
        }
        // ***** FIM DA CORREÇÃO *****

        // Agora o TypeScript sabe que 'db' não é nulo
        await addDoc(collection(db, "documents"), {
          patientId: selectedPatient,
          fileName: file.name,
          fileURL: downloadURL,
          uploadedAt: serverTimestamp(),
        });
        setUploading(false);
        setFile(null); // Clear the file input

        // Refresh documents list
        const fetchDocuments = async () => {
          if (!selectedPatient || !db) return; // Esta verificação já estava correta
          const q = query(collection(db, "documents"), where("patientId", "==", selectedPatient));
          const querySnapshot = await getDocs(q);
          const docsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Document));
          setDocuments(docsList);
        };
        fetchDocuments();
      }
    );
  };

  return (
    <div className="patient-documents">
      <h3>Documentos dos Pacientes</h3>
      {error && <p className="error">{error}</p>}

      <div className="controls">
        <select value={selectedPatient} onChange={(e) => setSelectedPatient(e.target.value)}>
          <option value="">Selecione um Paciente</option>
          {patients.map(p => (
            <option key={p.uid} value={p.uid}>{p.name}</option>
          ))}
        </select>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={!file || !selectedPatient || uploading}>
          {uploading ? 'Enviando...' : 'Enviar Documento'}
        </button>
      </div>

      {loadingDocs ? (
        <p>Carregando documentos...</p>
      ) : (
        <div className="document-list">
          {documents.length > 0 ? (
            <ul>
              {documents.map(doc => (
                <li key={doc.id}>
                  <a href={doc.fileURL} target="_blank" rel="noopener noreferrer">{doc.fileName}</a>
                  {doc.uploadedAt && (
                    <span> - {new Date(doc.uploadedAt.seconds * 1000).toLocaleDateString()}</span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>Nenhum documento para este paciente.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PatientDocuments;
