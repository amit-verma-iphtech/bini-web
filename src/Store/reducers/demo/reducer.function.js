/* eslint-disable max-len */
import StepBody from 'Components/IntroJs/StepBody';

const fullDemoSteps = [
  {
    element: '.welcome-model',
    intro: StepBody({ heading: 'Welcome To Ops Dashboard', })
  }, {
    element: '.command-container',
    intro: StepBody({
      heading: 'Command Section',
      description: `
      Almost every thing will be operated from here,
      You will be giving command that will preform some actions
      `,
      points: [
        'Observation Command : ["Observation"] ["verify" or "un-verify"] ["submit" or "reset"]',
        'Visitor Command : ["Visitor"] ["Enter" or "Exit"] ["submit" or "reset"]',
        'Basket Command(Add/Remove items) : ["Basket"] ["Increase Item" or "Reduce Item"] ["Give Count"] ["Select Item"] ["Select Visitor"] ["submit" or "reset"]',
      ]
    })
  },
  {
    element: '.video-preview-container',
    intro: StepBody({ heading: 'Observations Section', description: 'This Observations Section....' })
  },
  {
    element: '.products-container',
    intro: StepBody({ heading: 'Product Section', description: 'This Product Section....' }),
  },
  {
    element: '.user-container',
    intro: StepBody({ heading: 'User Section', description: 'This User Section....' })
  },
  {
    element: '.activity-container',
    intro: StepBody({ heading: 'Activity Section', description: 'This Activity Section....' })
  },
  {
    element: '.command-container',
    intro: StepBody({ heading: 'Command Section', description: 'This Command Section....' })
  },
];

const userDemoSteps = [];
const commandDemoSteps = [];
const observationDemoSteps = [];
const productDemoSteps = [];
const actionDemoSteps = [];

const reducerStartDemo = (params) => {
  const { state, action } = params;

  console.log('Hitting Start Demo....  in demo...');
  return { ...state, isDemoMode: true, loading: false };
};

const reducerToggle = (params) => {
  const { state, action } = params;

  return { ...state, isDemoMode: true, loading: action.payload.loading };
};
const reducerDemoDone = (params) => {
  const { state, action } = params;

  return {
    ...state,
    isFullDemo: false,
    isUserDemo: false,
    isCommandDemo: false,
    isActionDemo: false,
    isObservationsDemo: false,
    loading: false
  };
};
const reducerDemoError = (params) => {
  const { state, action } = params;

  return { ...state, error: true, message: 'SOMETHING WENT WRONG' };
};

const reducerProductDemo = (params) => {
  const { state, action } = params;

  return { ...state, isProductDemo: true, steps: productDemoSteps, loading: false };
};
const reducerActionDemo = (params) => {
  const { state, action } = params;

  return { ...state, isActionDemo: true, steps: actionDemoSteps, loading: false };
};

const reducerFullDemo = (params) => {
  const { state, action } = params;

  return { ...state, isFullDemo: true, steps: fullDemoSteps, loading: false };
};
const reducerUserDemo = (params) => {
  const { state, action } = params;

  return { ...state, isUserDemo: true, steps: userDemoSteps, loading: false };
};
const reducerObservationDemo = (params) => {
  const { state, action } = params;

  return { ...state, isObservationsDemo: true, steps: observationDemoSteps, loading: false };
};
const reducerEndDemo = (params) => {
  const { state, action } = params;

  return { ...state, isObservationsDemo: true, steps: observationDemoSteps, loading: false, isDemoMode: false };
};
const reducerCommandDemo = (params) => {
  const { state, action } = params;

  return { ...state, isCommandDemo: true, steps: commandDemoSteps, loading: false };
  // case TOGGLE_DEMO:
  //   if (action.payload) {
  //     return { ...state, isDemoMode: true, loading: false };
  //   }
  //   return { ...state,
  //     isDemoMode: false,
  //     loading: false,
  //     isFullDemo: false,
  //     isUserDemo: false,
  //     isCommandDemo: false,
  //     isActionDemo: false,
  //     isObservationsDemo: false,
  //   };
};

export {
  reducerStartDemo,
  reducerToggle,
  reducerDemoDone,
  reducerDemoError,
  reducerProductDemo,
  reducerActionDemo,
  reducerFullDemo,
  reducerUserDemo,
  reducerObservationDemo,
  reducerCommandDemo,
  reducerEndDemo
};
