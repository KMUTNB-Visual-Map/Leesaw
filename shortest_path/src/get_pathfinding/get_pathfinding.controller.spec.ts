import { Test, TestingModule } from '@nestjs/testing';
import { GetPathfindingController } from './get_pathfinding.controller';
import { GetPathfindingService } from './get_pathfinding.service';

describe('GetPathfindingController', () => {
  let controller: GetPathfindingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetPathfindingController],
      providers: [GetPathfindingService],
    }).compile();

    controller = module.get<GetPathfindingController>(GetPathfindingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
