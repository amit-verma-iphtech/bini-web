/* eslint-disable no-await-in-loop */
import * as api from 'Api/request';
import __mock__ from 'Store/__mock__';
import { generateObservation } from 'Store/__mock__/observation.mock';
import { handleCatch, handleTry, loadSnippets } from '../helper';

import {
  START_DEMO,
  DEMO_ERROR,
  FULL_DEMO,
  TOGGLE_LOADING,
  ADD_EXTRA_OBSERVATION,
  DEMO_ACTION_ADD,
  DEMO_OBSERVATION_UPDATE,
  DEMO_VISIT_ADD,
  DEMO_VISIT_EXIT
} from '../constants/demoActionTypes.constants';

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

export const startDemo = (formData, setSnackbar, cb) => async (dispatch) => {
  try {
    dispatch({ type: START_DEMO });
    await loadSnippets({
      setSnackbar,
      message: 'Demo Snippets Loaded currently',
      cb,
      code: 200,
      dispatch,
      data: __mock__.observationsMock.observations
    });

    const { addExtraObservationList } = __mock__.observationsMock;
    const extraAvailable = addExtraObservationList.length;

    let count = 0;
    while (count < extraAvailable) {
      console.log('while conditions....1', count, extraAvailable, count < extraAvailable);
      const selected = addExtraObservationList[count];
      console.log('while conditions....2-->selected,observatins>length', selected, __mock__.observationsMock.observations.length);
      const newObservations = generateObservation({ id: (count + 1) + __mock__.observationsMock.observations.length, videoUrl: selected });

      console.log('while conditions....3dispatching', newObservations.id);
      dispatch({ type: ADD_EXTRA_OBSERVATION, payload: newObservations });

      await loadSnippets({
        setSnackbar,
        message: 'New Demo Snippets Loaded currently',
        cb,
        code: 200,
        dispatch,
        data: [newObservations]
      });
      count += 1;
      console.log('while conditions....4 waiting');

      await sleep(5000);
      console.log('while conditions....5 waiting done');
    }
  } catch (error) {
    dispatch({ type: DEMO_ERROR });
  }
};
export const demoCommandVerify = (formData, setSnackbar, cb) => async (dispatch) => {
  try {
    dispatch({ type: DEMO_OBSERVATION_UPDATE, payload: formData });
  } catch (error) {
    dispatch({ type: DEMO_ERROR });
  }
};
export const demoActionAdd = (formData, setSnackbar, cb) => async (dispatch) => {
  try {
    if (!formData.actionOn) throw Error('actionData.actionOn required');
    dispatch({ type: DEMO_ACTION_ADD,
      payload: {
        text: formData.text,
        createdAt: new Date(),
        actionOn: formData.actionOn,
        actionOnType: formData.actionOnType
      } });
  } catch (error) {
    dispatch({ type: DEMO_ERROR });
  }
};
export const demoVisitAdd = (formData, setSnackbar, cb) => async (dispatch) => {
  try {
    dispatch({ type: DEMO_VISIT_ADD, payload: formData });
  } catch (error) {
    console.log('ERROR', error);
    dispatch({ type: DEMO_ERROR, payload: 'Failed to add visitor' });
  }
};
export const demoVisitorExit = (formData, setSnackbar, cb) => async (dispatch) => {
  try {
    console.log('Visitor Exit Action');
    dispatch({ type: DEMO_VISIT_EXIT, payload: { id: formData.id, exit: formData.exit } });
  } catch (error) {
    console.log('Visitor Exit Error', error);

    console.log('ERROR', error);
    dispatch({ type: DEMO_ERROR, payload: 'Failed to add visitor' });
  }
};
