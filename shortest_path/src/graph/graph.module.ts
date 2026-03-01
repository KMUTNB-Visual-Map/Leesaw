import { Module } from '@nestjs/common';
import { GraphService } from './graph.service';
import { GraphController } from './graph.controller';
import { Node_table } from './entities/graph.entity';
import { Edge_table } from './entities/graph.entity';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [TypeOrmModule.forFeature([ Node_table, Edge_table])],
  exports: [GraphService],
  controllers: [GraphController],
  providers: [GraphService],
})
export class GraphModule {}
