'use client';

import React, { useEffect, useState } from 'react';
import styles from '@/styles/PageTransition.module.css';
import { usePathname } from 'next/navigation';

export default function Template({ children }: { children: React.ReactNode }) {
    const [isTransitioning, setIsTransitioning] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        // Trigger transition on mount (which happens on route change in template.tsx)
        setIsTransitioning(true);
        const timer = setTimeout(() => {
            setIsTransitioning(false);
        }, 800); // Duration of the animation

        return () => clearTimeout(timer);
    }, [pathname]);

    return (
        <>
            {isTransitioning && (
                <div className={styles.transitionOverlay}>
                    <div className={styles.iconContainer}>
                        {/* SVG inspired by the provided image, using site colors */}
                        <svg width="200" height="150" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.animatedIcon}>
                            {/* Person 1 and Bubble 1 (Shifted Left) */}
                            <g transform="translate(-10, 0)">
                                {/* Person 1 (Left) - Shifted Down */}
                                <path d="M30 135C30 120 40 110 55 110H65C80 110 90 120 90 135V145H30V135Z" fill="#6A7EBD" stroke="#2C3E50" strokeWidth="4" strokeLinejoin="round" />
                                <path d="M40 95C40 75 80 75 80 95" fill="#FBC02D" stroke="#2C3E50" strokeWidth="4" strokeLinecap="round" />
                                <circle cx="60" cy="90" r="18" fill="#FFFFFF" stroke="#2C3E50" strokeWidth="4" />

                                {/* Speech Bubble 1 (Left) - Scattered Puzzle */}
                                <g className={styles.bubble1}>
                                    <path d="M15 45C15 25 35 10 60 10C85 10 105 25 105 45C105 58 95 69 80 75L70 88L65 75C35 75 15 62 15 45Z" fill="#E8EAF6" stroke="#2C3E50" strokeWidth="4" strokeLinejoin="round" />
                                    <g>
                                        <g className={styles.scatteredPiece1}>
                                            <path d="M 85 20 H 100 V 25 A 3 3 0 1 1 100 30 V 35 H 95 A 3 3 0 1 0 90 35 H 85 V 20 Z" fill="#6A7EBD" stroke="#2C3E50" strokeWidth="1.5" strokeLinejoin="round" transform="translate(-48, -2) rotate(-20 92 27)" />
                                        </g>
                                        <g className={styles.scatteredPiece2}>
                                            <path d="M 100 20 H 115 V 35 H 110 A 3 3 0 1 1 105 35 H 100 V 30 A 3 3 0 1 0 100 25 V 20 Z" fill="#D95C41" stroke="#2C3E50" strokeWidth="1.5" strokeLinejoin="round" transform="translate(-28, 2) rotate(15 107 27)" />
                                        </g>
                                        <g className={styles.scatteredPiece3}>
                                            <path d="M 85 35 H 90 A 3 3 0 1 1 95 35 H 100 V 40 A 3 3 0 1 1 100 45 V 50 H 85 V 35 Z" fill="#FBC02D" stroke="#2C3E50" strokeWidth="1.5" strokeLinejoin="round" transform="translate(-45, 18) rotate(25 92 42)" />
                                        </g>
                                        <g className={styles.scatteredPiece4}>
                                            <path d="M 100 35 H 105 A 3 3 0 1 0 110 35 H 115 V 50 H 100 V 45 A 3 3 0 1 0 100 40 V 35 Z" fill="#81C784" stroke="#2C3E50" strokeWidth="1.5" strokeLinejoin="round" transform="translate(-25, 15) rotate(-15 107 42)" />
                                        </g>
                                    </g>
                                </g>
                            </g>

                            {/* Person 2 and Bubble 2 (Shifted Right) */}
                            <g transform="translate(35, 0)">
                                {/* Person 2 (Right) - Shifted Down */}
                                <path d="M70 135C70 120 80 110 95 110H105C120 110 130 120 130 135V145H70V135Z" fill="#D95C41" stroke="#2C3E50" strokeWidth="4" strokeLinejoin="round" />
                                <path d="M80 95C80 75 120 75 120 95" fill="#FBC02D" stroke="#2C3E50" strokeWidth="4" strokeLinecap="round" />
                                <circle cx="100" cy="90" r="18" fill="#FFFFFF" stroke="#2C3E50" strokeWidth="4" />

                                {/* Speech Bubble 2 (Right) - Assembled Puzzle */}
                                <g className={styles.bubble2}>
                                    <path d="M145 40C145 20 125 5 100 5C75 5 55 20 55 40C55 53 65 64 80 70L90 83L95 70C125 70 145 57 145 40Z" fill="#FBE9E7" stroke="#2C3E50" strokeWidth="4" strokeLinejoin="round" />
                                    <g className={styles.assembledPuzzle}>
                                        <path d="M 85 20 H 100 V 25 A 3 3 0 1 1 100 30 V 35 H 95 A 3 3 0 1 0 90 35 H 85 V 20 Z" fill="#6A7EBD" stroke="#2C3E50" strokeWidth="1.5" strokeLinejoin="round" />
                                        <path d="M 100 20 H 115 V 35 H 110 A 3 3 0 1 1 105 35 H 100 V 30 A 3 3 0 1 0 100 25 V 20 Z" fill="#D95C41" stroke="#2C3E50" strokeWidth="1.5" strokeLinejoin="round" />
                                        <path d="M 85 35 H 90 A 3 3 0 1 1 95 35 H 100 V 40 A 3 3 0 1 1 100 45 V 50 H 85 V 35 Z" fill="#FBC02D" stroke="#2C3E50" strokeWidth="1.5" strokeLinejoin="round" />
                                        <path d="M 100 35 H 105 A 3 3 0 1 0 110 35 H 115 V 50 H 100 V 45 A 3 3 0 1 0 100 40 V 35 Z" fill="#81C784" stroke="#2C3E50" strokeWidth="1.5" strokeLinejoin="round" />
                                    </g>
                                </g>
                            </g>
                        </svg>
                    </div>
                </div>
            )}
            <div className={`${styles.pageContent} ${isTransitioning ? styles.hidden : styles.visible}`}>
                {children}
            </div>
        </>
    );
}
