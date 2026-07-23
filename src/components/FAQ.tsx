'use client';

import React, { useState } from 'react';
import styles from '@/styles/FAQ.module.css';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqData = [
    {
        question: 'Como funciona a primeira sessão?',
        answer: 'A primeira sessão é um momento de acolhimento e escuta. Vamos conversar sobre o que te trouxe à terapia, entender suas expectativas e explicar como funciona o processo terapêutico. É também uma oportunidade para nos conhecermos e avaliarmos se você se sente confortável com a minha abordagem.'
    },
    {
        question: 'Qual a duração e a frequência das sessões?',
        answer: 'As sessões de psicoterapia têm duração média de 50 minutos e, geralmente, ocorrem uma vez por semana. A frequência pode ser ajustada ao longo do tempo, dependendo da sua evolução e necessidade.'
    },
    {
        question: 'Como é feita a Avaliação Neuropsicológica?',
        answer: 'A avaliação é um processo estruturado que dura, em média, de 4 a 6 sessões presenciais. Inclui uma entrevista inicial detalhada (anamnese), a aplicação de testes padronizados para avaliar funções como memória, atenção e inteligência, e finaliza com uma sessão de devolutiva, onde entrego e explico o laudo completo.'
    },
    {
        question: 'Você atende por plano de saúde?',
        answer: 'Meus atendimentos são exclusivamente particulares. No entanto, forneço recibo com todas as informações necessárias para que você possa solicitar o reembolso junto ao seu plano de saúde, caso ele ofereça essa modalidade.'
    },
    {
        question: 'A terapia online é tão eficaz quanto a presencial?',
        answer: 'Sim! Diversos estudos comprovam que a psicoterapia online possui a mesma eficácia da presencial. A principal diferença é a comodidade de ser atendido no conforto da sua casa, desde que você tenha um ambiente privativo e uma boa conexão de internet.'
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
