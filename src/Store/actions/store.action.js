import * as api from 'Api/request';
import { handleCatch, handleTry } from '../helper';

import * as actionConstants from '../constants';

export const getStores = (formData, setSnackbar, cb) => async (dispatch) => {
  try {
    const response = await api.requestGetStores(formData);
    const { message, length, data, code } = response;
    handleTry({
      dispatch,
      dispatchType: actionConstants.GET_STORES,
      dispatchPayload: { data },
      setSnackbar,
      message,
      cb,
      cbData: { data },
      code
    });
  } catch (response) {
    handleCatch({ response, setSnackbar, cb, dispatch, dispatchType: actionConstants.STORE_ERROR });
  }
};
export const getOrganizations = (formData, setSnackbar, cb) => async (dispatch) => {
  try {
    const response = await api.requestGetOrganizations(formData);
    const { message, length, data, code } = response;
    handleTry({
      dispatch,
      dispatchType: actionConstants.GET_ORGANIZATIONS,
      dispatchPayload: { data },
      setSnackbar,
      message,
      cb,
      cbData: { data },
      code
    });
  } catch (response) {
    handleCatch({ response, setSnackbar, cb, dispatch, dispatchType: actionConstants.STORE_ERROR });
  }
};

export const getStoreProducts = (formData, setSnackbar, cb) => async (dispatch) => {
  try {
    const response = await api.requestGetStoreProducts(formData);
    const { message, length, data, code } = response;
    handleTry({
      dispatch,
      dispatchType: actionConstants.GET_STORE_ITEMS,
      dispatchPayload: { data },
      setSnackbar,
      message,
      cb,
      cbData: { data },
      code
    });
  } catch (response) {
    handleCatch({ response, setSnackbar, cb, dispatch, dispatchType: actionConstants.STORE_ERROR });
  }
};
