import { IsString, IsOptional, IsInt, IsBoolean, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBannerDto {
  @ApiProperty({ example: 'Performance Pura', required: false })
  @IsString()
  @IsOptional()
  label?: string;

  @ApiProperty({ example: 'Suzuki GSX-R1000R' })
  @IsString()
  titulo: string;

  @ApiProperty({ example: 'A lenda das pistas agora ao seu alcance.', required: false })
  @IsString()
  @IsOptional()
  subtitulo?: string;

  @ApiProperty({ example: '/motos/suzuki-gsx-r1000r', required: false })
  @IsString()
  @IsOptional()
  link?: string;

  @ApiProperty({ example: 0, default: 0 })
  @IsInt()
  @IsOptional()
  ordem?: number;

  @ApiProperty({ default: true })
  @IsBoolean()
  @IsOptional()
  ativo?: boolean;
}
