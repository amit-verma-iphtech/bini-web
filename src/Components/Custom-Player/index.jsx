import React from 'react';
import './style.scss';

export default function CustomPlayer() {
  return (
    <>
      <div className="custom-video-player">
        <video
          src="YOUR-VIDEO.mp4"
          poster="YOUR-POSTER.png"
          className="video"
        />

        <div className="player-controls">
          <div className="video-progress">
            <div className="video-progress-filled" />
          </div>

          <button className="play-button" title="Play">►</button>

          <input
            type="range"
            className="volume"
            min="0"
            max="1"
            step="0.01"
            value="1"
          />

          <div className="time">
            <span className="current">0:00</span>
            {' '}
            /
            {' '}
            <span className="duration">0:00</span>
          </div>
        </div>
      </div>
    </>
  );
}
