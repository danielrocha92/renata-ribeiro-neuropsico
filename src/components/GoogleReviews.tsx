import React from 'react';
import styles from '@/styles/GoogleReviews.module.css';
import { Star } from 'lucide-react';

const GoogleLogo = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
        <path fill="none" d="M0 0h48v48H0z" />
    </svg>
);

const reviews = [
    {
        id: 1,
        name: "Maria Silva",
        initial: "M",
        colorClass: "avatarPurple",
        time: "há 2 meses",
        rating: 5,
        text: "Profissional excelente! A avaliação neuropsicológica foi fundamental para o diagnóstico do meu filho. Agradeço muito pela atenção e cuidado.",
    },
    {
        id: 2,
        name: "João Pedro Santos",
        initial: "J",
        colorClass: "avatarBlue",
        time: "há 1 mês",
        rating: 5,
        text: "Atendimento online de muita qualidade. Me senti acolhido desde a primeira sessão. Recomendo fortemente a Dra. Renata.",
    },
    {
        id: 3,
        name: "Ana Clara",
        initial: "A",
        colorClass: "avatarOrange",
        time: "há 3 meses",
        rating: 5,
        text: "A Dra. Renata é muito atenciosa e competente. O processo de psicoterapia tem me ajudado demais no meu autoconhecimento.",
    }
];

const GoogleReviews: React.FC = () => {
    return (
        <section className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>O que dizem nossos pacientes</h2>
                <div className={styles.ratingHeader}>
                    <span>5.0</span>
                    <div className={styles.stars}>
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={20} fill="#fbbc04" color="#fbbc04" />
                        ))}
                    </div>
                    <span>no</span>
                    <GoogleLogo />
                    <span>Google</span>
                </div>
            </div>

            <div className={styles.grid}>
                {reviews.map((review) => (
                    <div key={review.id} className={styles.card}>
                        <div className={styles.userInfo}>
                            <div className={`${styles.avatar} ${styles[review.colorClass]}`}>
                                {review.initial}
                            </div>
                            <div className={styles.meta}>
                                <span className={styles.userName}>{review.name}</span>
                                <span className={styles.timeAgo}>{review.time}</span>
                            </div>
                        </div>

                        <div className={styles.stars}>
                            {[...Array(review.rating)].map((_, i) => (
                                <Star key={i} size={16} fill="#fbbc04" color="#fbbc04" />
                            ))}
                        </div>

                        <p className={styles.reviewText}>{review.text}</p>
                    </div>
                ))}
            </div>
            <div className={styles.linkContainer}>
                <a
                    href="https://www.google.com/maps/place/Renata+C+Ribeiro+%E2%80%93+Psic%C3%B3loga+%26+Neuropsic%C3%B3loga/@-23.5308753,-46.6614918,17z/data=!4m8!3m7!1s0x94cef93c48e13f65:0x463f20561ff49c33!8m2!3d-23.5308753!4d-46.6589169!9m1!1b1!16s%2Fg%2F11svtkz889?hl=pt&entry=ttu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                >
                    Ver todas as avaliações no Google Maps →
                </a>
            </div>
        </section>
    );
};

export default GoogleReviews;
