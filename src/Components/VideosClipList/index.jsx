/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getObservations, getVerifiedObservations, viewAllObservations } from 'Store/actions';
import { CHANGE_SELECTED_OBSERVATION, SET_SELECTED_OBSERVATION } from 'Store/constants/actionTypes';
import './styles.scss';

import TabHeader from 'Components/TabHeader';
import { findObjectByIdFromList } from 'Store/helper';
import { dispatchChangeObservation as dispatchObservation } from 'Helpers/ActionMultipleObservation';
import { ScrollMenuVerified, ScrollMenuUnverified } from './ScrollMenu';

const constants = { VERIFIED: 'VERIFIED', NOT_VERIFIED: 'NOT_VERIFIED' };

export default function VideoClipList() {
  const dispatch = useDispatch();
  const dispatchChangeObservation = (props) => dispatchObservation(props, dispatch);
  const [showVerified, setShowVerified] = useState(false);

  const {
    storeReducer: { currentStore },
    observationReducer: { observations, currentObservation, observationsLoaded, verifiedObservations, selectedObservations },
    authReducer: { user, },
  } = useSelector((state) => state);
  const setSelectedObservations = (list) => {
    dispatch({ type: SET_SELECTED_OBSERVATION, payload: list });
  };

  useEffect(() => {
    console.log('selectedObservations--->', selectedObservations);
  }, [selectedObservations]);

  // setting default select input
  useEffect(() => {
    if (currentObservation?.id) {
      setSelectedObservations([currentObservation]);
    }
  }, [currentObservation]);

  const { isDemoMode } = useSelector((state) => state.demoReducer);
  // getting store observations and verified observations
  useEffect(() => {
    if (isDemoMode) return;
    if (currentStore?.id) {
      const data = { storeId: currentStore.id, userId: user.id, limit: 10 };
      dispatch(getObservations(data));
      dispatch(getVerifiedObservations(data));
    }
  }, [currentStore]);

  // creating refs for scroll tracing... on observation clips
  // const refs = observations.reduce((acc, value) => {
  //   acc[value.id] = React.createRef();
  //   return acc;
  // }, {});
  // // creating refs for scroll tracing... on verified-observation clips
  // const verifiedRefs = verifiedObservations.reduce((acc, value) => {
  //   acc[value.id] = React.createRef();
  //   return acc;
  // }, {});
  // useEffect(() => {
  //   console.log('toggle verified-->', verifiedRefs, verifiedObservations);
  //   console.log('toggle unverified-->', refs, observations);
  // }, [showVerified]);
  // scroll to selected observation if currentObservation changes
  // useEffect(() => {
  //   if (currentObservation?.id && refs[currentObservation.id] && (refs[currentObservation.id].current !== null)) {
  //     const idx = findObjectByIdFromList(observations, currentObservation.id);
  //     if ((idx === -1)) return;
  //     refs[currentObservation.id].current.scrollIntoView({
  //       behavior: 'smooth',
  //       block: 'start',
  //     });
  //   }
  // }, [currentObservation, showVerified]);
  // useEffect(() => {
  //   if (currentObservation?.id && refs[currentObservation.id] && (refs[currentObservation.id].current !== null)) {
  //     const idx = findObjectByIdFromList(verifiedObservations, currentObservation.id);
  //     if ((idx === -1)) return;
  //     verifiedRefs[currentObservation.id].current.scrollIntoView({
  //       behavior: 'smooth',
  //       block: 'start',
  //     });
  //   }
  // }, [currentObservation, showVerified]);

  // dispatch change-observation
  const handleMultiSelect = (selectedObservation) => {
    const newSelected = [...selectedObservations];
    const search = (obj) => obj.id * 1 === selectedObservation.id * 1;
    const index = newSelected.findIndex(search);
    if (index === -1) {
      newSelected.push(selectedObservation);
    } else {
      newSelected.splice(index, 1);
    }
    setSelectedObservations(newSelected);
  };

  const initChangeObservation = (id, event, observationsList) => {
    console.log('setting 00');
    const isMultiSelect = (event.metaKey || event.ctrlKey);
    console.log('handleSelect-->', id, isMultiSelect, event.metaKey, event.ctrlKey);
    const search = (obj) => obj.id * 1 === id;
    const observationIdx = observationsList.findIndex(search);
    if (observationIdx !== -1) {
      const selectedObservation = observationsList[observationIdx];
      if (isMultiSelect) {
        handleMultiSelect(selectedObservation);
      } else {
        dispatchChangeObservation(selectedObservation);
      }
    }
  };

  const handleSelect = (type, id, event) => {
    console.log('setting 02');

    if (type === constants.NOT_VERIFIED) {
      initChangeObservation(id, event, observations);
    } else if (type === constants.VERIFIED) {
      initChangeObservation(id, event, verifiedObservations);
    } else {
      console.log('type not matched');
    }
  };

  // setting default selected observation....
  useEffect(() => {
    // if (!showVerified) {
    //   console.log('setting 03');

    //   // console.log('handleSelectObservation....', (!currentObservation || (currentObservation && currentObservation.storeId === currentStore.id)) && observations.length >= 1);
    //   // console.log('handleSelectObservation....', !currentObservation, !!currentObservation, currentObservation.storeId === currentStore.id, observations.length >= 1);

    //   const currentObservationId = localStorage.getItem('currentObservation');
    //   const lastLoginObservation = findObjectByIdFromList(observations, currentObservationId);
    //   const checkIndex = observations.findIndex(({ id }) => currentObservation?.id === id);
    //   if ((!currentObservation || (currentObservation && checkIndex === -1)) && observations.length >= 1) {
    //     const observation = lastLoginObservation || observations.filter(({ verified }) => !verified)[0];
    //     console.log('triggering...handleSelect', observation, lastLoginObservation, currentObservationId);
    //     dispatchChangeObservation(observation);
    //   }
    // }
    // if (showVerified) {
    //   console.log('setting 04');

    //   console.log('handleSelectVerifiedObservation....');
    //   const currentObservationId = localStorage.getItem('currentObservation');
    //   const lastLoginObservation = findObjectByIdFromList(verifiedObservations, currentObservationId);
    //   const checkIndex = observations.findIndex(({ id }) => verifiedObservations?.id === id);
    //   if ((!currentObservation || (currentObservation && checkIndex === -1)) && verifiedObservations.length >= 1) {
    //     const observation = lastLoginObservation || verifiedObservations[verifiedObservations.length - 1];
    //     console.log('triggering...handleSelectVerified', observation, lastLoginObservation, currentObservationId);
    //     dispatchChangeObservation(observation);
    //   }
    // }
  }, [observations, verifiedObservations, showVerified]);
  const [currenQueue, setCurrenQueue] = useState(0);
  const loadViewObservations = () => {
    const data = { storeId: currentStore.id, userId: user.id, limit: 100 };
    dispatch(viewAllObservations(data));
  };

  return (
    <div className="main-videoClip-container">
      <div className="head">
        <div className="text">
          Current Users (Ranked by top matching) [
          {showVerified ? `${currenQueue} verified snippets out of ${verifiedObservations.length}` : `${observations?.length} un-verified snippets`}
          {' '}
          Observations]
          [current-observation-id :
          {' '}
          {currentObservation?.id || 'NaN'}
          ] || (
          {!observationsLoaded ? 'Observation still loading...' : 'Observation loaded fully'}
          )
          {/* <button onClick={loadViewObservations}>View 100 Observations</button> */}
        </div>
      </div>
      <TabHeader tabTwo="Un-Verified" tabOne="Verified" isTabOne={showVerified} setIsTabOne={setShowVerified} />
      {showVerified
        ? <ScrollMenuVerified list={verifiedObservations} handleSelect={handleSelect} type={constants.VERIFIED} setCurrenQueue={setCurrenQueue} showVerified={showVerified} />
        : <ScrollMenuUnverified list={observations} handleSelect={handleSelect} type={constants.NOT_VERIFIED} showVerified={showVerified} />}

    </div>
  );
}
