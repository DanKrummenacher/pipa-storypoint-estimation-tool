import { Routes } from '@angular/router';
import { Lobby } from './pages/lobby/lobby';
import { EstimationRoom } from './pages/estimation-room/estimation-room';

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
