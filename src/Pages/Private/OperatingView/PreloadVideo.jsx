import React, { useEffect, useState } from 'react';

export default function PreloadVideo({ url, videoId }) {
  const [videoElement, setVideoElement] = useState('');
  function playVideo() {
    const video = document.getElementById(videoId);

    if (video) {
      video.play().then((_) => {
        console.log('played!');
      });
    }
  }

  function onSuccess(url) {
    console.log(url);
    const video = React.createElement('video', {
      'src': url,
      'id': videoId,
      'controls': true,
    }, '');
    setVideoElement(url);
  }

  function onProgress(pc) {
    console.log('progressing...', pc);
  }

  function onError() {
    console.log('got error...');
  }

  function prefetch_file(url,
    fetched_callback,
    progress_callback,
    error_callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        const URL = window.URL || window.webkitURL;
        const blob_url = URL.createObjectURL(xhr.response);
        fetched_callback(blob_url);
      } else {
        error_callback();
      }
    }, false);

    let prev_pc = 0;
    xhr.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const pc = Math.round((event.loaded / event.total) * 100);
        if (pc !== prev_pc) {
          prev_pc = pc;
          progress_callback(pc);
        }
      }
    });
    xhr.send();
  }
  useEffect(() => {
    prefetch_file(url, onSuccess, onProgress, onError);
  }, []);

  return (
    <>
      <video className="react-player" src={videoElement} controls preload="auto" autoPlay />

      {/* {videoElement} */}
    </>
  );
}
