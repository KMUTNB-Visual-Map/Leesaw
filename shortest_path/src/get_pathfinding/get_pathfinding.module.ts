import { Module } from '@nestjs/common';
import { GetPathfindingService } from './get_pathfinding.service';
import { GetPathfindingController } from './get_pathfinding.controller';
import { GraphModule } from 'src/graph/graph.module';
import { FindShortestPathModule } from 'src/find_shortest_path/find_shortest_path.module';

@Module({
  imports: [FindShortestPathModule, GraphModule],
  controllers: [GetPathfindingController],
  providers: [GetPathfindingService],
})
export class GetPathfindingModule {}
