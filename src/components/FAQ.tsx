'use client';

import React, { useState } from 'react';
import styles from '@/styles/FAQ.module.css';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqData = [
    {
        question: 'A terapia online é tão eficaz quanto a presencial?',
        answer: 'Estudos comprovam que a psicoterapia online — especialmente a Cognitivo-Comportamental — entrega resultados tão eficazes quanto o formato presencial em diversos quadros clínicos, desde que a escolha da modalidade alinhe as necessidades específicas do paciente, a complexidade do caso e a infraestrutura adequada para as sessões.'
    },
    {
        question: 'Como funciona a avaliação neuropsicológica?',
        answer: 'A avaliação neuropsicológica envolve entrevista inicial, investigação da história clínica, aplicação de instrumentos adequados à demanda, análise integrada dos resultados e sessão de devolutiva. O número de encontros pode variar conforme a complexidade do caso e os procedimentos necessários.'
    },
    {
        question: 'Como funciona a primeira sessão de psicoterapia?',
        answer: 'A primeira sessão é dedicada ao acolhimento, à compreensão da demanda inicial, ao levantamento de informações relevantes e à apresentação do funcionamento do processo psicoterapêutico. É também um momento para esclarecer dúvidas e estabelecer os primeiros objetivos do acompanhamento.'
    },
    {
        question: 'Qual a duração e a frequência das sessões?',
        answer: 'As sessões de psicoterapia têm duração aproximada de 50 minutos e geralmente ocorrem semanalmente. A frequência poderá ser ajustada conforme as necessidades clínicas e o planejamento terapêutico.'
    }
];

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleQuestion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className={styles.faqSection} id="faq">
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Dúvidas Frequentes</h2>
                    <p className={styles.subtitle}>
                        Respostas para as perguntas mais comuns sobre os atendimentos e o processo terapêutico.
                    </p>
                </div>

                <div className={styles.faqList}>
                    {faqData.map((item, index) => (
                        <div
                            key={index}
                            className={`${styles.faqItem} ${openIndex === index ? styles.open : ''}`}
                        >
                            <button
                                className={styles.questionBtn}
                                onClick={() => toggleQuestion(index)}
                                aria-expanded={openIndex === index}
                            >
                                <span className={styles.questionText}>{item.question}</span>
                                {openIndex === index ? (
                                    <ChevronUp className={styles.icon} size={20} />
                                ) : (
                                    <ChevronDown className={styles.icon} size={20} />
                                )}
                            </button>
                            <div
                                className={styles.answerContainer}
                                style={{ maxHeight: openIndex === index ? '200px' : '0' }}
                            >
                                <p className={styles.answerText}>{item.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
