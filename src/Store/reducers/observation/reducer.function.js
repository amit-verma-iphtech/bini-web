import __mock__ from 'Store/__mock__';

const reducerGetObservations = (params) => {
  const { state, action } = params;

  const modifiedData = action.payload.data.map((observation) => ({ ...observation, loaded: false }));
  const observationsLoaded = !(modifiedData.length > 0);
  // const currentObservationId = localStorage.getItem('currentObservation');
  // const currentObservation = findObjectByIdFromList(modifiedData, currentObservationId);

  // const search = (id) => id === currentObservationId * 1;
  // const index = modifiedData.findIndex(search);
  // let currentObservation;
  // if (index !== -1) {
  //   currentObservation = modifiedData[index];
  // }
  return {
    ...state,
    observations: modifiedData,
    observationsLoaded,
    fetchingObservations: false,
    // ...currentObservation && { currentObservation }
  };
};
const reducerToggleVideoPlayer = (params) => {
  const { state, action } = params;

  return { ...state, videoPlaying: !state.videoPlaying };
};

const reducerMultipleVerifyObservations = (params) => {
  const { state, action } = params; {
    const { newObservations, observationIds } = action.payload;
    let lastModifiedObservationIndex = null;

    const modifiedNewObservations = newObservations.map((observation) => ({ ...observation, loaded: false }));
    const observationsLoaded = !(modifiedNewObservations.length > 0);

    const modifiedCurrentObservations = state.observations.map((observation, idx) => {
      // checking if this observation is available in the selected observations we are preforming action on...
      const search = (id) => id === observation.id;
      const index = observationIds.findIndex(search);

      if (index === -1) return observation;
      lastModifiedObservationIndex = idx;

      return ({ ...observation, verified: true, });
    });

    let currentObservation;
    if (lastModifiedObservationIndex >= 0) currentObservation = modifiedCurrentObservations[lastModifiedObservationIndex + 1];

    const observations = [...modifiedCurrentObservations, ...modifiedNewObservations];
    const newState = { ...state,
      observationsLoaded,
      observations,
      ...currentObservation && { currentObservation },
      multipleAction: {
        type: '',
        active: false,
      },
      multipleActionBlocked: false };

    return newState;
  }
};

const reducerMultipleUnverifyObservations = (params) => {
  const { state, action } = params;

  const { observationIds } = action.payload;
  let lastModifiedObservationIndex = null;

  const modifiedCurrentObservations = state.observations.map((observation, idx) => {
    // checking if this observation is available in the selected observations we are preforming action on...
    const search = (id) => id === observation.id;
    const index = observationIds.findIndex(search);

    if (index === -1) return observation;
    lastModifiedObservationIndex = idx;
    return ({ ...observation, verified: false, });
  });

  const observations = modifiedCurrentObservations;

  let currentObservation;
  if (lastModifiedObservationIndex >= 0) currentObservation = modifiedCurrentObservations[lastModifiedObservationIndex + 1];
  const newState = { ...state,
    observations,
    ...currentObservation && { currentObservation },
    multipleAction: {
      type: '',
      active: false,
    },
    multipleActionBlocked: false };

  return newState;
};

const reducerInitFetchingVerifiedObservations = (params) => {
  const { state, action } = params;

  return { ...state, fetchingVerifiedObservations: true };
};
const reducerSelectObservation = (params) => {
  const { state, action } = params;

  return { ...state, selectedObservations: action.payload };
};
const reducerInitFetchingActions = (params) => {
  const { state, action } = params;

  return { ...state, fetchingActions: true };
};
const reducerInitFetchingVisits = (params) => {
  const { state, action } = params;

  return { ...state, fetchingVisits: true };
};
const reducerGetObservationsAfterLoad = (params) => {
  const { state, action } = params;

  let lastObservationUpdated = false;
  let modifiedCurrentIndex;
  const newObservations = state.observations.map((observation, idx) => {
    const search = (element) => observation.id === element.id;
    const index = action.payload.data.findIndex(search);
    if (index === -1) {
      return observation;
    }
    if (idx + 1 === state.observations.length) {
      lastObservationUpdated = true;
    }
    const newObservation = { ...action.payload.data[index], loaded: true };
    if (newObservation?.id === state.currentObservation?.id) {
      modifiedCurrentIndex = newObservation;
    }
    return newObservation;
  });

  return {
    ...state,
    observations: newObservations,
    observationsLoaded: lastObservationUpdated,
    ...modifiedCurrentIndex && { currentObservation: modifiedCurrentIndex }
  };
};

