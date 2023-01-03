import Lottie from 'react-lottie';
import React, { useEffect, useState } from 'react';
import Icon from 'Assets/learn.json';
import { Sidebar } from 'Components';
import './styles.scss';
import { ReactComponent as IdeaIcon } from 'Assets/icons/idea.svg';
import { useSelector } from 'react-redux';

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: Icon,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};
export const LearnAnimationNoSidebar = () => (
  <div className="learn_icon">
    <Lottie
      options={defaultOptions}
      height={400}
      width={400}
    />
  </div>
);
export function LearnAnimation() {
  return (
    <div className="main-wrapper">
      <Sidebar />
      <div className="learn_icon">
        <Lottie
          options={defaultOptions}
          height={400}
          width={400}
        />
      </div>
    </div>
  );
}
export function LearnIcon({ onClick, active, normal }) {
  const { isFullDemo, isUserDemo, isCommandDemo, isActionDemo, isObservationsDemo, isDemoMode } = useSelector((state) => state.demoReducer);

  const [isHide, setIsHide] = useState(false);

  useEffect(() => {
    if ((isFullDemo || isUserDemo || isCommandDemo || isActionDemo || isObservationsDemo || !isDemoMode) && !normal) {
      setIsHide(true);
    } else setIsHide(false);
  }, [isFullDemo, isUserDemo, isCommandDemo, isActionDemo, isObservationsDemo, isDemoMode]);
  return (
    <>
      {isHide ? <div /> : (
        <div
          className={`idea_icon  ${active ? 'active' : ''} ${normal ? 'normal' : 'absolute'}`}
        // className={`${noStyles ? '' : `idea_icon  ${active ? 'active' : ''}`}`}
          onClick={onClick}
        >
          <div className="icon icon-size"><IdeaIcon /></div>
        </div>
      )}
    </>
  );
}
