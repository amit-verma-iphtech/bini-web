import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import MuiTable from './MuiTable';
import styles from './styles.module.scss';

export default function OrganizationSection() {
  const { organizations, currentStore } = useSelector((state) => state.storeReducer);

  useEffect(() => {

  }, []);
  return (
    <div className={styles.store_section}>
      <div className={styles.section_title}>
        OrganizationSection
      </div>
      <div className={styles.section_list}>
        {organizations.map((store) => (
          <li>
            {store.name}
            {/* <ActionButtons /> */}
          </li>
        ))}
      </div>
      {/* <MuiTable /> */}
    </div>
  );
}
