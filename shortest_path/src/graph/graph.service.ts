import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Edge_table, Node_table } from './entities/graph.entity';


export interface GraphNode {
  node_id: number;
  floor_id: number;
  x: number;
  y: number;
  neighbors: { targetNodeId: number; cost: number }[];
}

export interface SnappedResult {
  node_id: number;
  x: number;
  y: number;
  floor_id: number;
  distance_diff: number;
}

@Injectable()
export class GraphService implements OnModuleInit {

  constructor(
    @InjectRepository(Node_table)
    private node_table: Repository<Node_table>,

    @InjectRepository(Edge_table)
    private edge_table: Repository<Edge_table>,
  ) {}

  private readonly logger = new Logger(GraphService.name);
  private mapGraph: Map<number, Map<number, GraphNode>> = new Map();
  
  private readonly CELL_SIZE = 0.001; 
  private spatialIndex: Map<number, Map<string, GraphNode[]>> = new Map();

  async onModuleInit() {
    this.logger.log('Initializing In-Memory Graph and Spatial Index...');
    await this.buildGraph();
    this.checkGraphIntegrity();
  }

  private getCellKey(x: number, y: number): string {
    const cellX = Math.floor(x / this.CELL_SIZE);
    const cellY = Math.floor(y / this.CELL_SIZE);
    return `${cellX},${cellY}`;
  }

  private async buildGraph() {

    const nodes: { node_id: number; floor_id: number; x: number; y: number }[] = await this.node_table.query(`
      SELECT 
        node_id,
        floor_id,
        ST_X(geom) as x,
        ST_Y(geom) as y
      FROM node;
    `);
    const edges = await this.edge_table.query(
      'select edge_id from edge;'
    );

    // nodes.forEach(node => {
    //   if (!this.mapGraph.has(node.floor_id)) {
    //     this.mapGraph.set(node.floor_id, new Map());
    //     this.spatialIndex.set(node.floor_id, new Map());
    //   }
    //   const graphNode = { ...node, neighbors: [] };


    //   this.mapGraph.get(node.floor_id)?.set(node.node_id, graphNode);

    //   const cellKey = this.getCellKey(node.x, node.y);
    //   const floorSpatialIndex = this.spatialIndex.get(node.floor_id);

    //   if (floorSpatialIndex){
    //     if (!floorSpatialIndex.has(cellKey)) {
    //       floorSpatialIndex.set(cellKey, []);
    //     }
    //     floorSpatialIndex.get(cellKey)?.push(graphNode);
    //   }
    // });

    nodes.forEach(node => {
    if (!this.mapGraph.has(node.floor_id)) {
      this.mapGraph.set(node.floor_id, new Map());
      this.spatialIndex.set(node.floor_id, new Map());
    }
    const graphNode: GraphNode = { ...node, neighbors: [] };
    this.mapGraph.get(node.floor_id)?.set(node.node_id, graphNode);

    const cellKey = this.getCellKey(node.x, node.y);
    const floorSpatialIndex = this.spatialIndex.get(node.floor_id);

    if (floorSpatialIndex) {
      if (!floorSpatialIndex.has(cellKey)) {
        floorSpatialIndex.set(cellKey, []);
      }
      floorSpatialIndex.get(cellKey)?.push(graphNode);
    }
    });

    edges.forEach(edge => {
      for (const floorNodes of this.mapGraph.values()) {
        const sourceNode = floorNodes.get(edge.source);
        const targetNode = floorNodes.get(edge.target);
        if (sourceNode && targetNode) {
          sourceNode.neighbors.push({ targetNodeId: targetNode.node_id, cost: edge.cost });
          targetNode.neighbors.push({ targetNodeId: sourceNode.node_id, cost: edge.cost });
        }
      }
    });

    this.logger.log('Graph loaded and Spatial Index built successfully.');
  }

  private checkGraphIntegrity() {
    let hasError = false;
    this.mapGraph.forEach((floorNodes, floorId) => {
      floorNodes.forEach(node => {
        if (node.neighbors.length === 0) {
          this.logger.warn(`Isolated Node detected: Node ID ${node.node_id} (Floor ${floorId}) has no edges.`);
          hasError = true;
        }
      });
    });
    if (!hasError) this.logger.log('Graph integrity check passed.');
  }

  public snapToNearestNode(userX: number, userY: number, floorId: number): SnappedResult | null {
    const floorIndex = this.spatialIndex.get(floorId);
    if (!floorIndex) return null;

    const centerCellX = Math.floor(userX / this.CELL_SIZE);
    const centerCellY = Math.floor(userY / this.CELL_SIZE);

    let nearestNode: GraphNode | null = null; // Explicitly type nearestNode
    
    let minDistance = Infinity;

    for (let offsetX = -1; offsetX <= 1; offsetX++) {
      for (let offsetY = -1; offsetY <= 1; offsetY++) {
        const checkCellKey = `${centerCellX + offsetX},${centerCellY + offsetY}`;
        const nodesInCell: GraphNode[] = floorIndex.get(checkCellKey) || []; // Ensure nodesInCell is always an array

        for (const node of nodesInCell) {
          const distance = Math.sqrt(Math.pow(node.x - userX, 2) + Math.pow(node.y - userY, 2));
          if (distance < minDistance) {
            minDistance = distance;
            nearestNode = node; // Explicitly assign as GraphNode
          }
        }
      }
    }

    if (!nearestNode) {
        this.logger.warn(`No nodes found in proximity for coordinates (${userX}, ${userY})`);
        return null; // Ensure null is returned if no nearest node is found
    }

    return {
      node_id: nearestNode.node_id,
      x: nearestNode.x,
      y: nearestNode.y,
      floor_id: nearestNode.floor_id,
      distance_diff: minDistance
    };
  }

  public getNeighborsForPathfinding(nodeId: number, floorId: number): { targetNodeId: number, cost: number }[] {
    const floorNodes = this.mapGraph.get(floorId);
    if (!floorNodes) return [];
    const node = floorNodes.get(nodeId);
    return node ? node.neighbors : [];
  }
}