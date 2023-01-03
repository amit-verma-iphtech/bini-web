import React, { useEffect } from 'react';
import './styles.scss';
import { ReactComponent as ClockIcon } from 'Assets/icons/ClockIcon.svg';
import { useDispatch, useSelector } from 'react-redux';
import { getObservationActions } from 'Store/actions';
import { GET_OBSERVATION_ACTIONS } from 'Store/constants/actionTypes';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import NoData from 'Components/NoData/NoData';

export default function ActivitySection() {
  const dispatch = useDispatch();
  const { currentObservation, actions: observationActions, fetchingActions, fetchingObservations } = useSelector((state) => state.observationReducer);
  const { isDemoMode } = useSelector((state) => state.demoReducer);

  useEffect(() => {
    if (isDemoMode) return;
    console.log('IsDemoMode Failed To Block--->', isDemoMode);

    if (currentObservation?.id) {
      const data = { observationId: currentObservation.id };
      dispatch(getObservationActions(data, undefined, () => {
        // on response
      }));
    } else {
      dispatch({ type: GET_OBSERVATION_ACTIONS, payload: [] });
    }
  }, [currentObservation]);
  return (
    <div className="main-activities-container">
      <div className="heading">Activity Log</div>
      <div className="activities-list-scroll">

        {(fetchingActions || fetchingObservations) && (!observationActions.length >= 1)
          ? <Skeleton count={4} height={30} className="activity-clip" />
          : (
            <>
              {
                observationActions?.map(({ text, createdAt }, idx) => {
                  const date = new Date(createdAt);
                  return (
                    <div className="activity-clip" key={idx}>
                      <span className="dot" />
                      <div className="activity-item">
                        <div className="text">
                          {text}
                        </div>
                        <div className="time">
                          <span>{date.toLocaleDateString()}</span>
                          <span className="center">
                            <ClockIcon />
                            {' '}
                            {date.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              }
              {observationActions.length >= 1 ? '' : (<NoData name="Actions" />)}
            </>
          )}
      </div>
    </div>
  );
}

export function CommandSection() {
  return (
    <div className="main-command-container">
      <div className="heading">Command Line</div>
      <div className="command-list-scroll">

        Commands....
      </div>
    </div>
  );
}
