import React, { useState, forwardRef } from 'react';

import {
  Typography,
  makeStyles,
  Grid,
  Button,
  IconButton,
  Slider,
  withStyles,
  Tooltip,
  Popover,
} from '@material-ui/core';
import {
  Bookmark,
  FastForward,
  FastRewind,
  Fullscreen,
  Pause,
  PlayArrow,
  VolumeOff,
  VolumeUp,
  Forward10,
  Replay10,
  ArrowBackIos

} from '@material-ui/icons';

const useStyles = makeStyles({
  playerWrapper: {
    width: '100%',
    position: 'relative',
  },
  controlesWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    background: 'rgba(0,0,0,.6)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    zIndex: 1,
  },
  controllIcons: {
    color: '#777',
    fontSize: 50,
    transform: 'scale(0.9)',
    '&:hover': {
      color: '#fff',
      transform: 'scale(1)',
    },
  },
  bottomIcons: {
    color: '#999',
    '&:hover': {
      color: '#fff',
    },
  },
  volumeSlider: {
    width: 100,
  },
  titleTrim: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '50ch'
  }
});

function ValueLabelComponent(props) {
  const { children, open, value } = props;
  return (
    <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
}

const PrettoSlider = withStyles({
  root: {
    height: 8,
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    marginTop: -8,
    marginLeft: -12,
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit',
    },
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 4px)',
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
})(Slider);

export default forwardRef(
  ({
    onPlayPause,
    playing,
    onFastForward,
    onRewind,
    muted,
    onMute,
    onVolumeSeekUp,
    onVolumeChange,
    volume,
    onPlaybackRateChange,
    playbackRate,
    onToggleFullScreen,
    played,
    onSeek,
    onSeekMouseDown,
    onSeekMouseUp,
    elapsedTime,
    totalDuration,
    title,
  }, ref) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleSpeedRate = (event) => {
      switch (playbackRate) {
        case 0.5:
          onPlaybackRateChange(1);
          break;
        case 1:
          onPlaybackRateChange(1.5);
          break;
        case 1.5:
          onPlaybackRateChange(2);
          break;
        case 2:
          onPlaybackRateChange(0.5);
          break;
        default:
          onPlaybackRateChange(1);
          break;
      }
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'playBackRate-popover' : undefined;
    const classes = useStyles();

    return (
      <div className={classes.controlesWrapper} ref={ref}>
        {/* top */}
        <Grid
          container
          direction="row"
          alignItems="center"
          justify="space-between"
          style={{ padding: 16 }}
        >
          {/* <Grid item style={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              // style={{ color: 'white' }}
              // onClick={() => { navigate(-1); }}
              className={classes.controllIcons}
            >
              <ArrowBackIos />
            </IconButton>
            <Typography variant="h5" style={{ color: '#fff' }} className={classes.titleTrim}>
              {' '}
              {title}
            </Typography>
          </Grid> */}

        </Grid>
        {/* mid */}
        <Grid container direction="row" alignItems="center" justify="center">
          <IconButton onClick={onRewind} className={classes.controllIcons} aria-label="reqind">
            <Replay10 fontSize="inherit" />
          </IconButton>
          <IconButton
            onClick={onPlayPause}
            className={classes.controllIcons}
            aria-label="reqind"
          >
            {playing ? <Pause fontSize="inherit" /> : <PlayArrow fontSize="inherit" />}
          </IconButton>
          <IconButton onClick={onFastForward} className={classes.controllIcons} aria-label="reqind">
            <Forward10 fontSize="inherit" />
          </IconButton>
        </Grid>

        {/* bottom */}
        <Grid
          container
          direction="row"
          alignItems="center"
          justify="space-between"
          style={{ padding: 16 }}
        >
          <Grid item xs={12}>
            <PrettoSlider
              min={0}
              max={100}
              value={played * 100}
              ValueLabelComponent={(props) => <ValueLabelComponent {...props} value={elapsedTime} />}
              onChange={onSeek}
              onMouseDown={onSeekMouseDown}
              onChangeCommitted={onSeekMouseUp}
            />
          </Grid>
          <Grid item>
            <Grid container direction="row" alignItems="center">
              <IconButton onClick={onPlayPause} className={classes.bottomIcons}>
                {playing ? <Pause fontSize="large" /> : <PlayArrow fontSize="large" />}

              </IconButton>
              <IconButton onClick={onMute} className={classes.bottomIcons}>
                {muted ? <VolumeOff fontSize="large" /> : <VolumeUp fontSize="large" />}
              </IconButton>
              <Slider
                min={0}
                max={100}
                defaultValue={volume * 100}
                className={classes.volumeSlider}
                onChange={onVolumeChange}
                onChangeCommitted={onVolumeSeekUp}
              />
              <Button variant="text" style={{ color: '#fff', marginLeft: 16 }}>
                <Typography>
                  {elapsedTime}
                  /
                  {totalDuration}
                </Typography>
              </Button>
            </Grid>
          </Grid>
          <Grid item>
            <Button
              onClick={handleSpeedRate}
              variant="text"
              className={classes.bottomIcons}
            >
              <Typography>
                {playbackRate}
                x
              </Typography>
            </Button>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
            >
              <Grid container direction="column-reverse" style={{ zIndex: 99999999999999999999999 }}>
                {[0.5, 1, 1.5, 2].map((rate) => (
                  <Button onClick={() => onPlaybackRateChange(rate)} variant="text">
                    <Typography color={rate === playbackRate ? 'secondary' : 'default'}>{rate}</Typography>
                  </Button>
                ))}
              </Grid>
            </Popover>
            {/* <IconButton onClick={onToggleFullScreen} className={classes.bottomIcons}>
              <Fullscreen fontSize="large" />
            </IconButton> */}
          </Grid>
        </Grid>
      </div>
    );
  }
);
