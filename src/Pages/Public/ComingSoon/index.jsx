import Lottie from 'react-lottie';
import React from 'react';
import ComingSoonIcon from 'Assets/coming_soon.json';
import './styles.scss';
import { Sidebar } from 'Components';

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: ComingSoonIcon,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};
export const ComingSoonNoSidebar = () => (
  <div className="coming_soon">
    <Lottie
      options={defaultOptions}
      height={400}
      width={400}
    />
  </div>
);

export function ComingSoon() {
  return (
    <div className="main-wrapper">
      <Sidebar />
      <div className="coming_soon">
        <Lottie
          options={defaultOptions}
          height={400}
          width={400}
        />
      </div>
    </div>
  );
}
