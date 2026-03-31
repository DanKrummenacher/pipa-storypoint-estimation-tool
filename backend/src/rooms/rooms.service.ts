import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room, RoomDocument } from './rooms.schema';
import { randomBytes } from 'crypto';

@Injectable()
export class RoomsService {
  private readonly fibonacci = [0.5, 1, 2, 3, 5, 8, 13, 21, 34];

  constructor(
    @InjectModel(Room.name)
    private readonly roomModel: Model<RoomDocument>,
  ) {}

  async createRoom(name: string): Promise<Room> {
    const roomCode = this.generateRoomCode();
    const room = new this.roomModel({
      name,
      roomCode,
      status: 'voting',
    });

    return room.save();
  }

  private generateRoomCode(): string {
    return randomBytes(3).toString('hex').toUpperCase();
  }

  async findByRoomCode(roomCode: string): Promise<RoomDocument | null> {
    return this.roomModel.findOne({ roomCode }).exec();
  }

  async vote(roomCode: string, userId: string, value: number) {
    const room = await this.roomModel.findOne({ roomCode });
    if (!room) return null;

    const participant = room.participants.find((p) => p.userId === userId);
    if (!participant) return null;

    participant.vote = value;
    const allVoted = room.participants.every((p) => p.vote !== null);

    if (allVoted) {
      room.status = 'revealed';
    }

    await room.save();

    if (room.status === 'revealed') {
      return this.getRoomWithResults(roomCode);
    }

    return room;
  }

  async reset(roomCode: string) {
    const room = await this.roomModel.findOne({ roomCode });
    if (!room) return null;

    room.status = 'voting';
    room.participants.forEach((p) => {
      p.vote = null;
    });

    return room.save();
  }

  async reveal(roomCode: string) {
    const room = await this.roomModel.findOne({ roomCode });
    if (!room) return null;

    room.status = 'revealed';
    await room.save();

    return this.getRoomWithResults(roomCode);
  }

  private async getRoomWithResults(roomCode: string) {
    const room = await this.roomModel.findOne({ roomCode });
    if (!room) return null;

    const results = this.calculateResults(room);
    return {
      ...room.toObject(),
      results,
    };
  }

  private calculateResults(room: Room) {
    const allVotes = room.participants.map((p) => p.vote).filter((v) => v !== null);

    if (allVotes.length === 0) return null;

    const numericVotes = allVotes.filter((v) => v > 0);

    let average: number | null = null;
    let recommendation: number | null = null;

    if (numericVotes.length > 0) {
      average = numericVotes.reduce((a, b) => a + b, 0) / numericVotes.length;
      recommendation = this.getClosestFibonacci(average);
    }

    const frequencyMap = new Map<number, number>();
    allVotes.forEach((vote) => {
      frequencyMap.set(vote, (frequencyMap.get(vote) || 0) + 1);
    });

    let maxCount = 0;
    let candidates: number[] = [];

    frequencyMap.forEach((count, value) => {
      if (count > maxCount) {
        maxCount = count;
        candidates = [value];
      } else if (count === maxCount) {
        candidates.push(value);
      }
    });

    const mostCommon = candidates.length === 1 ? candidates[0] : null;

    return {
      average: average !== null ? Number(average.toFixed(2)) : null,
      mostCommon,
      recommendation,
    };
  }

  private getClosestFibonacci(value: number): number {
    if (this.fibonacci.includes(value)) {
      return value;
    }

    if (value <= this.fibonacci[0]) {
      return this.fibonacci[0];
    }
    if (value >= this.fibonacci[this.fibonacci.length - 1]) {
      return this.fibonacci[this.fibonacci.length - 1];
    }

    let lower = this.fibonacci[0];
    let upper = this.fibonacci[this.fibonacci.length - 1];

    for (let i = 0; i < this.fibonacci.length - 1; i++) {
      if (this.fibonacci[i] <= value && this.fibonacci[i + 1] >= value) {
        lower = this.fibonacci[i];
        upper = this.fibonacci[i + 1];
        break;
      }
    }

    const gap = upper - lower;
    const positionInGap = (value - lower) / gap;

    if (positionInGap <= 0.15) {
      return lower;
    }

    return upper;
  }

  async leaveRoom(roomCode: string, userId: string) {
    const room = await this.roomModel.findOne({ roomCode });
    if (!room) return null;

    room.participants = room.participants.filter((p) => p.userId !== userId);
    return room.save();
  }

  async findAll() {
    return this.roomModel.find();
  }
}
