import { io, Socket } from 'socket.io-client';

const SERVER_URL = 'http://localhost:3000'; // TODO: Update with your backend URL

let socket: Socket | null = null;

export function connectWebSocket(token: string) {
  socket = io(SERVER_URL, {
    auth: { token },
    transports: ['websocket'],
  });
  return socket;
}

export function getSocket() {
  return socket;
} 