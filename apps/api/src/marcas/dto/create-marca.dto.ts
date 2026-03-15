import { IsString, IsOptional, IsInt, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMarcaDto {
  @ApiProperty({ example: 'SUZUKI' })
  @IsString()
  nome: string;

  @ApiProperty({ example: 0, default: 0 })
  @IsInt()
  @IsOptional()
  ordem?: number;

  @ApiProperty({ default: true })
  @IsBoolean()
  @IsOptional()
  ativa?: boolean;
}
