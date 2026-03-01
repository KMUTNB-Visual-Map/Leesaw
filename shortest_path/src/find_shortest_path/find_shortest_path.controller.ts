import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { FindShortestPathService } from './find_shortest_path.service';

@Controller('find-shortest-path')
export class FindShortestPathController {
  constructor(private readonly findShortestPathService: FindShortestPathService) {}

  @Get('elevator')
  async get_elevator_node(
    @Query('source') source: string,
    @Query('destination') destination: string,
  ) {
    const result = await this.findShortestPathService.elevator(Number(source), Number(destination),);
    return result;
  }
  
  @Get('Astar')
  async get_node(
    @Query('source') source: string,
    @Query('destination') destination: string,
  ) {
    const result = await this.findShortestPathService.runAstar(Number(source), Number(destination),);
    return result;
  } 

  @Get('calculate')
  async get_node_full(
    @Query('source') source: string,
    @Query('destination') destination: string,
  ) {
    const result = await this.findShortestPathService.calculate(Number(source), Number(destination),);
    return result;
  }
}
