/* eslint-disable arrow-body-style */
import { Sidebar, CommandSection } from 'Components';
import ActivitySection from 'Components/ActivitySection';
import ProductsClipList from 'Components/ProductsClipList';
import ToggleButtons from 'Components/ToggleButton';
import UsersCipList from 'Components/UsersClipList';
// import { VideoPlayer } from 'Components/VideoPlayer';
import VideoClipList from 'Components/VideosClipList';
import React, { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import './styles.scss';
import { ComingSoonNoSidebar } from 'Pages/Public';
import { useSelector } from 'react-redux';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { formatDate, getTimeDifference } from 'Helpers';
import TabHeader from 'Components/TabHeader';
import DemoSteps from 'Components/IntroJs';
import { LearnAnimation, LearnIcon } from 'Components/LearnIcon';
import TagImg from 'Components/ShelfCanvas';
import PreloadVideo from './PreloadVideo';

const VideoPlayer = ({ playerRef, currentObservation, observations, time, fetchingObservations }) => {
  return (
    <div className="video-player">
      {fetchingObservations && !observations.length >= 1
        ? (<Skeleton className="player-skeleton" width="100%" />) : (
          <video
            ref={playerRef}
            className="react-player"
            src={currentObservation?.videoUrl}
            controls
            autoPlay
          />
        )}

      <div className="details-box">
        {currentObservation?.createdAt ? (
          <>
            <div className="label">
              Start At :
              {' '}
              {formatDate(currentObservation?.start).toString()}
            </div>
            <div className="label">
              End At :
              {' '}
              {formatDate(currentObservation?.end).toString()}
            </div>
          </>
        ) : observations.length >= 1 && <Skeleton width={100} height={10} />}
        {time ? (
          <div className="label">
            Time Passed :
            {' '}
            {time}
          </div>
        ) : observations.length >= 1 && <Skeleton width={100} height={10} />}
      </div>
    </div>

  );
};

export default function OperatingView() {
  const { currentObservation, observationsLoaded, fetchingObservations, observations } = useSelector((state) => state.observationReducer);
  const { isDemoMode, isFullDemo, loading: isDemoLoading } = useSelector((state) => state.demoReducer);

  const [isLive, setIsLive] = useState(false);
  const playerRef = useRef(null);
  const [time, setTime] = useState('');
  useEffect(() => {
    if (!currentObservation?.start && time) {
      setTime('');
    }
    if (!currentObservation?.start) return;
    const interval = setInterval(() => {
      const gapCount = getTimeDifference(currentObservation?.start);
      setTime(gapCount);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [currentObservation]);
  const { videoPlaying } = useSelector((state) => state.observationReducer);
  const handlePlayPause = () => {
    if (playerRef === null) return;
    if (!playerRef.current) return;
    if (videoPlaying) {
      playerRef.current.play();
    } else {
      playerRef.current.pause();
    }
  };
  useEffect(() => {
    handlePlayPause();
  }, [videoPlaying]);

  const [stepsState, setStepsState] = useState({
    initialStep: 0,
    steps: [
      {
        element: '.video-preview-container',
        intro: 'This Observations Section....'
      },
      {
        element: '.products-container',
        intro: 'Products Section',
      },
      {
        element: '.user-container',
        intro: 'This Visitors Section....'
      },
      {
        element: '.activity-container',
        intro: 'This activity Section....'
      },
      {
        element: '.command-container',
        intro: 'This command Section....'
      },
    ],
    hints: [
      {
        element: '.products-container',
        hint: 'Product Hint',
        hintPosition: 'right'
      }
    ],
    hintsEnabled: false,
    stepsEnabled: false
  });

  return (
    <>

      {isDemoMode && isDemoLoading && <LearnAnimation />}
      <div className={`main-section ${isDemoMode && isDemoLoading ? 'display-none' : ''}`}>
        <Sidebar />
        <div className="section-preview">
          <div className="video-preview-container">
            <LearnIcon onClick={() => {}} />
            <TabHeader tabTwo="Queues" tabOne="Live" isTabOne={isLive} setIsTabOne={setIsLive} isDots />
            {!isLive && (
            <>
              <div className="player-container">

                <VideoPlayer {...{ playerRef, currentObservation, observations, time, fetchingObservations }} />
                <div>
                  <TagImg />
                </div>
              </div>

              <div className="video-list"><VideoClipList /></div>
            </>
            )}
            {isLive && <ComingSoonNoSidebar />}
          </div>

          {!isLive && (
            <div className="products-container">
              <LearnIcon onClick={() => {}} />
              <ProductsClipList />
            </div>
          )}
        </div>

        <div className="section-information">
          <div className="user-container">
            <LearnIcon onClick={() => {}} />
            <UsersCipList />

          </div>
          <div className="activity-container">
            <LearnIcon onClick={() => {}} />
            <ActivitySection />

          </div>
          <div className="command-container">
            <LearnIcon onClick={() => {}} />
            <CommandSection />

          </div>
        </div>
        <DemoSteps
          state={stepsState}
          setState={setStepsState}
          steps={stepsState.steps}
          hints={stepsState.steps}
          hintsEnabled={stepsState.hintsEnabled}
          stepsEnabled={stepsState.stepsEnabled}
          initialStep={stepsState.initialStep}
        />
      </div>
      {' '}

    </>
  );
}
