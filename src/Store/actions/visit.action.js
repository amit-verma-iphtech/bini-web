import * as api from 'Api/request';
import { GET_ALL_USERS, GET_VISIT_IMAGES, USER_ERROR } from 'Store/constants/actionTypes';
import { handleCatch, handleTry } from '../helper';

export const getUsers = (formData, setSnackbar, cb) => async (dispatch) => {
  try {
    const response = await api.requestGetUsers(formData);
    const { message, length, data, code } = response;
    handleTry({
      dispatch,
      dispatchType: GET_ALL_USERS,
      dispatchPayload: { data },
      setSnackbar,
      message,
      cb,
      cbData: { data },
      code
    });
  } catch (response) {
    handleCatch({ response, setSnackbar, cb, dispatch, dispatchType: USER_ERROR });
  }
};
export const getVisitImages = (formData, setSnackbar, cb) => async (dispatch) => {
  try {
    console.log('fetchImages,,,,,00', 'action');
    const response = await api.requestGetVisitImages(formData);
    console.log('fetchImages,,,,,01', response);
    const { message, length, data, code } = response;
    handleTry({
      dispatch,
      dispatchType: GET_VISIT_IMAGES,
      dispatchPayload: { data, visitId: formData.visitId },
      setSnackbar,
      message,
      cb,
      cbData: { data },
      code
    });
  } catch (response) {
    handleCatch({ response, setSnackbar, cb, dispatch, dispatchType: USER_ERROR });
  }
};
