import { PartialType } from '@nestjs/swagger';
import { CreateGetPathfindingDto } from './create-get_pathfinding.dto';

export class UpdateGetPathfindingDto extends PartialType(CreateGetPathfindingDto) {}
