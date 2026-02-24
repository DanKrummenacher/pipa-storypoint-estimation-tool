import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomsService } from './rooms.service';
import { JoinRoomDto } from './dto/join-room.dto';
import { VoteDto } from './dto/vote.dto';
import { RoomState } from './types/room-state.type';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class RoomsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly roomsService: RoomsService) {}

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() data: JoinRoomDto,
    @ConnectedSocket() client: Socket,
  ) {
    const room = await this.roomsService.findByRoomCode(data.roomCode);

    if (!room) {
      client.emit('roomError', {
        code: 'ROOM_NOT_FOUND',
        message: 'Room not found',
      });
      return;
    }

    await client.join(data.roomCode);

    const existing = room.participants.find((p) => p.userId === data.userId);

    if (existing) {
      existing.socketId = client.id;
    } else {
      room.participants.push({
        userId: data.userId,
        name: data.name,
        vote: null,
        socketId: client.id,
      });
    }

    await room.save();

    this.server.to(data.roomCode).emit('roomState', room as RoomState);
  }

  @SubscribeMessage('vote')
  async handleVote(@MessageBody() data: VoteDto) {
    const room = await this.roomsService.vote(
      data.roomCode,
      data.userId,
      data.value,
    );

    if (!room) return;

    this.server.to(data.roomCode).emit('roomState', room as RoomState);
  }

  @SubscribeMessage('reset')
  async handleReset(@MessageBody() data: { roomCode: string }) {
    const room = await this.roomsService.reset(data.roomCode);
    if (!room) return;

    this.server.to(data.roomCode).emit('roomState', room as RoomState);
  }

  @SubscribeMessage('reveal')
  async handleReveal(@MessageBody() data: { roomCode: string }) {
    const room = await this.roomsService.reveal(data.roomCode);
    if (!room) return;

    this.server.to(data.roomCode).emit('roomState', room as RoomState);
  }

  @SubscribeMessage('leaveRoom')
  async handleLeave(
    @MessageBody()
    data: {
      roomCode: string;
      userId: string;
    },
  ) {
    const room = await this.roomsService.leaveRoom(data.roomCode, data.userId);

    if (!room) return;

    this.server.to(data.roomCode).emit('roomState', room as RoomState);
  }
}
