/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
import * as api from 'Api/request';
import {
  // getThumbnails,
  handleCatch,
  handleTry,
  loadSnippets,
  prefetch_file
} from '../helper';

import * as actionConstants from '../constants';
import dummyObservation from '../../Assets/dummyObservations.json';

export const getObservations = (formData, setSnackbar, cb) => async (dispatch) => {
  try {
    dispatch({ type: actionConstants.INIT_FETCHING_OBSERVATIONS });

    const response = await api.requestGetObservations(formData);
    const { message, length, data, code } = response;
    handleTry({
      dispatch,
      dispatchType: actionConstants.GET_OBSERVATIONS,
      dispatchPayload: { data },
      setSnackbar,
      message,
      cb,
      cbData: { data },
      code
    });
    if (code === 200) {
      loadSnippets({
        setSnackbar,
        message,
        cb,
        code,
        dispatch,
        data
      });
    }
  } catch (response) {
    handleCatch({ response, setSnackbar, cb, dispatch, dispatchType: actionConstants.OBSERVATION_ERROR });
  }
};

export const viewAllObservations = (formData, setSnackbar, cb) => async (dispatch) => {
  try {
    console.log('getting... dummy..');
    dispatch({ type: actionConstants.INIT_FETCHING_OBSERVATIONS });
    const response = { data: dummyObservation.data, message: 'Successfully', code: 200 };
    const { message, data, code } = response;
    console.log('getting... dummy.. done, saving now', data, message, code);
    handleTry({
      dispatch,
      dispatchType: actionConstants.GET_OBSERVATIONS,
      dispatchPayload: { data },
      setSnackbar,
      message,
      cb,
      cbData: { data },
      code
    });
    if (code === 200) {
      loadSnippets({
        setSnackbar,
        message,
        cb,
        code,
        dispatch,
        data
      });
    }
  } catch (response) {
    handleCatch({ response, setSnackbar, cb, dispatch, dispatchType: actionConstants.OBSERVATION_ERROR });
  }
};
export const getVerifiedObservations = (formData, setSnackbar, cb) => async (dispatch) => {
  try {
    dispatch({ type: actionConstants.INIT_FETCHING_VERIFIED_OBSERVATIONS });

    const response = await api.requestGetVerifiedObservations(formData);
    const { message, length, data, code } = response;
    handleTry({
      dispatch,
      dispatchType: actionConstants.GET_VERIFIED_OBSERVATIONS,
      dispatchPayload: { data },
      setSnackbar,
      message,
      cb,
      cbData: { data },
      code
    });
    // loadSnippets({
    //   setSnackbar,
    //   message,
    //   cb,
    //   code,
    //   dispatch,
    //   data
    // });
  } catch (response) {
    handleCatch({ response, setSnackbar, cb, dispatch, dispatchType: actionConstants.OBSERVATION_ERROR });
  }
};

export const getObservationVisits = (formData, setSnackbar, cb) => async (dispatch) => {
  try {
    dispatch({ type: actionConstants.INIT_FETCHING_VISITS });

    const response = await api.requestGetVisits(formData);
    const { message, length, data, code } = response;
    handleTry({
      dispatch,
      dispatchType: actionConstants.GET_OBSERVATION_VISITS,
      dispatchPayload: { data },
      setSnackbar,
      message,
      cb,
      cbData: { data },
      code
    });
  } catch (response) {
    handleCatch({ response, setSnackbar, cb, dispatch, dispatchType: actionConstants.OBSERVATION_ERROR });
  }
};
export const updateObservation = (formData, setSnackbar, cb) => async (dispatch) => {
  try {
    const response = await api.requestUpdateObservation(formData);
    const { message, code, ...data } = response;
    handleTry({
      dispatch,
      dispatchType: actionConstants.UPDATE_OBSERVATION,
      dispatchPayload: { data },
      setSnackbar,
      message,
      cb,
      cbData: { data },
      code
    });

    dispatch({ type: actionConstants.NEXT_OBSERVATION });
  } catch (response) {
    handleCatch({ response, setSnackbar, cb, dispatch, dispatchType: actionConstants.OBSERVATION_ERROR });
  }
};

export const verify_multiple_observation = (formData, setSnackbar, cb) => async (dispatch) => {
  try {
    const response = await api.requestVerify_multiple_observation(formData);
    const { message, code, data, ...props } = response;
    const payload = { newObservations: data, observationIds: formData.observationIds };
    handleTry({
      dispatch,
      dispatchType: actionConstants.MULTIPLE_VERIFY_OBSERVATIONS,
      dispatchPayload: payload,
      setSnackbar,
      message,
      cb,
      cbData: payload,
      code
    });
    if (code === 200) {
      loadSnippets({
        setSnackbar,
        message,
        cb,
        code,
        dispatch,
        data
      });
    }
  } catch (response) {
    handleCatch({ response, setSnackbar, cb, dispatch, dispatchType: actionConstants.OBSERVATION_ERROR });
  }
};
export const unverify_multiple_observation = (formData, setSnackbar, cb) => async (dispatch) => {
  try {
    const response = await api.requestUnverify_multiple_observation(formData);
    const { message, code, ...data } = response;
    const payload = { newObservations: data, observationIds: formData.observationIds };
    handleTry({
      dispatch,
      dispatchType: actionConstants.MULTIPLE_UNVERIFY_OBSERVATIONS,
      dispatchPayload: payload,
      setSnackbar,
      message,
      cb,
      cbData: payload,
      code
    });
  } catch (response) {
    handleCatch({ response, setSnackbar, cb, dispatch, dispatchType: actionConstants.OBSERVATION_ERROR });
  }
};
export const verifyObservation = (formData, setSnackbar, cb) => async (dispatch) => {
  console.log('initExtraObservation....');
  try {
    const response = await api.requestGetExtraObservation(formData);
    console.log('got response-->', response);
    const { message, code, ...data } = response;

    handleTry({
      dispatch,
      dispatchType: actionConstants.ADD_OBSERVATION,
      dispatchPayload: { data },
      setSnackbar,
      message,
      cb,
      cbData: { data },
      code
    });
    if (code === 200) {
      loadSnippets({
        setSnackbar,
        message,
        cb,
        code,
        dispatch,
        data: data.data
      });
    }
  } catch (response) {
    handleCatch({ response, setSnackbar, cb, dispatch, dispatchType: actionConstants.VISIT_ERROR });
  }
};
