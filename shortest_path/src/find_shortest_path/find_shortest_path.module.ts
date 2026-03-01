import { Module } from '@nestjs/common';
import { FindShortestPathService } from './find_shortest_path.service';
import { FindShortestPathController } from './find_shortest_path.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FindShortestPath } from './entities/find_shortest_path.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ FindShortestPath])],
  exports: [TypeOrmModule, FindShortestPathService],
  controllers: [FindShortestPathController],
  providers: [FindShortestPathService],
})
export class FindShortestPathModule {}
