import React, { Component, useEffect, useState } from 'react';
import { render } from 'react-dom';
import { Steps, Hints } from 'intro.js-react';

import 'intro.js/introjs.css';
import './style.scss';
import { useDispatch, useSelector } from 'react-redux';
import { DEMO_DONE } from 'Store/constants/demoActionTypes.constants';

export default function DemoSteps({
  hintsEnabled,
  stepsEnabled,
  initialStep = 0,
  hints,
  setState,
  state
}) {
  const dispatch = useDispatch();
  const { isDemoMode, isFullDemo, steps } = useSelector((state) => state.demoReducer);
  useEffect(() => {
    console.log('Demo-Steps', state);
  }, [state]);
  const onExit = () => {
    dispatch({ type: DEMO_DONE });
    setState(() => ({ ...state, stepsEnabled: false }));
  };
  return (
    <div className="demo-container">
      <Steps
        enabled={isDemoMode && (isFullDemo)}
        steps={steps}
        initialStep={initialStep}
        onExit={onExit}
        onBeforeExit={(event) => console.log('Step---onBeforeExit', event)}
        onStart={(event) => console.log('Step---onStart', event)}
        onChange={(event) => console.log('Step---onChange', event)}
        onBeforeChange={(event) => console.log('Step---onBeforeChange', event)}
        onAfterChange={(event) => console.log('Step---onAfterChange', event)}
        onPreventChange={(event) => console.log('Step---onPreventChange', event)}
        onComplete={(event) => console.log('Step---onComplete', event)}
        // options={(event) => console.log('Step---options', event)}
      />
      <Hints enabled={hintsEnabled} hints={hints} />
    </div>
  );
}
