import React from 'react';
import styles from './home.module.scss';
import logo from '@/assets/images/logos/logo.avif';

export const Home = () => {
  return (
    <div className={styles.containerHome}>
      <div className={styles.confidentialBox}>
        <img src={logo} alt="logo"  className={styles.logo}/>
        <div className={styles.confidentialTitle}>
          Confidencialidad y seguridad de la información
        </div>
        <div className={styles.confidentialText}>
          Al acceder y utilizar este sistema, usted se compromete a proteger la confidencialidad de toda la información contenida dentro del mismo. Se prohíbe estrictamente la divulgación no autorizada de cualquier dato o información a terceros. El incumplimiento de estas condiciones puede resultar en acciones legales de acuerdo con las leyes aplicables. Agradecemos su compromiso con la seguridad y la integridad de la información.
        </div>
      </div>
    </div>
  );
}
