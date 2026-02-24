import { Body, Controller, Post } from '@nestjs/common';
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
}
