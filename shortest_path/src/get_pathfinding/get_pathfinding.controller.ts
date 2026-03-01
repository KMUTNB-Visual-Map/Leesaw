import { Controller, Get, Query} from '@nestjs/common';
import { GetPathfindingService } from './get_pathfinding.service';

@Controller('get-pathfinding')
export class GetPathfindingController {
  constructor(private readonly getPathfindingService: GetPathfindingService) {}

  @Get('get_path_finding')
  async get_node(
    @Query('x') x: string,
    @Query('y') y: string,
    @Query('floor_id') floor_id: string,
    @Query('destination') destination: string,
  ) {
    const result = await this.getPathfindingService.path_finding(Number(x), Number(y),Number(floor_id), Number(destination),);
    if (!result) {
      return { message: 'No path found' };
    }
    return result;
  }
}
