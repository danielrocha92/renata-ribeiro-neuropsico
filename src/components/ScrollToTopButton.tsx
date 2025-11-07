'use client';

import React, { useState, useEffect } from 'react';
import { FiArrowUp } from 'react-icons/fi';
import styles from '@/styles/ScrollToTopButton.module.css';

const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
    });
  };

  return (
    <div className={styles.scrollToTopButtonContainer}>
      {isVisible && (
        <button className={styles.scrollToTopButton} onClick={scrollToTop} aria-label="Voltar ao topo">
          <FiArrowUp size={30} />
        </button>
      )}
    </div>
  );
};

export default ScrollToTopButton;