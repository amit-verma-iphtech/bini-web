import { commandTypeList } from 'Components/CommandSection';

import * as demoConstants from '../../constants/demoActionTypes.constants';
import * as actionConstants from '../../constants';
import * as reducerFunctions from './reducer.function';
import { LOGOUT } from '../../constants';

const initialState = {
  allAvailableCommands: [],
  currentSuggestions: commandTypeList,
  typingMode: false
};

const commandReducer = (
  state = initialState, action
) => {
  const reducerPayload = { state, action, initialState };

  switch (action.type) {
    case actionConstants.SET_NEW_COMMAND_SUGGESTIONS: return reducerFunctions.reducerNewCommandSuggestion(reducerPayload);

    case actionConstants.TURN_ON_TYPING_MODE: return reducerFunctions.reducerTurnOnTypingMode(reducerPayload);

    case actionConstants.TURN_OFF_TYPING_MODE: return reducerFunctions.reducerTurnOffTypingMode(reducerPayload);
    case LOGOUT: return initialState;

    default:
      return state;
  }
};
export default commandReducer;
