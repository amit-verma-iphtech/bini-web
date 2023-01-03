import React, { Component, useState } from 'react';
import { render } from 'react-dom';
import { Steps, Hints } from 'intro.js-react';

import 'intro.js/introjs.css';
import './style.scss';

const step = ({ heading, description }) => (
  <>
    <h2>{heading}</h2>
    <p>{description}</p>
  </>
);

export default function DemoInto() {
  const [state, setState] = useState({
    stepsEnabled: false,
    initialStep: 0,
    steps: [
      {
        element: '.hello',
        intro: step({ heading: 'Hello Step', description: 'This is Hello step' })
      },
      {
        element: '.world',
        intro: 'World step'
      }
    ],
    hintsEnabled: false,
    hints: [
      {
        element: '.hello-hint',
        hint: 'Hello hint',
        hintPosition: 'middle-right'
      }
    ]
  });
  const {
    stepsEnabled,
    steps,
    initialStep,
    hintsEnabled,
    hints
  } = state;
  const onExit = () => {
    setState(() => ({ ...state, stepsEnabled: false }));
  };

  const toggleSteps = () => {
    setState((prevState) => ({ ...state, stepsEnabled: !prevState.stepsEnabled }));
  };

  const addStep = () => {
    console.log('adding step');
    const newStep = {
      element: '.alive',
      intro: 'Alive step'
    };

    setState({ ...state, steps: [...state.steps, newStep] });
  };

  const toggleHints = () => {
    setState((prevState) => ({ ...state, hintsEnabled: !prevState.hintsEnabled }));
  };

  const addHint = () => {
    const newHint = {
      element: '.alive-hint',
      hint: 'Alive hint',
      hintPosition: 'middle-right'
    };

    setState((prevState) => ({ ...state, hints: [...prevState.hints, newHint] }));
  };
  return (
    <div className="demo-container">
      <Steps
        enabled={stepsEnabled}
        steps={steps}
        initialStep={initialStep}
        onExit={onExit}
      />
      <Hints enabled={hintsEnabled} hints={hints} />

      <div className="controls">
        <div>
          <button onClick={toggleSteps}>Toggle Steps</button>
          <button onClick={addStep}>Add Step</button>
        </div>
        <div>
          <button onClick={toggleHints}>Toggle Hints</button>
          <button onClick={addHint}>Add Hint</button>
        </div>
      </div>

      <h1 className="hello">
        <span>hello</span>
        <span className="hello-hint hint" />
      </h1>
      <hr />
      <h1 className="world">
        <span>world</span>
        <span className="world-hint hint" />
      </h1>
      <hr />
      <h1 className="alive">
        <span>alive</span>
        <span className="alive-hint hint" />
      </h1>
    </div>

  );
}
