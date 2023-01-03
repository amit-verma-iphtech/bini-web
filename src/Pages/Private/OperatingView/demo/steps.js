import StepBody from 'Components/IntroJs/StepBody';

const OperatingViewDemoSteps = () => {
  ([
    {
      'element': '.hello',
      intro: StepBody({ heading: 'Hello Step', description: 'This is Hello step'
      })
    },
    {
      element: '.world',
      intro: 'World step'
    }
  ]
  );
};

export default OperatingViewDemoSteps;
