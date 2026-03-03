import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindShortestPath } from './entities/find_shortest_path.entity';


@Injectable()
export class FindShortestPathService {
  constructor(
    @InjectRepository(FindShortestPath)
    private find_shortest_part_Repository: Repository<FindShortestPath>,
  ) {}

  async elevator( source: number, destination: number){
    const result = await this.find_shortest_part_Repository.query(
      `
      SELECT 
          e.node_id AS elevator_node
      FROM node n
      JOIN floor f ON f.floor_id = n.floor_id
      LEFT JOIN node e 
          ON e.node_type = 'Elevator_level ' || f.floor_number || '_01'
      WHERE n.node_id IN (CAST($1 AS INTEGER), CAST($2 AS INTEGER))
      ORDER BY 
        CASE  
          WHEN n.node_id = CAST($1 AS INTEGER) THEN 1
          WHEN n.node_id = CAST($2 AS INTEGER) THEN 2
        END
      `,
      [source, destination],
    );
    let source_elevator_node = result[0].elevator_node;
    let destination_elevator_node = result[1].elevator_node;
    let get_result = [source_elevator_node, destination_elevator_node];
    let check:boolean = true;
    if(result[0].elevator_node == result[1].elevator_node){
      check = true;
    } else {
      check = false;
    }
    return [get_result, check];
  }


  async runAstar(source: number, destination: number) {
    const result = await this.find_shortest_part_Repository.query(
      `
      SELECT *
      FROM pgr_astar(
        'SELECT 
            edge_id AS id,
            source,
            target,
            cost,
            ST_X(ST_StartPoint(geom)) AS x1,
            ST_Y(ST_StartPoint(geom)) AS y1,
            ST_X(ST_EndPoint(geom))   AS x2,
            ST_Y(ST_EndPoint(geom))   AS y2
         FROM edge',
        CAST($1 AS INTEGER), CAST($2 AS INTEGER), false
      )
      `,
      [source, destination],
    );
    return result.map(row => Number(row.node));
  }

  async calculate(source: number, destination: number) {
    let node_elevator = await this.elevator(source, destination);

    let arrNode: number[];

    // same floor
    if (node_elevator[1] == true)  {
      const rows = await this.runAstar(source, destination);
      arrNode = rows;
    }
    // different floor
    else {
      let source_elevator = node_elevator[0][0];
      let destination_elevator = node_elevator[0][1];
      let arr_elevator = [source_elevator, destination_elevator ];
      const rows1 = await this.runAstar(source, arr_elevator[0]);
      const rows2 = await this.runAstar(arr_elevator[1], destination);
      arrNode = [ ...rows1, ...rows2];
    }
    const node_format = await this.find_shortest_part_Repository.query(
      `
      SELECT
        node_id,
        floor_id,
        ST_X(geom) as x,
        ST_Y(geom) as y
      FROM node
      WHERE node_id = ANY($1::int[])
      ORDER BY array_position($1::int[], node_id)
      `,
      [arrNode]
    );
    
    return node_format;
    // return arrNode;
  }



}
