import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import type { Point } from 'geojson';

@Entity('node')
export class FindShortestPath {
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