const reducerUpdateObservation = (params) => {
  const { state, action } = params;

  const { observations, currentObservation: { id } } = state;
  const updatedObservation = action.payload.data;
  if (updatedObservation?.id) {
    const updatedObservations = observations
      .map((obData) => (obData.id === updatedObservation.id ? {
        ...updatedObservation, loaded: true, videoUrl: obData.videoUrl
      } : obData));
    return { ...state, observations: updatedObservations };
  }
  return { ...state };
};
const reducerGetVerifiedObservations = (params) => {
  const { state, action } = params;

  const modifiedData = action.payload.data.map((observation) => ({ ...observation, loaded: true }));
  // const observationsLoaded = !(modifiedData.length > 0);
  return { ...state, verifiedObservations: modifiedData, fetchingVerifiedObservations: false };
};

const reducerNextObservation = (params) => {
  const { state, action } = params;

  const { observations, currentObservation: { id } } = state;
  const search = (obj) => obj.id * 1 === id;
  let observationIdx = observations.findIndex(search);
  let currentObservation;
  if (observationIdx !== -1) {
    observationIdx += 1;
    currentObservation = observations[observationIdx];
  }
  // const newObservations = observations.filter((obj) => obj.id !== id);
  if (state.isDemoMode) {
    const filterActions = state.allDemoActions.filter(({ actionOn, actionAt }) => {
      // actionOn === currentObservation.id;
      const actionDate = new Date(actionAt);
      const observationStart = new Date(currentObservation.start);
      const observationEnd = new Date(currentObservation.end);
      return (actionDate >= observationStart) || (actionDate <= observationEnd);
    });
    const filterVisitors = state.allDemoVisits.filter(({ start, end }) => {
      const visitorStart = new Date(start);
      const visitorEnd = new Date(end);
      const observationStart = new Date(currentObservation.start);
      const observationEnd = new Date(currentObservation.end);
      return (end === null && visitorStart <= observationStart) || (visitorEnd >= visitorStart && visitorStart <= observationStart);
    });
    return { ...state, currentObservation, actions: filterActions, visits: filterVisitors };
  }
  return { ...state,
    currentObservation,
    // observations: newObservations
  };
};

const reducerPreviousObservation = (params) => {
  const { state, action } = params;

  const { observations, currentObservation: { id } } = state;
  const search = (obj) => obj.id * 1 === id;
  let observationIdx = observations.findIndex(search);
  let currentObservation;
  let rest;
  if (observationIdx > 1) {
    observationIdx -= 1;
    currentObservation = observations[observationIdx];
  } else {
    [currentObservation, ...rest] = observations;
  }
  if (state.isDemoMode) {
    const filterActions = state.allDemoActions.filter(({ actionOn, actionAt }) => {
      // actionOn === currentObservation.id;
      const actionDate = new Date(actionAt);
      const observationStart = new Date(currentObservation.start);
      const observationEnd = new Date(currentObservation.end);
      return (actionDate >= observationStart) || (actionDate <= observationEnd);
    });
    const filterVisitors = state.allDemoVisits.filter(({ start, end }) => {
      const visitorStart = new Date(start);
      const visitorEnd = new Date(end);
      const observationStart = new Date(currentObservation.start);
      const observationEnd = new Date(currentObservation.end);
      return (end === null && visitorStart <= observationStart) || (visitorEnd >= visitorStart && visitorStart <= observationStart);
    });
    return { ...state, currentObservation, actions: filterActions, visits: filterVisitors };
  }
  return { ...state, currentObservation, };
};

