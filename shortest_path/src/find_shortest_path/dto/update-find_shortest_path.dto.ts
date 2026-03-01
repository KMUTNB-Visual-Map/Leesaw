import { PartialType } from '@nestjs/mapped-types';
import { CreateFindShortestPathDto } from './create-find_shortest_path.dto';

export class UpdateFindShortestPathDto extends PartialType(CreateFindShortestPathDto) {}
