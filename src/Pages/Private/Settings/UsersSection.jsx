import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import MuiTable from './MuiTable';
import styles from './styles.module.scss';

export default function UsersSection() {
  const { authReducer: { user, allUsers }, } = useSelector((state) => state);
  const columns = [
    { id: 'id', label: 'Id', minWidth: 100 },
    { id: 'name', label: 'Name', minWidth: 170 },
    {
      id: 'mobileNo',
      label: 'Mobile',
      // minWidth: 170,
      align: 'right',
    },
    {
      id: 'role',
      label: 'Role',
    },
    {
      id: 'email',
      label: 'Email',
    },
    {
      id: 'customerId',
      label: 'Customer Id',
    },
    {
      id: 'avatar',
      label: 'Avatar',
    },
  ];
  const [rows, setRows] = useState([]);
  function createRow({ name, id, email, mobileNo, role, customerID, avatar }) {
    return { name, id, email, mobileNo, role, customerID, avatar };
  }
  useEffect(() => {
    const modifiedList = allUsers.map((value) => createRow(value));
    setRows(modifiedList);
  }, [allUsers]);
  return (
    <div>
      <div className={styles.section_title}>
        UsersSection
      </div>
      <div className={styles.section_list}>
        <MuiTable {...{ columns, rows }} />
        {/* {allUsers.map((user) => (
          <li>
            {user.name}
          </li>
        ))} */}
      </div>
    </div>
  );
}
