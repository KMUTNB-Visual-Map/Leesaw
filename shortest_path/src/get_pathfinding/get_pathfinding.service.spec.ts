import { Test, TestingModule } from '@nestjs/testing';
import { GetPathfindingService } from './get_pathfinding.service';

describe('GetPathfindingService', () => {
  let service: GetPathfindingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GetPathfindingService],
    }).compile();

    service = module.get<GetPathfindingService>(GetPathfindingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
