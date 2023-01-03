/* eslint-disable max-len */
/* eslint-disable eqeqeq */

import localtunnel from 'localtunnel';

/* eslint-disable no-mixed-operators */
export function prefetch_file(
  url,
  onSuccess,
  onProgress,
  onError
) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'blob';

  xhr.addEventListener('load', () => {
    if (xhr.status === 200) {
      const URL = window.URL || window.webkitURL;
      const blob_url = URL.createObjectURL(xhr.response);
      return onSuccess(blob_url);
    }
    return onError();
  }, false);

  let prev_pc = 0;
  xhr.addEventListener('progress', (event) => {
    if (event.lengthComputable) {
      const pc = Math.round((event.loaded / event.total) * 100);
      if (pc !== prev_pc) {
        prev_pc = pc;
        onProgress(pc);
      }
    }
  });
  xhr.send();
}

export const getTimeDifference = (timestamp) => {
  const date = new Date(timestamp); // year month date
  const current = new Date();
  const diffMs = (current - date); // milliseconds between now & date
  const diffDays = Math.floor(diffMs / 86400000); // days
  const diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
  const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
  const diffSec = Math.floor((diffMs % (1000 * 60)) / 1000);

  return `${diffDays ? `${diffDays}days:` : ''}${diffHrs ? `${diffHrs}hrs` : ''}${diffMins ? `:${diffMins}min` : ''}${diffSec ? `:${diffSec}sec` : '0 sec'}`;
};
export const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  };

  return date.toLocaleTimeString('en-us', options);
};

export const findObservationIndex = (observationsList, id) => {
  if (Array.isArray(observationsList)) {
    const search = (obj) => obj.id * 1 === id;
    const observationIdx = observationsList.findIndex(search);
    return { index: observationIdx, status: true };
  }
  console.error('Invalid List provided');
  return { index: -1, error: 'Invalid List (Not an Array)', status: false };
};
// (async () => {
//   const tunnel = await localtunnel({ port: 3000 });

//   // the assigned public url for your tunnel
//   // i.e. https://abcdefgjhij.localtunnel.me
//   tunnel.url;
//   console.log('tunnelurl ', tunnel.url);
//   console.log('tunnel ', tunnel);
//   tunnel.on('close', () => {
//     // tunnels are closed
//   });
// })();
