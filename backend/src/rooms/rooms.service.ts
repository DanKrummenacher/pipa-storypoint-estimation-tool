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
    private roomModel: Model<RoomDocument>,
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

    const updatedRoom = await this.roomModel.findOne({ roomCode });

    if (updatedRoom?.status === 'revealed') {
      const results = this.calculateResults(updatedRoom);
      return {
        ...updatedRoom.toObject(),
        results,
      };
    }

    return updatedRoom;
  }

  async reset(roomCode: string) {
    const room = await this.roomModel.findOne({ roomCode });
    if (!room) return null;

    room.status = 'voting';

    room.participants.forEach((p) => {
      p.vote = null;
    });

    await room.save();

    return room;
  }

  private calculateResults(room: Room) {
    const votes = room.participants.map((p) => p.vote).filter((v) => v !== null);

    if (votes.length === 0) return null;

    const average = votes.reduce((a, b) => a + b, 0) / votes.length;

    const frequencyMap = new Map<number, number>();

    votes.forEach((vote) => {
      frequencyMap.set(vote, (frequencyMap.get(vote) || 0) + 1);
    });

    let mostCommon = votes[0];
    let maxCount = 0;

    frequencyMap.forEach((count, value) => {
      if (count > maxCount) {
        maxCount = count;
        mostCommon = value;
      }
    });

    const recommendation = this.getClosestFibonacci(average);

    return {
      average: Number(average.toFixed(2)),
      mostCommon,
      recommendation,
    };
  }

  private getClosestFibonacci(value: number): number {
    return this.fibonacci.reduce((prev, curr) =>
      Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev,
    );
  }

  async reveal(roomCode: string) {
    const room = await this.roomModel.findOne({ roomCode });
    if (!room) return null;

    room.status = 'revealed';

    await room.save();

    const updatedRoom = await this.roomModel.findOne({ roomCode });

    if (!updatedRoom) return null;

    const results = this.calculateResults(updatedRoom);

    return {
      ...updatedRoom.toObject(),
      results,
    };
  }

  async leaveRoom(roomCode: string, userId: string) {
    const room = await this.roomModel.findOne({ roomCode });
    if (!room) return null;

    room.participants = room.participants.filter((p) => p.userId !== userId);

    await room.save();

    return room;
  }
}
