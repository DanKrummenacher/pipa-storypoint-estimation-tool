import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RoomDocument = HydratedDocument<Room>;

@Schema({ timestamps: true })
export class Participant {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: Number, default: null })
  vote: number | null;

  @Prop({ type: String, default: null })
  socketId: string | null;
}

const ParticipantSchema = SchemaFactory.createForClass(Participant);

@Schema({ timestamps: true })
export class Room {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  roomCode: string;

  @Prop({ default: 'voting' })
  status: 'voting' | 'revealed';

  @Prop({ type: [ParticipantSchema], default: [] })
  participants: Participant[];
}

export const RoomSchema = SchemaFactory.createForClass(Room);
