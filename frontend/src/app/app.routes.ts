import { Routes } from '@angular/router';
import { Lobby } from './components/lobby/lobby';
import { EstimationRoom } from './components/estimation-room/estimation-room';

export const routes: Routes = [
  {
    path: '',
    component: Lobby,
  },
  {
    path: 'room/:roomCode',
    component: EstimationRoom,
  },
];
