/* eslint-disable import/no-cycle */
import { getObservationActions, getObservationVisits, verify_multiple_observation, updateObservation,
  verifyObservation
} from 'Store/actions';
import * as api from 'Api/request';
import { SET_NEW_COMMAND_SUGGESTIONS } from 'Store/constants/actionTypes';
import { addRemoveBasketItem, addVisit, exitVisit } from 'Store/actions/command.action';
import { commandTypeList } from '.';
import {
  handleDemoAddRemoveItem,
  handleDemoAddVisitor,
  handleDemoCommandUnVerify,
  handleDemoCommandVerify,
  handleDemoExitVisitor
} from './demoCommand.helper';

export const commandVerifyObservation = async (commandData) => {
  const { data, dispatch, useSelector, isDemoMode, setCommands, actionData, user, setSnackbar, commands, storeData } = commandData;
  data.verified = true;
  actionData.text = `Observation verified by ${user.name}`;
  actionData.action = 'verify operator';
  if (isDemoMode) {
    actionData.actionOn = actionData.observationId;
    setCommands([]);
    return handleDemoCommandVerify({ data, actionData, dispatch, useSelector, setSnackbar });
  }

  dispatch(updateObservation(data, undefined, ({ status }) => {
    if (status) setSnackbar({ isVisible: true, type: 'success', message: 'Observation Submitted' });
    else setSnackbar({ isVisible: true, type: 'error', message: 'Failed to submit observation' });

    console.log('init verifyObseration...1', data, commandData);
    const params = { storeId: storeData.id, userId: user.id, limit: 10, extra: 1 };
    dispatch(verifyObservation(params));
  }));
  setCommands([]);

  actionData.actionOn = data.id;
  actionData.actionOnType = 'observation';
  api.requestCreateAction(actionData);
  // const params = { observationId: data.id };
  // dispatch(verifyObservation(params));
  // dispatch(getObservationActions(params));
  // dispatch(getObservationVisits(params));
};
export const command_verify_multiple_observation = async (commandData) => {
  const { data, dispatch, setCommands, actionData, user, setSnackbar, commands, storeData } = commandData;
  const modifiedObservationList = data.map((obj) => ({ ...obj, verified: true, }));
  actionData.text = `Observation verified by ${user.name}`;
  actionData.actionOn = data.id;
  actionData.action = 'verify operator';
  actionData.actionOnType = 'observation';

  dispatch(verify_multiple_observation(modifiedObservationList, setSnackbar, ({ status }) => {
    const params = { storeId: storeData.id, userId: user.id, limit: 10, extra: data.length };
    dispatch(verifyObservation(params));
  }));
  setCommands([]);

  api.requestCreateAction(actionData);
  // const params = { observationId: data.id };
  // dispatch(verifyObservation(params));
  // dispatch(getObservationActions(params));
  // dispatch(getObservationVisits(params));
};
export const commandUnVerifyObservation = async (commandData) => {
  const { data, dispatch, useSelector, isDemoMode, setCommands, actionData, user, setSnackbar, commands } = commandData;
  data.verified = false;
  actionData.text = `Observation disapproved by ${user.name}`;
  actionData.actionOn = data.id;
  actionData.action = 'unverify operator';
  actionData.actionOnType = 'observation';
  if (isDemoMode) {
    setCommands([]);
    return handleDemoCommandUnVerify({ data, actionData, dispatch, useSelector, setSnackbar });
  }

  dispatch(updateObservation(data));
  setCommands([]);

  api.requestCreateAction(actionData);

  const params = { observationId: data.id };
  dispatch(getObservationActions(params));
  dispatch(getObservationVisits(params));
};
export const commandAddVisitor = async (commandData) => {
  const { data, dispatch, useSelector, isDemoMode, setCommands, actionData, user, setSnackbar, commands } = commandData;

  if (isDemoMode) {
    setCommands([]);
    return handleDemoAddVisitor({ data, actionData, dispatch, useSelector, setSnackbar });
  }

  dispatch(addVisit({ ...data, observationId: undefined, userName: undefined }, undefined, async ({ data: responseData, message }) => {
    actionData.text = `${data.userName} entered into store`;
    actionData.action = 'enter visitor';
    actionData.visitId = responseData.id;
    if (message) actionData.text = message;
    actionData.actionOn = data.observationId; // should be visit Id
    actionData.actionOnType = 'visit';
    await api.requestCreateAction(actionData);
    const params = { observationId: data.observationId };
    dispatch(getObservationActions(params));
    dispatch(getObservationVisits(params));
  }));
  setCommands([]);
};
export const commandExitVisitor = async (commandData) => {
  const { data, dispatch, useSelector, isDemoMode, setCommands, actionData, user, setSnackbar, commands } = commandData;
  actionData.text = `${data.userName} exit store`;
  actionData.action = 'exit visit';
  actionData.visitId = data.userId; // userId is visitId here

  actionData.actionOn = data.observationId; // should be visit Id
  actionData.actionOnType = 'visit';

  if (isDemoMode) {
    setCommands([]);
    return handleDemoExitVisitor({ data, actionData, dispatch, useSelector, setSnackbar });
  }

  dispatch(exitVisit({ ...data, id: data.userId, userId: undefined }));
  setCommands([]);

  await api.requestCreateAction(actionData);

  const params = { observationId: data.observationId };
  dispatch(getObservationActions(params));
  dispatch(getObservationVisits(params));
};
export const commandAddRemoveItem = async (commandData) => {
  const { data, dispatch, useSelector, isDemoMode, setCommands, actionData, user, setSnackbar, commands, userName, itemName } = commandData;
  if (data.add) {
    actionData.text = `${data.add} ${itemName}-${data.itemId} added in ${userName}'s basket`;
    actionData.action = 'pickup item visitor'; // should be visit Id
  } else {
    actionData.text = `${data.remove} ${itemName}-${data.itemId} removed from ${userName}'s basket`;
    actionData.action = 'putback item visitor'; // should be visit Id
  }
  actionData.actionOn = data.basketId; // should be visit Id
  actionData.actionOnType = 'basket';
  actionData.visitId = data.visitId;

  if (isDemoMode) {
    actionData.actionOn = data.observationId; // should be observationId
    setCommands([]);
    return handleDemoAddRemoveItem({ data, actionData, dispatch, useSelector, setSnackbar, userName, itemName });
  }

  dispatch(addRemoveBasketItem({ ...data, observationId: undefined }));
  setCommands([]);

  await api.requestCreateAction(actionData);

  const params = { observationId: data.observationId };
  dispatch(getObservationActions(params));
  dispatch(getObservationVisits(params));
};
export const commandInvalid = async (commandData, suggestionList) => {
  const { data, dispatch, setCommands, actionData, user, setSnackbar, commands, message } = commandData;
  setSnackbar({ isVisible: true, type: 'error', message: message || 'Invalid Command' });

  const newCommands = [...commands];
  newCommands.pop();
  suggestionList && dispatch({ type: SET_NEW_COMMAND_SUGGESTIONS, payload: suggestionList });
  setCommands(newCommands);
};
export const resetCommand = async (commandData, suggestionList) => {
  const { data, dispatch, setCommands, actionData, user, setSnackbar, commands } = commandData;
  setSnackbar({ isVisible: true, type: 'success', message: 'Commands reset' });
  suggestionList && dispatch({ type: SET_NEW_COMMAND_SUGGESTIONS, payload: commandTypeList });
  setCommands([]);
};
