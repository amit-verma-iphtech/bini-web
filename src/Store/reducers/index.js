import { combineReducers } from 'redux';
import authReducer from './auth/auth.reducer';
import observationReducer from './observation/observation.reducer';

import storeReducer from './store/store.reducer';
import commandReducer from './command/command.reducer';
import demoReducer from './demo/demo.reducer';

export default combineReducers({
  authReducer,
  observationReducer,

  storeReducer,
  commandReducer,
  demoReducer,
});
