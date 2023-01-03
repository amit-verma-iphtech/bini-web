import * as api from 'Api/request';
import { handleCatch, handleTry } from '../helper';
import {
  AUTH,
  AUTH_ERROR,
  LOGOUT,
} from '../constants/actionTypes';

export const signUp = (formData, setSnackbar, cb) => async (dispatch) => {
  try {
    const response = await api.requestSignUp(formData);
    const { user, tokens, message, code } = response;
    handleTry({
      dispatch,
      dispatchType: AUTH,
      dispatchPayload: { user, token: tokens?.access?.token },
      setSnackbar,
      message,
      cb,
      cbData: { uniqueId: user?._id },
      code
    });
  } catch (response) {
    handleCatch({ response, setSnackbar, cb, dispatch, dispatchType: AUTH_ERROR });
  }
};

export const signIn = (formData, setSnackbar, cb) => async (dispatch) => {
  try {
    const response = await api.requestSignIn(formData);
    const { message, user, tokens, code } = response;
    handleTry({
      dispatch,
      dispatchType: AUTH,
      dispatchPayload: { user, token: tokens?.access?.token },
      setSnackbar,
      message,
      cb,
      code
    });
  } catch (response) {
    handleCatch({ response, setSnackbar, cb, dispatch, dispatchType: AUTH_ERROR });
  }
};

export const signOut = (formData, setSnackbar, cb, history) => async (dispatch) => {
  try {
    handleTry({
      dispatch,
      dispatchType: LOGOUT,
      dispatchPayload: { history },
      setSnackbar,
      message: 'Successfully Logged Out',
      cb,
      cbData: true
    });
  } catch ({ response }) {
    handleCatch({ response, setSnackbar, cb, dispatch, dispatchType: AUTH_ERROR });
  }
};
