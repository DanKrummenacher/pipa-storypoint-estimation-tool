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
    const calc = (room: ReturnType<typeof mockRoom>): CalcResults =>
      (
        service as unknown as { calculateResults: (r: unknown) => CalcResults }
      ).calculateResults(room);

    it('should calculate correct average and recommendation for numeric votes', () => {
      const room = mockRoom([
        { name: 'User 1', vote: 3 },
        { name: 'User 2', vote: 5 },
        { name: 'User 3', vote: 8 },
      ]);

      const results = calc(room);

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

      const results = calc(room);

      expect(results.mostCommon).toBe(5);
    });

    it('should ignore "?" for average and recommendation', () => {
      const room = mockRoom([
        { name: 'User 1', vote: 3 },
        { name: 'User 2', vote: 5 },
        { name: 'User 3', vote: 0 },
      ]);

      const results = calc(room);

      expect(results.average).toBe(4);
      expect(results.recommendation).toBe(5);
      expect(results.mostCommon).toBeNull();
    });

    it('should handle "1/2" correctly', () => {
      const room = mockRoom([
        { name: 'User 1', vote: 0.5 },
        { name: 'User 2', vote: 1 },
      ]);

      const results = calc(room);

      expect(results.average).toBe(0.75);
      expect(results.recommendation).toBe(1);
    });

    it('should round UP when average is between two fibonacci values (user example: 1 and 2)', () => {
      const room = mockRoom([
        { name: 'User 1', vote: 1 },
        { name: 'User 2', vote: 2 },
      ]);

      const results = calc(room);

      expect(results.average).toBe(1.5);
      expect(results.recommendation).toBe(2);
    });

    it('should return exact fibonacci value if average lands exactly on one', () => {
      const room = mockRoom([
        { name: 'User 1', vote: 5 },
        { name: 'User 2', vote: 5 },
      ]);

      const results = calc(room);

      expect(results.average).toBe(5);
      expect(results.recommendation).toBe(5);
    });

    it('should only round DOWN when very close to lower fibonacci (within 15% of gap)', () => {
      const room = mockRoom([
        { name: 'User 1', vote: 5 },
        { name: 'User 2', vote: 5 },
        { name: 'User 3', vote: 5 },
        { name: 'User 4', vote: 8 },
      ]);

      const results = calc(room);

      expect(results.average).toBe(5.75);
      expect(results.recommendation).toBe(8);
    });

    it('should round UP for moderately spaced votes', () => {
      const room = mockRoom([
        { name: 'User 1', vote: 2 },
        { name: 'User 2', vote: 3 },
      ]);

      const results = calc(room);

      expect(results.average).toBe(2.5);
      expect(results.recommendation).toBe(3);
    });

    it('should round UP for high-value estimates', () => {
      const room = mockRoom([
        { name: 'User 1', vote: 13 },
        { name: 'User 2', vote: 21 },
      ]);

      const results = calc(room);

      expect(results.average).toBe(17);
      expect(results.recommendation).toBe(21);
    });

    it('should handle single vote correctly', () => {
      const room = mockRoom([{ name: 'User 1', vote: 8 }]);

      const results = calc(room);

      expect(results.average).toBe(8);
      expect(results.recommendation).toBe(8);
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
