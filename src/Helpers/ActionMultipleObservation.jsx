import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { unverify_multiple_observation, verify_multiple_observation } from 'Store/actions';
import { CHANGE_SELECTED_OBSERVATION } from 'Store/constants/actionTypes';

const constants = {
  verify: 'verify',
  unverify: 'unverify'
};
export default function ActionMultipleObservation() {
  const {
    storeReducer: { currentStore },
    observationReducer: {
      selectedObservations,
      multipleAction: action,
      multipleActionBlocked },
    authReducer: { user },
  } = useSelector((state) => state);
  const dispatch = useDispatch();
  const verify = (list) => {
    dispatch(verify_multiple_observation({ observationIds: list, userId: user.id, storeId: currentStore.id }));
  };
  const unverify = (list) => {
    dispatch(unverify_multiple_observation({ observationIds: list, userId: user.id }));
  };
  const handleMultiple = (type) => {
    const list = selectedObservations.map(({ id }) => id);
    if (!(list.length > 0)) { return alert('No Observations Selected'); }
    if (type === constants.verify) {
      return verify(list);
    }
    if (type === constants.unverify) {
      return unverify(list);
    }
  };
  useEffect(() => {
    console.log('changes....happen', multipleActionBlocked, action);
    if (!action.active) return console.log('action.active is false');
    if ((constants.unverify !== action.type) && (constants.verify !== action.type)) return alert('Invalid Action');

    handleMultiple(action.type);
  }, [action]);
  return (<></>);
}
export const dispatchChangeObservation = (observation, dispatch) => {
  console.log('setting diapatch...000',);
  dispatch({ type: CHANGE_SELECTED_OBSERVATION, payload: observation });
};
