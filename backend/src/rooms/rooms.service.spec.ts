import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { RoomsService } from './rooms.service';
import { Room } from './rooms.schema';

interface CalcResults {
  average: number | null;
  mostCommon: number | null;
  recommendation: number | null;
}

describe('RoomsService', () => {
  let service: RoomsService;

  const mockRoom = (participants: { name: string; vote: number | null }[] = []) => ({
    name: 'Test Room',
    roomCode: 'ABCD12',
    status: 'voting' as const,
    participants,
    toObject: function (this: unknown) {
      return this;
    },
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomsService,
        {
          provide: getModelToken(Room.name),
          useValue: {
            new: jest.fn().mockImplementation((value: unknown): unknown => value),
            constructor: jest
              .fn()
              .mockImplementation((value: unknown): unknown => value),
            findOne: jest.fn(),
            save: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RoomsService>(RoomsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculateResults', () => {
    it('should calculate correct average and recommendation for numeric votes', () => {
      const room = mockRoom([
        { name: 'User 1', vote: 3 },
        { name: 'User 2', vote: 5 },
        { name: 'User 3', vote: 8 },
      ]);

      const results = (
        service as unknown as { calculateResults: (r: unknown) => CalcResults }
      ).calculateResults(room);

      expect(results.average).toBe(5.33);
      expect(results.recommendation).toBe(5);
      expect(results.mostCommon).toBeNull();
    });

    it('should handle unique most common vote', () => {
      const room = mockRoom([
        { name: 'User 1', vote: 5 },
        { name: 'User 2', vote: 5 },
        { name: 'User 3', vote: 8 },
      ]);

      const results = (
        service as unknown as { calculateResults: (r: unknown) => CalcResults }
      ).calculateResults(room);

      expect(results.mostCommon).toBe(5);
    });

    it('should ignore "?" for average and recommendation', () => {
      const room = mockRoom([
        { name: 'User 1', vote: 3 },
        { name: 'User 2', vote: 5 },
        { name: 'User 3', vote: 0 },
      ]);

      const results = (
        service as unknown as { calculateResults: (r: unknown) => CalcResults }
      ).calculateResults(room);

      expect(results.average).toBe(4);
      expect(results.recommendation).toBe(3);
      expect(results.mostCommon).toBeNull();
    });

    it('should handle "1/2" correctly', () => {
      const room = mockRoom([
        { name: 'User 1', vote: 0.5 },
        { name: 'User 2', vote: 1 },
      ]);

      const results = (
        service as unknown as { calculateResults: (r: unknown) => CalcResults }
      ).calculateResults(room);

      expect(results.average).toBe(0.75);
      expect(results.recommendation).toBe(0.5);
    });
  });

  describe('generateRoomCode', () => {
    it('should generate a 6-character hex code', () => {
      const code = (
        service as unknown as { generateRoomCode: () => string }
      ).generateRoomCode();
      expect(code).toMatch(/^[0-9A-F]{6}$/);
    });
  });
});