const reducerChangeSelectedObservation = (params) => {
  const { state, action } = params;

  const currentObservation = action.payload;
  if (state.isDemoMode) {
    const filterActions = state.allDemoActions.filter(({ actionOn, actionAt }) => {
      // actionOn === currentObservation.id;
      const actionDate = new Date(actionAt);
      const observationStart = new Date(currentObservation.start);
      const observationEnd = new Date(currentObservation.end);
      return (actionDate >= observationStart) || (actionDate <= observationEnd);
    });
    const filterVisitors = state.allDemoVisits.filter(({ start, end }) => {
      const visitorStart = new Date(start);
      const visitorEnd = new Date(end);
      const observationStart = new Date(currentObservation.start);
      const observationEnd = new Date(currentObservation.end);
      return (end === null && visitorStart <= observationStart) || (visitorEnd >= visitorStart && visitorStart <= observationStart);
    });
    return { ...state, currentObservation, actions: filterActions, visits: filterVisitors };
  }
  return { ...state, currentObservation };
};

const reducerChangeSelectedStore = (params) => {
  const { state, action } = params;

  return { ...state, observations: [], visits: [], actions: [], currentObservation: undefined };
};
const reducerGetObservationVisits = (params) => {
  const { state, action } = params;

  return { ...state, visits: action.payload.data || [], fetchingVisits: false };
};

const reducerAddObservation = (params) => {
  const { state, action } = params;

  const newObservations = [...state.observations];
  action.payload.data.data.map((obj) => newObservations.push({ ...obj, loaded: false }));
  return { ...state, observations: newObservations };
};

const reducerInitFetchingObservations = (params) => {
  const { state, action } = params;

  return { ...state, fetchingObservations: true };
};

const reducerGetObservationActions = (params) => {
  const { state, action } = params;
  return { ...state, actions: action.payload.data || [], fetchingActions: false };
};

const reducerStartDemo = (params) => {
  const { state, action } = params;

  console.log('Hitting Start Demo....  in observations...');

  const { observations, verifiedObservations, allDemoActions,
    allDemoVisits } = __mock__.observationsMock;
  console.log('******observations....', observations);
  return { ...state,
    normalStateBackup: state,
    observations,
    // visits: [],
    currentObservation: observations[0],
    verifiedObservations,
    // actions: [],
    isDemoMode: true,
    allDemoActions,
    allDemoVisits,
    actions: allDemoActions,
    visits: allDemoVisits
  };
};

