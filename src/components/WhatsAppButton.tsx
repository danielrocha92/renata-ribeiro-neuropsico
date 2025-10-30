'use client';

import React, { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import styles from '@/styles/WhatsAppButton.module.css';

const WhatsAppButton: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);
  const phoneNumber = '5511998765432'; // Replace with your WhatsApp number
  const message = 'Olá! Gostaria de agendar uma consulta.'; // Pre-filled message

  const handleClick = () => {
    window.open(`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div
      className={styles.whatsappButtonContainer}
      onMouseEnter={() => setShowPopup(true)}
      onMouseLeave={() => setShowPopup(false)}
    >
      {showPopup && (
        <div className={styles.whatsappPopup}>
          Fale conosco!
        </div>
      )}
      <button className={styles.whatsappButton} onClick={handleClick} aria-label="Fale conosco pelo WhatsApp">
        <FaWhatsapp size={30} />
      </button>
    </div>
  );
};

export default WhatsAppButton;