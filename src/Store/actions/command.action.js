import * as api from 'Api/request';
import { handleCatch, handleTry } from '../helper';
import {
  AUTH,
  AUTH_ERROR,
  LOGOUT,
} from '../constants/actionTypes';

export const addRemoveBasketItem = (formData, setSnackbar, cb) => async (dispatch) => {
  try {
    const response = await api.requestAddRemoveItem(formData);
    const { message, code } = response;
    handleTry({
      dispatch,
      dispatchType: 'ITEM_ADD_REMOVE',
      dispatchPayload: { data: response },
      setSnackbar,
      message,
      cb,
      cbData: { data: response },
      code
    });
  } catch (response) {
    handleCatch({ response, setSnackbar, cb, dispatch, dispatchType: AUTH_ERROR });
  }
};

export const addVisit = (formData, setSnackbar, cb) => async (dispatch) => {
  try {
    const response = await api.requestAddVisit({ ...formData });
    const { message, code } = response;
    handleTry({
      dispatch,
      dispatchType: 'ADD_VISIT',
      dispatchPayload: { data: response },
      setSnackbar,
      message,
      cb,
      cbData: { data: response, message },
      code
    });
  } catch (response) {
    handleCatch({ response, setSnackbar, cb, dispatch, dispatchType: AUTH_ERROR });
  }
};
export const exitVisit = (formData, setSnackbar, cb) => async (dispatch) => {
  try {
    const response = await api.requestUpdateVisit({ ...formData });
    const { message, code } = response;
    handleTry({
      dispatch,
      dispatchType: 'ITEM_ADD_REMOVE',
      dispatchPayload: { data: response },
      setSnackbar,
      message,
      cb,
      cbData: { data: response },
      code
    });
  } catch (response) {
    handleCatch({ response, setSnackbar, cb, dispatch, dispatchType: AUTH_ERROR });
  }
};