const reducerEndDemo = (params) => {
  const { state, action } = params;
  console.log('Hitting in observations End Demo....', state, action);
  if (Object.keys(state.normalStateBackup).length > 0) return { ...state.normalStateBackup, isDemoMode: false };

  alert('You are not on demo mode');
  return state;
};
const reducerDemoActionAdd = (params) => {
  const { state, action } = params;

  return { ...state, allDemoActions: [...state.allDemoActions, action.payload], actions: [...state.actions, action.payload] };
};
const reducerDemoObservationUpdate = (params) => {
  const { state, action } = params;

  const modifiedObservations = state.observations.map(
    (props) => (props.id === action.payload.id ? { ...props, verified: action.payload.verified } : props)
  );
  return { ...state, observations: modifiedObservations };
};
const reducerDemoVisitAdd = (params) => {
  const { state, action } = params;

  return { ...state, allDemoVisits: [...state.allDemoVisits, action.payload], visits: [...state.visits, action.payload] };
};
const reducerDemoVisitExit = (params) => {
  const { state, action } = params;

  console.log('Visitor Exit Reducer');

  // const allVisitDemoAlreadyIn = state.allDemoVisits.filter(({ user: { id }, end }) => id === action.payload.userId && (!end || end === null));
  // const visitAlreadyIn = state.visits.filter(({ user: { id }, end }) => id === action.payload.userId && (!end || end === null));
  const exit = action.payload.exit || new Date();
  // console.log('Reducer Visitors LIst,', allVisitDemoAlreadyIn, visitAlreadyIn, exit);
  // if (!allVisitDemoAlreadyIn[0] || !visitAlreadyIn[0]) return { ...state };

  const modifier = (list, id) => list.map((props) => (props.id === id ? { ...props, end: exit } : props));
  const modifiedAllDemoVisits = modifier(state.allDemoVisits, action.payload.id);
  const modifiedVisits = modifier(state.visits, action.payload.id);
  console.log('Reducer Modified Visitors LIst,', modifiedAllDemoVisits, modifiedVisits, exit);
  return { ...state, allDemoVisits: modifiedAllDemoVisits, visits: modifiedVisits };
};
const reducerDemoBasketUpdate = (params) => {
  const { state, action } = params;

  console.log('DEMO_BASKET_UPDATE--> 00', action.payload);
  console.log('DEMO_BASKET_UPDATE--> 11', state.allDemoVisits, state.visits);

  const modifier = (list, visitor) => list.map((props) => (props.id === visitor.id ? visitor : props));
  const modifiedAllDemoVisits = modifier(state.allDemoVisits, action.payload);
  const modifiedVisits = modifier(state.visits, action.payload);
  console.log('DEMO_BASKET_UPDATE--> 22', modifiedAllDemoVisits, modifiedVisits);
  return { ...state, allDemoVisits: modifiedAllDemoVisits, visits: modifiedVisits };
};
const reducerInitMultiVerifyAction = (params) => {
  const { state, action } = params;

  if (state.multipleActionBlocked) return { ...state };
  return { ...state,
    multipleAction: {
      type: 'verify',
      active: true,
    },
    multipleActionBlocked: true
  };
};
const reducerInitMultiUnVerifyAction = (params) => {
  const { state, action } = params;

  if (state.multipleActionBlocked) return { ...state };
  return { ...state,
    multipleAction: {
      type: 'unverify',
      active: true,
    },
    multipleActionBlocked: true
  };
};
const reducerAddExtraObservation = (params) => {
  const { state, action } = params;

  return { ...state, observations: [...state.observations, action.payload] };
};
const reducerGetVisitImages = (params) => {
  const { state, action } = params;

  console.log('fetchImages,,,,,001', action.payload);
  const list = action.payload.data;
  const { visitId } = action.payload;
  const visitModified = state.visits.map((visit) => {
    const obj = { ...visit };
    // eslint-disable-next-line radix
    if (parseInt(visit.id) === parseInt(visitId)) obj.images = list;
    return obj;
  });
  return { ...state, visits: visitModified };
};

export {
  reducerGetObservations,
  reducerSelectObservation,
  reducerToggleVideoPlayer,
  reducerInitFetchingObservations,
  reducerMultipleVerifyObservations,
  reducerMultipleUnverifyObservations,
  reducerInitFetchingVerifiedObservations,
  reducerGetVerifiedObservations,
  reducerInitFetchingActions,
  reducerInitFetchingVisits,
  reducerGetObservationsAfterLoad,
  reducerUpdateObservation,
  reducerNextObservation,
  reducerPreviousObservation,
  reducerChangeSelectedObservation,
  reducerChangeSelectedStore,
  reducerGetObservationVisits,
  reducerAddObservation,
  reducerGetObservationActions,
  reducerStartDemo,
  reducerAddExtraObservation,
  reducerEndDemo,
  reducerDemoActionAdd,
  reducerDemoObservationUpdate,
  reducerDemoVisitAdd,
  reducerDemoVisitExit,
  reducerDemoBasketUpdate,
  reducerInitMultiVerifyAction,
  reducerInitMultiUnVerifyAction,
  reducerGetVisitImages,
};
