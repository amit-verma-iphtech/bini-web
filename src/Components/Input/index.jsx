/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import './styles.scss';

/* eslint-disable no-use-before-define */
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

export function TextInput({ className, type, ...props }) {
  const [isPassword, setPassword] = useState(type === 'password');
  return (
    <>
      {/* {type === 'password' && <button onClick={() => setPassword(!isPassword)}>{isPassword ? 'Show' : 'Hide'}</button>} */}
      <input className={`input-text ${className}`} type={`${isPassword ? 'password' : 'text'}`} {...props} />
    </>
  );
}
export function SelectInput({ className, children, options, customOptions, ...props }) {
  return (

    <>
      <select className={`select-input ${className}`} {...props}>
        {children || options?.map((option, idx) => <option key={idx} value={option.value}>{option.name}</option>)}
        {Array.isArray(customOptions) && customOptions?.map((option, idx) => <option key={idx} value={option.value}>{option.name}</option>)}
      </select>
    </>
  );
}

export function AutoCompleteInput({ value, options: data, searchFor, onSuggestSelect, ...props }) {
  return (
    <div style={{ width: 300 }}>
      <Autocomplete
        freeSolo
        options={data.map((option) => option[searchFor])}
        onChange={onSuggestSelect}
        value={value}
        renderInput={(params) => (
          <TextField {...params} margin="normal" variant="standard" {...props} />
        )}
      />

    </div>
  );
}
