import React from 'react';
import './styles.scss';

export default function NoData({ name }) {
  return (
    <>
      <div className="no-data">
        No
        {' '}
        {name}
        {' '}
        Available
      </div>
    </>
  );
}
