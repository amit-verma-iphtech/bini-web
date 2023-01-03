import React from 'react';
import './styles.scss';

export default function Button({ text, children, ...props }) {
  return (
    <>
      <button className="action-button" {...props}>{children || text || 'Submit'}</button>
    </>
  );
}
