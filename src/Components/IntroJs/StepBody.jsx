import React from 'react';

const StepBody = ({ heading, description, points, videoUrl }) => (
  <>
    {heading && <h2>{heading}</h2>}
    {description && <p>{description}</p>}
    {Array.isArray(points) && (
      <>
        <ul>
          {points.map((value) => <li>{value}</li>)}
        </ul>
      </>
    )}
    {/* <video src={videoUrl || 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'} controls width="100%" /> */}
  </>
);
export default StepBody;
