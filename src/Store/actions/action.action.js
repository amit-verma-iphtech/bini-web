import * as api from 'Api/request';
import { handleCatch, handleTry } from '../helper';

import {
  ACTION_ERROR, CREATE_ACTION, GET_OBSERVATION_ACTIONS, INIT_FETCHING_ACTIONS
} from '../constants/actionTypes';

export const getObservationActions = (formData, setSnackbar, cb) => async (dispatch) => {
  try {
    dispatch({ type: INIT_FETCHING_ACTIONS });
    const response = await api.requestGetActions(formData);
    const { message, length, data, code } = response;
    handleTry({
      dispatch,
      dispatchType: GET_OBSERVATION_ACTIONS,
      dispatchPayload: { data },
      setSnackbar,
      message,
      cb,
      cbData: { data },
      code
    });
  } catch (response) {
    handleCatch({ response, setSnackbar, cb, dispatch, dispatchType: ACTION_ERROR });
  }
};

export const createAction = (formData, setSnackbar, cb) => async (dispatch) => {
  try {
    const response = await api.requestCreateAction(formData);
    const { message, code, ...data } = response;
    handleTry({
      dispatch,
      dispatchType: CREATE_ACTION,
      dispatchPayload: { data },
      setSnackbar,
      message,
      cb,
      cbData: { data },
      code
    });
  } catch (response) {
    handleCatch({ response, setSnackbar, cb, dispatch, dispatchType: ACTION_ERROR });
  }
};
