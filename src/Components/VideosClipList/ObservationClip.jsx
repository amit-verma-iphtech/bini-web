/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Skeleton from 'react-loading-skeleton';
import { findObservationIndex } from 'Helpers';

const ObservationClip = ({ videoUrl, verified, id, loaded, scrollMenuProps: { refs, handleSelect, list } }) => {
  const { currentObservation, selectedObservations } = useSelector((state) => state.observationReducer);
  const [isActive, setIsActive] = useState(false);
  const checkActive = () => {
    // set active true if it's current observation
    const isCurrentObservation = currentObservation?.id === id;
    if (isCurrentObservation) return setIsActive(true);

    // set active true if it's inside selected observations
    const { index } = findObservationIndex(selectedObservations, id);
    const isSelected = index > -1;
    if (isSelected) return setIsActive(true);

    // set active false as no conditions matched
    return setIsActive(false);
  };

  useEffect(() => {
    checkActive();
  }, [currentObservation, selectedObservations, list]);
  function download(dataurl, filename) {
    const link = document.createElement('a');
    link.href = dataurl;
    link.download = filename;
    link.click();
  }

  return (
    <>
      <div ref={refs[id]} onClick={(event) => handleSelect(id, event)} className={`video-clip ${verified ? 'watched' : ''} ${isActive && 'active'}`}>
        <span className="dot">
          <span className="dot-id">
            {id}
          </span>
          <div id="tick-mark" />
          {' '}
        </span>
        {!loaded ? (<Skeleton className="thumbnail" />)
          : <video src={`${videoUrl}#t=1`} />}
      </div>
      {/* <button onClick={() => download(videoUrl, `${id}.mp4`)}>Download Snippet</button> */}
    </>
  );
};
export default ObservationClip;
