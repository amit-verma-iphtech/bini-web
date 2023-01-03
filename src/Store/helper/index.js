/* eslint-disable no-await-in-loop */
/* eslint-disable no-useless-escape */
// import extractFrames from 'ffmpeg-extract-frames';

import { GET_OBSERVATIONS_AFTER_LOAD } from 'Store/constants/actionTypes';

export const CHECK_CONNECTION = 'Check your connection';
export const handleCatch = ({ response, setSnackbar, dispatch, cb, dispatchType }) => {
  if (response?.data) {
    const { data: { message } } = response;
    setSnackbar && setSnackbar({ isVisible: true, type: 'error', message });
    (dispatch && dispatchType) && dispatch({ type: dispatchType, payload: message });
    cb && cb({ status: false, message });
  } else {
    setSnackbar && setSnackbar({ isVisible: true, type: 'error', message: CHECK_CONNECTION });
    (dispatch && dispatchType) && dispatch({ type: dispatchType, payload: CHECK_CONNECTION });
    cb && cb({ status: false });
  }
};

export const handleTry = ({ dispatch, dispatchType, dispatchPayload, setSnackbar, message, cb, cbData, code }) => {
  const isSuccess = (code < 300 && code >= 200) || (code === undefined && true);
  if (isSuccess) {
    setSnackbar && message && setSnackbar({ isVisible: true, type: 'success', message });
    (dispatch && dispatchPayload) && dispatch({ type: dispatchType, payload: dispatchPayload });
    cb && cb({ status: true, ...cbData && cbData });
  } else {
    setSnackbar && message && setSnackbar({ isVisible: true, type: 'error', message });
    cb && cb({ status: false, ...cbData && cbData });
  }
};
export function prefetch_file(url, onSuccess, onProgress, index) {
  // fetch(url).then((response) => {
  //   console.log('got-response from index=>', index);

  //   // method 1
  //   const URL = window.URL || window.webkitURL;
  //   const blob_url = URL.createObjectURL(response);

  //   // method 2
  //   // const blob_url = [];
  //   // blob_url.push(response);
  //   // window.URL.createObjectURL(new Blob(blob_url, { type: 'video\/mp4' }));

  //   // method 3
  //   // const blob_url = response;
  //   onSuccess({ status: true, url: blob_url });
  // }).catch((err) => {
  //   console.error('got-error,response from index=>', index);
  //   console.error(err);

  //   onSuccess({ status: false, url });
  // });
  try {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');

    xhr.addEventListener('load', () => {
      console.log('got-response fro index--->', index);
      if (xhr.status === 200) {
        const URL = window.URL || window.webkitURL;
        const blob_url = URL.createObjectURL(xhr.response);
        onSuccess({ status: true, url: blob_url });
      } else {
        onSuccess({ status: true, url });
      }
    }, false);

    let prev_pc = 0;
    xhr.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const pc = Math.round((event.loaded / event.total) * 100);
        if (pc !== prev_pc) {
          prev_pc = pc;
          onProgress(pc, index);
        }
      }
    });
    console.log('hitting request for index-->', index);
    xhr.onerror = function () {
      onSuccess({ status: true, url });

      console.log('** An error occurred during the transaction inddex', index);
    };
    xhr.send();
  } catch (error) {
    console.log('got error on api index--->', index, error);
  }

  // const xhr = new XMLHttpRequest();
  // xhr.open('GET', url, true);
  // xhr.responseType = 'blob';

  // xhr.addEventListener('load', () => {
  //   console.log('response received for... video-', index);
  //   if (xhr.status === 200) {
  //     const URL = window.URL || window.webkitURL;
  //     const blob_url = URL.createObjectURL(xhr.response);
  //     onSuccess({ status: true, url: blob_url });
  //   }
  //   return onSuccess({ status: false, url });
  // }, false);

  // let prev_pc = 0;
  // xhr.addEventListener('progress', (event) => {
  //   if (event.lengthComputable) {
  //     const pc = Math.round((event.loaded / event.total) * 100);
  //     if (pc !== prev_pc) {
  //       prev_pc = pc;
  //       onProgress(pc);
  //     }
  //   }
  // });
  // xhr.send();
}
// export const getThumbnails = async (url, key) => {
//   const thumb = await extractFrames({
//     input: url,
//     output: `./${key || 'thumb'}-%i.jpg`,
//     offsets: [
//       1000,
//       2000,
//       3500
//     ]
//   });

//   return thumb;
// };
export const loadSnippets = async (payload) => {
  const {
    setSnackbar,
    message,
    cb,
    code, dispatch, data
  } = payload;
  let current = 0;
  const splitCount = 1;
  console.log('init-whileLoop');
  const generateArray = (listCount, activeIndex) => {
    console.log('hitting ---- > 00042');
    const list = [];
    let number = 0;
    while (number < listCount) {
      const promise = data[activeIndex + number];
      if (promise) { list.push(promise); }
      number += 1;
    }
    console.log('generatedArray_listCount=>', list.length, list);
    return list;
  };
  console.log('hitting ---- > 00040');

  while (current < data.length) {
    console.log('hitting ---- > 00041');
    console.log('init-whileLoop-current,splitCount', current, splitCount);
    console.log('loop number', current / splitCount);
    const observationList = generateArray(splitCount, current);
    console.log('hitting ---- > 00043');
    const allPromises = observationList.map(async (observation, index) => {
      const response = await new Promise((resolve) => {
        console.log(index);
        const onSuccess = ({ status, url }) => {
          resolve({ ...observation, videoUrl: url });
          if (status) {
            console.log('success-video=>', index);
          } else {
            console.log('failed-video=>', index);
          }
        };
        const onProgress = (pc) => {
          console.log('hitting ---- > 00044 %', index, pc);
          console.log('% for index=>', index, pc);
        };
        prefetch_file(observation.videoUrl, onSuccess, onProgress, index);
      });
      console.log('hitting ---- > 00045');
      return response;
    });
    console.log('hitting ---- > 00046', allPromises);
    const promiseData = await Promise.all(allPromises);
    console.log('hitting ---- > 00047', promiseData);
    console.log('all videos loaded fro current page-->', current / splitCount);
    handleTry({
      dispatch,
      dispatchType: GET_OBSERVATIONS_AFTER_LOAD,
      dispatchPayload: { data: promiseData },
      setSnackbar,
      message,
      cb,
      cbData: { data },
      code
    });
    console.log('done...index', current / splitCount, current);
    current += splitCount;
  }
  console.log('end-whileLoop', current, data);
};
export const findObjectByIdFromList = (list, objectId) => {
  const search = ({ id }) => id === objectId * 1;
  const index = list.findIndex(search);
  let object;
  if (index !== -1) {
    object = list[index];
    return object;
  }
  return undefined;
};
