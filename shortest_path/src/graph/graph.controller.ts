import { Controller, Post, Body, HttpCode, ValidationPipe, UsePipes, Get, Param, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { GraphService } from './graph.service';
import { SnapLocationDto } from './dto/graph.dto';

@ApiTags('Graph & Pathfinding')
@Controller('api/graph')
export class GraphController {
  private readonly logger = new Logger(GraphController.name);

  constructor(private readonly graphService: GraphService) {}

  @Post('snap')
  @HttpCode(200)
  @ApiOperation({ summary: 'Coordinate Snapping: Find the nearest node from given GPS coordinates' })
  @ApiBody({ type: SnapLocationDto })
  @ApiResponse({ status: 200, description: 'Successfully found the nearest node.' })
  @UsePipes(new ValidationPipe({ transform: true }))
  snapLocation(@Body() body: SnapLocationDto) {
    this.logger.log(`Received snap request: x=${body.x}, y=${body.y}, floor=${body.floor_id}`);
    
    const result = this.graphService.snapToNearestNode(body.x, body.y, body.floor_id);

    if (result) {
      this.logger.log(`Snapped to Node ID: ${result.node_id}`);
      return { status: 'success', data: result };
    } else {
      this.logger.warn(`Failed to snap: No nearest node found.`);
      return { status: 'error', message: 'No nearest node found in this area.' };
    }
  }

  @Get('neighbors/:floor_id/:node_id')
  @ApiOperation({ summary: 'Get Neighbors: Retrieve connected nodes for pathfinding algorithm' })
  @ApiParam({ name: 'floor_id', description: 'Floor ID', example: 1 })
  @ApiParam({ name: 'node_id', description: 'Source Node ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Returns an array of connected nodes with costs.' })
  getNeighbors(
    @Param('floor_id') floor_id: string,
    @Param('node_id') node_id: string
  ) {
    this.logger.log(`Fetching neighbors for Node ID: ${node_id} on Floor: ${floor_id}`);
    
    const floorIdNum = parseInt(floor_id, 10);
    const nodeIdNum = parseInt(node_id, 10);

    const neighbors = this.graphService.getNeighborsForPathfinding(nodeIdNum, floorIdNum);

    if (neighbors && neighbors.length > 0) {
      return {
        status: 'success',
        message: `Found ${neighbors.length} connected nodes.`,
        data: neighbors
      };
    } else {
      return {
        status: 'error',
        message: `Node ${node_id} has no neighbors or does not exist.`
      };
    }
  }
}