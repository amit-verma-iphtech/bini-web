/* eslint-disable max-len */
/* eslint-disable prefer-destructuring */

import * as demoConstants from '../../constants/demoActionTypes.constants';
import * as actionConstants from '../../constants';
import * as reducerFunctions from './reducer.function';
import { LOGOUT } from '../../constants';

const initialState = {
  loading: false,
  isDemoMode: false,
  isProductDemo: false,
  isFullDemo: false,
  isUserDemo: false,
  isCommandDemo: false,
  isActionDemo: false,
  isObservationsDemo: false,
  steps: [],
};

const demoReducer = (
  state = initialState, action
) => {
  const reducerPayload = { state, action, initialState };

  switch (action.type) {
    case demoConstants.START_DEMO: return reducerFunctions.reducerStartDemo(reducerPayload);

    case demoConstants.TOGGLE_LOADING: return reducerFunctions.reducerToggle(reducerPayload);

    case demoConstants.DEMO_DONE: return reducerFunctions.reducerDemoDone(reducerPayload);

    case demoConstants.DEMO_ERROR: return reducerFunctions.reducerDemoError(reducerPayload);

    case demoConstants.PRODUCT_DEMO: return reducerFunctions.reducerProductDemo(reducerPayload);

    case demoConstants.ACTION_DEMO: return reducerFunctions.reducerActionDemo(reducerPayload);

    case demoConstants.FULL_DEMO: return reducerFunctions.reducerFullDemo(reducerPayload);

    case demoConstants.USER_DEMO: return reducerFunctions.reducerUserDemo(reducerPayload);

    case demoConstants.OBSERVATION_DEMO: return reducerFunctions.reducerObservationDemo(reducerPayload);

    case demoConstants.COMMAND_DEMO: return reducerFunctions.reducerCommandDemo(reducerPayload);

    case demoConstants.DEMO_END: return reducerFunctions.reducerEndDemo(reducerPayload);
    case LOGOUT: return initialState;

    default:
      return state;
  }
};
export default demoReducer;
