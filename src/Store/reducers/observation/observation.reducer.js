import * as demoConstants from '../../constants/demoActionTypes.constants';
import * as reducerFunctions from './reducer.function';
import * as actionConstants from '../../constants';
import { LOGOUT } from '../../constants';

const initialState = {
  isDemoMode: false,
  currentObservation: undefined,
  videoPlaying: true,

  fetchingObservations: false,
  observationsLoaded: false,
  observations: [],
  extraObservations: [],
  selectedObservations: [],
  fetchingVerifiedObservations: false,
  verifiedObservationsLoaded: false,
  verifiedObservations: [],

  fetchingActions: false,
  actions: [],

  visits: [],
  fetchingVisits: false,
  normalStateBackup: {},
  allDemoActions: [],
  allDemoVisits: [],

  multipleAction: {
    type: '',
    active: false,
  },
  multipleActionBlocked: false
};

const observationReducer = (
  state = initialState, action
) => {
  const reducerPayload = { action, state, initialState };
  switch (action.type) {
    case actionConstants.TOGGLE_VIDEO_PLAYER: return reducerFunctions.reducerToggleVideoPlayer(reducerPayload);

    case actionConstants.INIT_FETCHING_OBSERVATIONS: return reducerFunctions.reducerInitFetchingObservations(reducerPayload);

    case actionConstants.GET_OBSERVATIONS: return reducerFunctions.reducerGetObservations(reducerPayload);

    case actionConstants.SET_SELECTED_OBSERVATION: return reducerFunctions.reducerSelectObservation(reducerPayload);

    case actionConstants.MULTIPLE_VERIFY_OBSERVATIONS: return reducerFunctions.reducerMultipleVerifyObservations(reducerPayload);

    case actionConstants.MULTIPLE_UNVERIFY_OBSERVATIONS: return reducerFunctions.reducerMultipleUnverifyObservations(reducerPayload);

    case actionConstants.INIT_FETCHING_VERIFIED_OBSERVATIONS: return reducerFunctions.reducerInitFetchingVerifiedObservations(reducerPayload);

    case actionConstants.GET_VERIFIED_OBSERVATIONS: return reducerFunctions.reducerGetVerifiedObservations(reducerPayload);

    case actionConstants.INIT_FETCHING_ACTIONS: return reducerFunctions.reducerInitFetchingActions(reducerPayload);

    case actionConstants.INIT_FETCHING_VISITS: return reducerFunctions.reducerInitFetchingVisits(reducerPayload);

    case actionConstants.GET_OBSERVATIONS_AFTER_LOAD: return reducerFunctions.reducerGetObservationsAfterLoad(reducerPayload);

    case actionConstants.GET_OBSERVATION_VISITS: return reducerFunctions.reducerGetObservationVisits(reducerPayload);

    case actionConstants.ADD_OBSERVATION: return reducerFunctions.reducerAddObservation(reducerPayload);

    case actionConstants.GET_OBSERVATION_ACTIONS: return reducerFunctions.reducerGetObservationActions(reducerPayload);

    case actionConstants.UPDATE_OBSERVATION: return reducerFunctions.reducerUpdateObservation(reducerPayload);

    case actionConstants.NEXT_OBSERVATION: return reducerFunctions.reducerNextObservation(reducerPayload);

    case actionConstants.PREVIOUS_OBSERVATION: return reducerFunctions.reducerPreviousObservation(reducerPayload);

    case actionConstants.CHANGE_SELECTED_OBSERVATION: return reducerFunctions.reducerChangeSelectedObservation(reducerPayload);

    case actionConstants.CHANGE_SELECTED_STORE: return reducerFunctions.reducerChangeSelectedStore(reducerPayload);

    case actionConstants.INIT_MULTI_VERIY_ACTION: return reducerFunctions.reducerInitMultiVerifyAction(reducerPayload);

    case actionConstants.INIT_MULTI_UNVERIY_ACTION: return reducerFunctions.reducerInitMultiUnVerifyAction(reducerPayload);

    case actionConstants.GET_VISIT_IMAGES: return reducerFunctions.reducerGetVisitImages(reducerPayload);

    case demoConstants.START_DEMO: return reducerFunctions.reducerStartDemo(reducerPayload);

    case demoConstants.ADD_EXTRA_OBSERVATION: return reducerFunctions.reducerAddExtraObservation(reducerPayload);

    case demoConstants.DEMO_END: return reducerFunctions.reducerEndDemo(reducerPayload);

    case demoConstants.DEMO_ACTION_ADD: return reducerFunctions.reducerDemoActionAdd(reducerPayload);

    case demoConstants.DEMO_OBSERVATION_UPDATE: return reducerFunctions.reducerDemoObservationUpdate(reducerPayload);

    case demoConstants.DEMO_VISIT_ADD: return reducerFunctions.reducerDemoVisitAdd(reducerPayload);

    case demoConstants.DEMO_VISIT_EXIT: return reducerFunctions.reducerDemoVisitExit(reducerPayload);

    case demoConstants.DEMO_BASKET_UPDATE: return reducerFunctions.reducerDemoBasketUpdate(reducerPayload);

    case LOGOUT: return initialState;
    default:
      return state;
  }
};
export default observationReducer;
