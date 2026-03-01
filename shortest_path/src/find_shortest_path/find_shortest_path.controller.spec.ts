import { Test, TestingModule } from '@nestjs/testing';
import { FindShortestPathController } from './find_shortest_path.controller';
import { FindShortestPathService } from './find_shortest_path.service';

describe('FindShortestPathController', () => {
  let controller: FindShortestPathController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FindShortestPathController],
      providers: [FindShortestPathService],
    }).compile();

    controller = module.get<FindShortestPathController>(FindShortestPathController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
