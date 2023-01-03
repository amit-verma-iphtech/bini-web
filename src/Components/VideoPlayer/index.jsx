import React, { useState, useRef, useEffect } from 'react';
import { makeStyles } from '@material-ui/core';
import { useParams, Link, useLocation, useHistory } from 'react-router-dom';
import { dataFetcher, endpoints } from 'Api/request';
import ReactPlayer from 'react-player';
import { Pathname } from 'Routes';
import { useSelector } from 'react-redux';
import PlayerControls from './controls';

const useStyles = makeStyles({
  playerWrapper: {
    width: '100%',
    position: 'relative',
    height: '100%',
    background: 'black',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
});

const format = (seconds) => {
  if (Number.isNaN(seconds)) {
    return '00:00';
  }
  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = date.getUTCSeconds().toString().padStart(2, '0');
  if (hh) {
    return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
  }
  return `${mm}:${ss}`;
};
let count = 0;
export function VideoPlayer() {
  let timeout;
  const [videoDetails, setVideoDetails] = useState({ title: 'FirstVideo', url: 'someLink' });
  const { currentObservation } = useSelector((state) => state.observationReducer);

  const [state, setState] = useState({
    playing: true,
    muted: true,
    volume: 5000,
    playbackRate: 1.0,
    played: 0,
    seeking: false,
  });

  const classes = useStyles();
  const { playing, muted, volume, playbackRate, played, seeking } = state;

  const playerRef = useRef(null);
  const playerContainerRef = useRef(null);
  const controlsRef = useRef(null);

  // state changing codes.....
  const handlePlayPause = () => {
    if (playing) {
      controlsRef.current && (controlsRef.current.style.visibility = 'visible');
      (() => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          controlsRef.current && (controlsRef.current.style.visibility = 'hidden');
        }, 3000);
      })();
    }
    setState({ ...state, playing: !state.playing });
  };

  const handleUserKeyPress = (event) => {
    const { key, keyCode } = event;

    if (keyCode === 32) {
      handlePlayPause();
    }
  };
  useEffect(() => {
    window.addEventListener('keydown', handleUserKeyPress);

    return () => {
      window.removeEventListener('keydown', handleUserKeyPress);
    };
  });

  const handleMute = () => {
    setState({ ...state, muted: !state.muted });
  };
  const handleRewind = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10);
  };
  const handleFastForward = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10);
  };
  const handleVolumeChange = (e, newValue) => {
    newValue === 0 ? setState({
      ...state,
      volume: parseFloat(newValue / 100),
      muted: true,
    })
      : setState({
        ...state,
        volume: parseFloat(newValue / 100),
        muted: false,
      });
  };
  const handleVolumeSeekDown = (e, newValue) => {
    newValue === 0 ? setState({
      ...state,
      volume: parseFloat(newValue / 100),
      muted: true,
    })
      : setState({
        ...state,
        volume: parseFloat(newValue / 100),
        muted: false,
      });
  };
  const handelPlaybackRate = (value) => {
    setState({
      ...state,
      playbackRate: value,
    });
  };
  const toggleFullScreen = () => {
    // screenfull.toggle(playerContainerRef.current);
  };

  const handleProgress = (changeState) => {
    if (!playing) {
      (() => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          controlsRef.current && (controlsRef.current.style.visibility = 'hidden');
        }, 3000);
      })();
    }
    if (count > 1) {
      (() => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          controlsRef.current && (controlsRef.current.style.visibility = 'hidden');
        }, 1000);
      })();

      count = 0;
    }

    if ((controlsRef.current && (controlsRef.current.style.visibility === 'visible'
    || controlsRef.current.style.visibility !== 'hidden'))) {
      count += 1;
    }
    if (!seeking) {
      setState({ ...state, ...changeState });
    }
  };
  const handleSeekChange = (e, newValue) => {
    setState({ ...state, played: parseFloat(newValue / 100) });
  };
  const handleSeekMouseDown = (e) => {
    setState({ ...state, seeking: true });
  };
  const handleSeekMouseUp = (e, newValue) => {
    setState({ ...state, seeking: false });
    playerRef.current.seekTo(newValue / 100);
  };
  const currentTime = playerRef.current
    ? playerRef.current.getCurrentTime()
    : '00:00';
  const duration = playerRef.current
    ? playerRef.current.getDuration()
    : '00:00';
  const elapsedTime = format(currentTime);
  const totalDuration = format(duration);
  const history = useHistory();
  useEffect(() => {
    if ((currentTime && duration) && currentTime !== '00:00') {
      currentTime === duration ? setTimeout(() => {
        history.push(Pathname.home);
      }, 2000) : null;
    }
  }, [currentTime]);

  const hadleMouseMove = () => {
    controlsRef.current && (controlsRef.current.style.visibility = 'visible');
    count = 0;
    if (!playing) {
      (() => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          controlsRef.current && (controlsRef.current.style.visibility = 'hidden');
        }, 3000);
      })();
    }
  };
  return (
    <>
      <div
        width="100%"
        onMouseMove={hadleMouseMove}
      >
        <div ref={playerContainerRef} className={classes.playerWrapper}>
          <ReactPlayer
            ref={playerRef}
            width="100%"
            height="500px"
            url={currentObservation.videoUrl}
            light
            muted={muted}
            playing={playing}
            volume={volume}
            playbackRate={playbackRate}
            onProgress={handleProgress}
          />
          <div>

            <PlayerControls
              ref={controlsRef}
              onPlayPause={handlePlayPause}
              playing={playing}
              onRewind={handleRewind}
              onFastForward={handleFastForward}
              muted={muted}
              onMute={handleMute}
              volume={volume}
              onVolumeChange={handleVolumeChange}
              onVolumeSeekUp={handleVolumeSeekDown}
              playbackRate={playbackRate}
              onPlaybackRateChange={handelPlaybackRate}
              onToggleFullScreen={toggleFullScreen}
              played={played}
              onSeek={handleSeekChange}
              onSeekMouseDown={handleSeekMouseDown}
              onSeekMouseUp={handleSeekMouseUp}
              currentTime={currentTime}
              elapsedTime={elapsedTime}
              totalDuration={totalDuration}
              title={videoDetails.title}
            />
          </div>

        </div>
      </div>
    </>
  );
}
