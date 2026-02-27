import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  async create(@Body() dto: CreateRoomDto) {
    const room = await this.roomsService.createRoom(dto.name);
    return {
      roomCode: room.roomCode,
      name: room.name,
    };
  }

  @Get(':roomCode')
  async findOne(@Param('roomCode') roomCode: string) {
    const room = await this.roomsService.findByRoomCode(roomCode);
    if (!room) {
      throw new NotFoundException('Room not found');
    }
    return {
      roomCode: room.roomCode,
      name: room.name,
    };
  }
}
