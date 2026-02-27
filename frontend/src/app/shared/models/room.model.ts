export interface Participant {
  id: string;
  name: string;
  hasEstimated: boolean;
  isRevealed: boolean;
  isMe?: boolean;
  estimationValue?: string;
}

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
    average: number | null;
    mostCommon: number | null;
    recommendation: number | null;
  };
}

export interface EstimationCard {
  value: string;
  color: string;
}
