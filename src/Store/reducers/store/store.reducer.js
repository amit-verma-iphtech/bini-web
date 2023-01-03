/* eslint-disable prefer-destructuring */
import { DEMO_END, START_DEMO } from 'Store/constants/demoActionTypes.constants';

import * as actionConstants from '../../constants';
import { LOGOUT } from '../../constants';
import * as reducerFunctions from './reducer.function';

const initialState = {
  stores: [],
  currentStore: undefined,
  selectedStoreId: 0,
  items: [],
  normalStateBackup: {},
  organizations: []
};

const storeReducer = (
  state = initialState, action
) => {
  const reducerPayload = { state, action };
  switch (action.type) {
    // case actionConstants.GET_STORES: return reducerFunctions.reducerGetStore(reducerPayload);

    case actionConstants.GET_STORE_ITEMS: return reducerFunctions.reducerGetStoreItems(reducerPayload);

    case actionConstants.CHANGE_SELECTED_STORE: return reducerFunctions.reducerChangeSelectedStore(reducerPayload);

    case actionConstants.LOAD_SELECTED_STORE_ID: return reducerFunctions.reducerLoadSelectedStoreId(reducerPayload);
    case actionConstants.GET_ORGANIZATIONS: return reducerFunctions.reducerGetOrganizations(reducerPayload);

    case START_DEMO: return reducerFunctions.reducerStartDemo(reducerPayload);

    case DEMO_END: return reducerFunctions.reducerEndDemo(reducerPayload);

    case LOGOUT: return initialState;
    default:
      return state;
  }
};
export default storeReducer;
