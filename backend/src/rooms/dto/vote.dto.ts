import { IsNotEmpty, IsNumber } from 'class-validator';

export class VoteDto {
  @IsNotEmpty()
  roomCode: string;

  @IsNotEmpty()
  userId: string;

  @IsNumber()
  value: number;
}
