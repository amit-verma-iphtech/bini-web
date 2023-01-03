import Lottie from 'react-lottie';
import React from 'react';
import ComingSoonIcon from 'Assets/coming_soon.json';
import { Sidebar, CustomDialog } from 'Components';
import styles from './styles.module.scss';

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: ComingSoonIcon,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};
export const ComingSoonSection = () => (
  <div className={styles.coming_soon}>
    <Lottie
      options={defaultOptions}
      height={400}
      width={400}
    />
  </div>
);
export const ComingSoonModel = ({ open, setOpen }) => (
  <CustomDialog open={open} setOpen={setOpen} fullWidth>
    <div className={styles.coming_soon}>
      <Lottie
        options={defaultOptions}
        height={400}
        width={400}
      />
    </div>
  </CustomDialog>
);
