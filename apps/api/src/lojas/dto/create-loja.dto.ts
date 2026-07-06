import { IsString, IsOptional, IsInt, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLojaDto {
  @ApiProperty({ example: 'Matriz' })
  @IsString()
  nome!: string;

  @ApiProperty({ example: 'Aracaju-SE' })
  @IsString()
  cidadeEstado!: string;

  @ApiProperty({ example: 'Av. Pedro Calazans, 717, Centro' })
  @IsString()
  endereco!: string;

  @ApiProperty({ example: '(79) 98166-4850' })
  @IsString()
  telefone!: string;

  @ApiProperty({ example: '5579981664850' })
  @IsString()
  whatsapp!: string;

  @ApiProperty({ example: 'Seg à Sex: 08:00 às 18:00 | Sáb: 08:00 às 13:00' })
  @IsString()
  horario!: string;

  @ApiProperty({ example: 'https://maps.google.com/...', required: false })
  @IsString()
  @IsOptional()
  mapUrl?: string;

  @ApiProperty({ example: 0, default: 0 })
  @IsInt()
  @IsOptional()
  ordem?: number;

  @ApiProperty({ default: true })
  @IsBoolean()
  @IsOptional()
  ativa?: boolean;
}
