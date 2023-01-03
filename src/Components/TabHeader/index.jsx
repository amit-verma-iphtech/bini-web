import React from 'react';
import { ReactComponent as DotsIcon } from 'Assets/icons/dots.svg';
import './style.scss';

export default function TabHeader({ tabOne, tabTwo, isTabOne, setIsTabOne, isDots, isNav }) {
  return (
    <>
      <div className="tab-header">
        <div className="left" />

        <div className="mid">
          <div className={`option-item ${isTabOne ? 'active' : ''}`} onClick={() => setIsTabOne(true)}>
            <span className="dot" />
            {' '}
            {tabOne}

            <span className={`border-bottom ${isNav ? 'border-bottom-nav' : ''}`} />
          </div>
          <div className={`option-item ${!isTabOne ? 'active' : ''}`} onClick={() => setIsTabOne(false)}>
            <span className="dot" />
            {tabTwo}
            <span className={`border-bottom ${isNav ? 'border-bottom-nav' : ''}`} />

          </div>
        </div>
        <div className="right">
          {isDots && <DotsIcon />}
        </div>

      </div>
    </>
  );
}
