import { Sidebar } from 'Components';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styles from './styles.module.scss';

export default function HomeScreen() {
  const { stores } = useSelector((state) => state.storeReducer);
  const [message, setMessage] = useState('Waiting...');
  useEffect(() => {
    if (stores.length > 0) {
      setMessage('Welcome!, Please Navigate to Products Tab to add/remove/modify products.');
    } else {
      setMessage('Please ask admin to give you access for your organization.');
    }
  }, [stores.length]);
  return (
    <div className={styles.main_section}>
      <Sidebar />
      <div className={styles.section_preview}>
        <div className={styles.section_preview_actions}>
          <div className={styles.section_home_message}>
            {message}
          </div>
        </div>
      </div>
    </div>
  );
}
