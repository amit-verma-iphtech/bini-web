// client side code
import { loadPlayer } from 'rtsp-relay/browser';

const location = {
  host: 'localhost:2000'
};
loadPlayer({
  url: `ws://${location.host}/stream`,
  canvas: document.getElementById('canvas'),

  // optional
  onDisconnect: () => console.log('Connection lost!'),
});
