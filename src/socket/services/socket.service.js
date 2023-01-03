import socket from 'socket';
import socketConstants from 'socket/constants/socket.constant';
import { socketLogger } from 'socket/helper/socket.helper';

export const socketPing = () => {
  socketLogger(socketConstants.TYPES.SEND, socketConstants.PING);

  socket.emit(socketConstants.PING, { message: 'PING' }, (payload) => {
    socketLogger(socketConstants.TYPES.CALLBACK, socketConstants.PING, payload);
  });
};
