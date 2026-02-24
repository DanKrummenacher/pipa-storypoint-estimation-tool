export interface RoomState {
  name: string;
  roomCode: string;
  status: 'voting' | 'revealed';
  participants: {
    userId: string;
    name: string;
    vote: number | null;
  }[];
  results?: {
    average: number;
    mostCommon: number;
    recommendation: number;
  };
}
