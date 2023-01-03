import { endpoints } from 'Api/request';
import { io } from 'socket.io-client';
import socketConstants from './constants/socket.constant';
import { socketLogger } from './helper/socket.helper';
import { socketPing } from './services/socket.service';

const socket = io(`${endpoints.baseUri}/ops-dashboard`);

export default socket;

export function socket_init() {
  socketLogger(socketConstants.TYPES.CONNECTION, 'socket_init....');
  socket.on('connect', () => {
    socketLogger(socketConstants.TYPES.CONNECTION, `Connected successfully socket.id=>${socket.id}`);
  });
  socket.on(socketConstants.WELCOME, (payload) => {
    socketLogger(socketConstants.TYPES.RECEIVED, socketConstants.WELCOME, payload);
  });
  socket.on(socketConstants.PONG, (payload) => {
    socketLogger(socketConstants.TYPES.RECEIVED, socketConstants.PONG, payload);
  });
}
