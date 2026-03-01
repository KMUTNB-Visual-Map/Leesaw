import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FindShortestPathModule } from './find_shortest_path/find_shortest_path.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FindShortestPath } from './find_shortest_path/entities/find_shortest_path.entity';
import { GraphModule } from './graph/graph.module';
import { Edge_table, Node_table } from './graph/entities/graph.entity';
import { GetPathfindingModule } from './get_pathfinding/get_pathfinding.module';

@Module({
  imports: [
    FindShortestPathModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'aws-1-ap-southeast-2.pooler.supabase.com',
      port: 5432,
      username: 'postgres.nskjeegyfgvaktuextiv',
      password: 'JauEbfX8ifIhzkh5',
      database: 'postgres',
      autoLoadEntities: true,
      synchronize: false,
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    GraphModule,
    GetPathfindingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
