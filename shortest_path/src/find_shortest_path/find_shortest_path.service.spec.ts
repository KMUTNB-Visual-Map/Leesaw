import { Test, TestingModule } from '@nestjs/testing';
import { FindShortestPathService } from './find_shortest_path.service';

describe('FindShortestPathService', () => {
  let service: FindShortestPathService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FindShortestPathService],
    }).compile();

    service = module.get<FindShortestPathService>(FindShortestPathService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
