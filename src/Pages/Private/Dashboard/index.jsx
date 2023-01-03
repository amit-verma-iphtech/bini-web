import { VideoPlayer } from 'Components/VideoPlayer';
import React from 'react';

export default function Dashboard() {
  return (
    <div>
      Dashboard
      <div style={{ width: '1000px', height: '1000px' }}>

        <VideoPlayer />
      </div>
    </div>
  );
}
