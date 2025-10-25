// src/app/contato/page.tsx
'use client';

import React, { useState, FormEvent } from 'react';
import styles from '@/styles/Contato.module.css';

// Ícones SVG para contato
const IconPhone = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.08 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
);
const IconMail = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
);
const IconMap = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>
);
const IconSchedule = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="m11 15 2 2 4-4"/></svg>
);

export default function ContatoPage() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    assunto: '',
    mensagem: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log('Dados do Formulário Enviados:', formData);
    // Em um site real, aqui seria a integração com um serviço de envio de e-mail (ex: Firebase Functions, Mailchimp)
    alert('Mensagem enviada com sucesso! Em breve, entraremos em contato.');
    setFormData({ nome: '', email: '', assunto: '', mensagem: '' });
  };

  return (
    <main className={styles.main}>
      <h1 className={styles.heading}>Contato e Agendamento</h1>
      <p className={styles.subHeading}>
        Estou aqui para acolher suas dúvidas e iniciar seu processo de transformação. Escolha a melhor forma de contato abaixo.
      </p>

      <div className={styles.contactContainer}>
        
        {/* Seção de Informações de Contato */}
        <section className={styles.infoSection}>
          <h2>Informações e Consultório</h2>
          
          <div className={styles.contactItem}>
            <IconPhone />
            <div className={styles.contactDetails}>
              <p>Telefone / WhatsApp</p>
              <p><a href="tel:+5511998765432">(11) 99876-5432</a></p>
            </div>
          </div>

          <div className={styles.contactItem}>
            <IconMail />
            <div className={styles.contactDetails}>
              <p>E-mail Profissional</p>
              <p><a href="mailto:contato@renataribeiropsico.com.br">contato@renataribeiropsico.com.br</a></p>
            </div>
          </div>
          
          <div className={styles.contactItem}>
            <IconMap />
            <div className={styles.contactDetails}>
              <p>Consultório - Atendimento Presencial</p>
              <p>Rua João Cachoeira, 488 - Conjunto 510</p>
              <p>Itaim Bibi, São Paulo - SP</p>
              <p style={{ fontSize: '0.85rem', marginTop: '5px' }}>
                <a 
                  href="https://maps.app.goo.gl/endereco-simulado" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ color: '#ffffff' }}
                >
                  Ver no Google Maps »
                </a>
              </p>
            </div>
          </div>

          <div className={styles.contactItem}>
            <IconSchedule />
            <div className={styles.contactDetails}>
              <p>Horário de Atendimento</p>
              <p>Segunda a Sexta: 9h às 18h</p>
              <p>Consultas Online em horários flexíveis.</p>
            </div>
          </div>

        </section>

        {/* Seção de Formulário de Contato */}
        <section className={styles.formSection}>
          <h2>Envie uma Mensagem</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="nome">Seu Nome Completo</label>
              <input 
                type="text" 
                id="nome" 
                name="nome" 
                value={formData.nome} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="email">Seu Melhor E-mail</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="assunto">Assunto (Ex: Agendamento, Dúvida TCC)</label>
              <input 
                type="text" 
                id="assunto" 
                name="assunto" 
                value={formData.assunto} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="mensagem">Como posso te ajudar?</label>
              <textarea 
                id="mensagem" 
                name="mensagem" 
                value={formData.mensagem} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <button type="submit" className={styles.submitButton}>
              Enviar Mensagem
            </button>
          </form>
          <p style={{ fontSize: '0.8rem', textAlign: 'center', marginTop: '20px', color: '#666' }}>
            Seus dados serão tratados com total sigilo e privacidade.
          </p>
        </section>
      </div>
    </main>
  );
}

