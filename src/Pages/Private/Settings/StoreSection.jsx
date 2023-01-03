import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import MuiTable from './MuiTable';
import styles from './styles.module.scss';

export default function StoreSection() {
  const { stores, currentStore } = useSelector((state) => state.storeReducer);
  const columns = [
    { id: 'id', label: 'Id', minWidth: 100 },
    { id: 'name', label: 'Name', minWidth: 170 },
    {
      id: 'description',
      label: 'Description',
      minWidth: 170,
      align: 'right',
    },
  ];
  const [rows, setRows] = useState([]);
  function createRow({ name, id, description }) {
    return { name, id, description };
  }
  useEffect(() => {
    const modifiedList = stores.map((store) => createRow(store));
    setRows(modifiedList);
  }, [stores]);

  return (
    <div className={styles.store_section}>
      <div className={styles.section_title}>
        StoreSection
      </div>
      <div className={styles.section_list} />
      <MuiTable {...{ rows, columns }} />
    </div>
  );
}
