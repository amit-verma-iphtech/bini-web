import { Sidebar } from 'Components';
import React from 'react';
import OrganizationManageAccess from './OrganizationManageAccess';
import OrganizationSection from './OrganizationSection';
import StoreSection from './StoreSection';
import styles from './styles.module.scss';
import UsersSection from './UsersSection';

export default function Settings() {
  return (
    <div className={styles.main_section}>
      <Sidebar />
      <div className={styles.settings_container}>
        <div className={styles.right_container}>
          <div className={styles.list_container}>
            <StoreSection />
          </div>
          <div className={styles.list_container}>
            <UsersSection />
          </div>
        </div>
        <div className={styles.left_container}>
          <div className={styles.list_container}>
            <OrganizationSection />
          </div>
          <div className={styles.list_container}>
            <OrganizationManageAccess />
          </div>
        </div>
      </div>
    </div>
  );
}
