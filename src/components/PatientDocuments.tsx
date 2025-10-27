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
        setError('Falha ao buscar documentos do paciente.');
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
    if (!file || !selectedPatient) {
      setError('Por favor, selecione um paciente e um arquivo.');
      return;
    }
    if (!storage || !db) {
        setError('Serviço de armazenamento ou banco de dados indisponível.');
        return;
    }

    setUploading(true);
    setError(null);

    try {
      // Create a storage reference
      const storageRef = ref(storage, `documents/${selectedPatient}/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed',
        (snapshot) => {
          // Optional: handle progress
        },
        (error) => {
          console.error("Upload error: ", error);
          setError('Falha no upload do arquivo.');
          setUploading(false);
        },
        async () => {
          // Handle successful uploads on complete
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          
          // Save document metadata to Firestore
          await addDoc(collection(db, "documents"), {
            patientId: selectedPatient,
            fileName: file.name,
            fileURL: downloadURL,
            uploadedAt: serverTimestamp(),
          });

          // Refresh document list
          setDocuments(prev => [...prev, { id: '', fileName: file.name, fileURL: downloadURL, uploadedAt: Timestamp.now() }]);
          setFile(null);
          setUploading(false);
        }
      );
    } catch (err) {
      console.error("Upload error: ", err);
      setError('Ocorreu um erro durante o upload.');
      setUploading(false);
    }
  };

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <div>
        <label htmlFor="patient-select">Selecione o Paciente: </label>
        <select 
          id="patient-select"
          value={selectedPatient}
          onChange={(e) => setSelectedPatient(e.target.value)}
        >
          <option value="" disabled>-- Escolha um paciente --</option>
          {patients.map(p => (
            <option key={p.uid} value={p.uid}>{p.name}</option>
          ))}
        </select>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <input type="file" onChange={handleFileChange} disabled={!selectedPatient || uploading} />
        <button onClick={handleUpload} disabled={!file || uploading}>
          {uploading ? 'Enviando...' : 'Enviar Documento'}
        </button>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h3>Documentos do Paciente</h3>
        {loadingDocs ? (
          <p>Carregando documentos...</p>
        ) : documents.length > 0 ? (
          <ul>
            {documents.map(doc => (
              <li key={doc.id}>
                <a href={doc.fileURL} target="_blank" rel="noopener noreferrer">
                  {doc.fileName}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhum documento encontrado para este paciente.</p>
        )}
      </div>
    </div>
  );
};

export default PatientDocuments;
