import { useEffect, useCallback, useState } from 'react';

const interval = (delay = 0) => /** @param {() => void} callback */ (
  callback
) => useEffect(() => {
  const id = setInterval(callback, delay);

  return () => clearInterval(id);
}, [callback]);

const use1Second = interval(1e3); // 1e3 = 1000

const useTimer = ({
  seconds: initialSeconds = 0,
  running: initiallyRunning = true
} = {}) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [running, setRunning] = useState(initiallyRunning);
  const tick = useCallback(
    () => (running ? setSeconds((seconds) => seconds + 1) : seconds),
    [running]
  );
  const start = () => setRunning(true);
  const pause = () => setRunning(false);
  const reset = () => setSeconds(0);
  const stop = () => {
    pause();
    reset();
  };

  use1Second(tick);

  return { pause, reset, running, seconds, start, stop };
};
export default useTimer;
