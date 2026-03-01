import { Injectable } from '@nestjs/common';
import { FindShortestPathService } from 'src/find_shortest_path/find_shortest_path.service';
import { GraphService } from 'src/graph/graph.service';

@Injectable()
export class GetPathfindingService {
  constructor(
    private readonly graphService: GraphService,
    private readonly findShortestPathService: FindShortestPathService,
  ) {}
  async nearest_node(x, y, floor_id){
    const result = await this.graphService.snapToNearestNode( x, y, floor_id);
    return result;
  }
  async path_algorithm( source, destination){
    const result = await this.findShortestPathService.calculate( source, destination);
    return result;
  }
  async path_finding( x, y, floor_id, destination){
    const source_node = await this.nearest_node(x, y, floor_id);

    const path_finding_result = await this.path_algorithm( source_node?.node_id, destination);
    return path_finding_result;
    // return source_node;

  }
}
