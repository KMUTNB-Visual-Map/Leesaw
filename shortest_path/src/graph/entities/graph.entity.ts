import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import type { Point } from 'geojson';

@Entity('node')
export class Node_table {
    @PrimaryGeneratedColumn()
    node_id: number;

    @Column()
    floor_id: number;

    @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
    })
    geom: Point;
    
}
@Entity('edge')
export class Edge_table {
    @PrimaryGeneratedColumn()
    edge_id: number;

    @Column()
    source: number;

    @Column()
    destination: number;
    
}

