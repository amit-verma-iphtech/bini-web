import { Pathname } from 'Routes';

const reducerAuth = (params) => {
  const { state, action } = params;

  if (action?.payload) {
    localStorage.setItem('jwt', JSON.stringify({ ...action.payload }));

    localStorage.setItem('userProfile', JSON.stringify({ user: action.payload.user }));
    localStorage.setItem('jwtToken', JSON.stringify({ token: action.payload.token }));
    return { ...state, token: action.payload.token, user: action.payload.user, error: undefined, isLoggedIn: true };
  }
  return state;
};
const reducerAutoLogin = (params) => {
  const { state, action } = params;

  return { ...state,
    token: action.payload.token,
    user: action.payload.user,
    error: undefined,
    isLoggedIn: true,
    stayLoggedIn: action.payload.stayLoggedIn
  };
};
const reducerGetUserById = (params) => {
  const { state, action } = params;

  return { ...state, getUserById: { ...action.payload } };
};
const reducerGetAllUsers = (params) => {
  const { state, action } = params;

  return { ...state, allUsers: action.payload.data };
};
const reducerLogout = (params) => {
  const { state, action, initialState } = params;

  localStorage.clear();
  localStorage.setItem('stayLoggedIn', JSON.stringify({ stayLoggedIn: true }));
  action.payload.history.push(Pathname.signIn);
  return initialState;
};

export {
  reducerAuth,
  reducerAutoLogin,
  reducerGetAllUsers,
  reducerGetUserById,
  reducerLogout,
};
