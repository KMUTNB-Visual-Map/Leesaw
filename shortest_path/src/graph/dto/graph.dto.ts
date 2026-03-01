import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty } from 'class-validator';

export class SnapLocationDto {
  @ApiProperty({ description: 'พิกัดแนวแกน X (ลองจิจูด / พิกัดจำลอง)', example: 13.820298 })
  @IsNumber()
  @IsNotEmpty()
  x: number;

  @ApiProperty({ description: 'พิกัดแนวแกน Y (ละติจูด / พิกัดจำลอง)', example: 100.519234 })
  @IsNumber()
  @IsNotEmpty()
  y: number;

  @ApiProperty({ description: 'เลขชั้นที่ผู้ใช้อยู่', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  floor_id: number;
}