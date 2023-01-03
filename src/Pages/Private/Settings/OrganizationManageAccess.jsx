import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import MuiTable from './MuiTable';
import styles from './styles.module.scss';

const SelectInput = (props) => {
  const { label, placeholder, options, onChange, value, defaultValue, disabled } = props;
  return (
    <div className={styles.input_group}>
      <label className={styles.input_group_label}>{label || 'NaN'}</label>
      <select
        disabled={disabled}
        placeholder={placeholder || label}
        onChange={onChange}
        className={styles.input_group_input}
        defaultValue={defaultValue}
        value={value}
      >
        <option value="">Please Select Value</option>

        {options?.map(({ name, value }) => <option value={value}>{name}</option>)}
      </select>
    </div>
  );
};

const initialSelectedOrganizationState = {
  id: '',
  users: [],
  stores: [],
  name: 'No Observation Selected'
};
export default function OrganizationManageAccess() {
  const { organizations, currentStore } = useSelector((state) => state.storeReducer);
  const [selectedOrganization, setSelectedOrganization] = useState(initialSelectedOrganizationState);
  const handleSelectOrg = (evt) => {
    console.log('organization-log(handleSelect)-evt', evt.currentTarget.value);
    const selected = organizations.find(({ id }) => evt.currentTarget.value * 1 === id * 1);
    console.log('organization-log(handleSelect)-selected', selected, organizations);
    if (selected) {
      return setSelectedOrganization(selected);
    }
  };
  useEffect(() => {
    console.log('organization-log(selectedOrg)', selectedOrganization);
  }, [selectedOrganization]);
  return (
    <div className={styles.store_section}>
      <div className={styles.section_title}>
        {selectedOrganization.name}
      </div>

      <SelectInput
              // disabled={isItemNotInSuggestedItemsList}
        onChange={handleSelectOrg}
        defaultValue={selectedOrganization.id}
        value={selectedOrganization.id}
        label="Select Organization"
        options={organizations.map((org) => ({ value: org.id, name: org.name }))}
        // customOptions={customOptions}
        // isLoading={loadingItems}
      />
      <div>
        Users...
      </div>
      <div className={styles.section_list}>
        {selectedOrganization.users.map((user) => (
          <li className={styles.list_item}>
            {user.name}
            {/* <ActionButtons /> */}
          </li>
        ))}
      </div>
      <div>Stores....</div>
      <div className={styles.section_list}>
        {selectedOrganization.stores.map((user) => (
          <li className={styles.list_item}>
            {user.name}
            {/* <ActionButtons /> */}
          </li>
        ))}
      </div>
      {/* <MuiTable /> */}
    </div>
  );
}
