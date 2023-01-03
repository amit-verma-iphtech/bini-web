import React, { useEffect, useState } from 'react';
import * as api from 'Api/request';
import { useSelector } from 'react-redux';
import styles from './styles.module.scss';

function App() {
  const canvasRef = React.useRef(null);
  const { currentObservation } = useSelector((state) => state.observationReducer);
  const [currentCam, setCurrentCam] = useState();

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
  const drawText = async (text) => {
    clearCanvas();
    const canvas = canvasRef.current;
    const ctx = canvasRef.current.getContext('2d');
    ctx.font = '30px Comic Sans MS';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  };
  const [loader, setLoader] = useState({
    loading: false,
    loaded: false
  });
  useEffect(() => {
    const isNoShelf = loader.loaded === false && loader.loading === false;
    const isLoading = loader.loading && !loader.loaded;
    console.log('loader', loader, isNoShelf, isLoading);
    if (isLoading) {
      drawText('Loading...');
    }
    if (isNoShelf) {
      drawText('No Shelf Available');
    }
  }, [loader]);
  const loadShelf = async () => {
    const response = await api.requestGetShelf({ id: currentCam });
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');

    const image = new Image();
    image.src = response.shelf_image;
    image.onload = () => {
      setLoader({ ...loader, loading: false, loaded: true });
      ctx.canvas.width = image.width;
      ctx.canvas.height = image.height;
      ctx.drawImage(image, 0, 0, image.width, image.height);
      response.compartments.map((compartment) => {
        const { x1, x2, x3, x4, y1, y2, y3, y4, itemId } = compartment;
        ctx.strokeStyle = 'yellow';
        ctx.font = '4rem Arial';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(x1, y4);
        ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.lineTo(x4, y4);
        ctx.stroke();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.fillStyle = 'rgb(0, 153, 255)';
        ctx.fillRect(x4, y4 - 40, 80, 50);
        ctx.strokeText(itemId, x4, y4);
        return compartment;
      });
    };
    image.onerror = () => {
      setLoader({ ...loader, loading: false, loaded: false });
    };
  };
  const [cameras, setCameras] = useState([]);
  const handleLoadShelf = () => {
    setLoader({ ...loader, loading: true, loaded: false });
    if (!currentCam) {
      setTimeout(() => {
        setLoader({ ...loader, loading: false, loaded: false });
      }, 1000);
      return;
    }
    const selectedCam = cameras.find((cam) => cam.id === currentCam);
    console.log('testing--->,', selectedCam, cameras, currentCam);
    if (!selectedCam?.imageLink) return;
    const { imageLink } = selectedCam;
    if ((imageLink === null) || (imageLink === '')) {
      setTimeout(() => {
        setLoader({ ...loader, loading: false, loaded: false });
      }, 1000);
      return;
    }
    loadShelf();
  };
  const {
    storeReducer: { currentStore },

  } = useSelector((state) => state);
  const loadCams = async () => {
    if (!currentStore?.id) return;

    const { code, length, cameras } = await api.requestGetCameras({ storeId: currentStore.id });
    if (cameras && cameras.length > 0) {
      setCameras(cameras);
      return setCurrentCam(cameras[0].id);
    }
    setLoader({ ...loader, loading: false, loaded: false });
    return setCameras([]);
  };
  useEffect(() => {
    loadCams();
  }, [currentStore?.id]);
  useEffect(async () => {
    handleLoadShelf();
  }, [currentCam]);
  useEffect(async () => {
    if (!currentObservation?.cameraId) return;

    setCurrentCam(currentObservation.cameraId);
  }, [currentObservation?.cameraId]);
  const handleChange = (event) => {
    setCurrentCam(event.currentTarget.value);
  };
  return (
    <div className={styles.canvas_container}>
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
      />

      <div className={styles.canvas_details}>
        <span>
          CameraId :
          {' '}
          {currentObservation?.cameraId || 'NaN'}
        </span>
        <button disabled={!loader.loaded && loader.loading} onClick={handleLoadShelf} className={styles.canvas_button}>Reload</button>
        <select
          disabled={!loader.loaded && loader.loading}
          onChange={handleChange}
          className={`${styles.canvas_button} ${styles.canvas_button_select}`}
          value={currentCam}
          defaultValue={currentCam}
        >
          {cameras.map(({ id, imageLink }) => <option value={id}>{`Cam-${id}, ${imageLink === null ? 'NaN' : `Shell: ${imageLink}`}`}</option>)}
        </select>
        <button disabled={loader.loading} onClick={() => drawText('Please Click Reload')} className={styles.canvas_button}>Clear</button>
      </div>
    </div>
  );
}

export default App;
