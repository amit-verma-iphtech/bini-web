import * as actionConstants from '../../constants';
import { LOGOUT } from '../../constants';
import * as reducerFunctions from './reducer.function';

const initialState = {
  token: undefined,
  user: undefined,
  allUsers: [],
  getUserById: undefined
};

const authReducer = (
  state = initialState, action
) => {
  const reducerPayload = { state, action, initialState };
  switch (action.type) {
    case actionConstants.AUTH: return reducerFunctions.reducerAuth(reducerPayload);

    case actionConstants.AUTO_LOGIN: return reducerFunctions.reducerAutoLogin(reducerPayload);

    case actionConstants.GET_ALL_USERS: return reducerFunctions.reducerGetAllUsers(reducerPayload);

    case actionConstants.GET_USER_BY_ID: return reducerFunctions.reducerGetUserById(reducerPayload);

    case actionConstants.LOGOUT: return reducerFunctions.reducerLogout(reducerPayload);

    default:
      return state;
  }
};
export default authReducer;
