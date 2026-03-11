import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MarcaMoto, TipoMoto, StatusMoto } from '@moto-e-cia/shared';

export class CreateMotoDto {
  @ApiProperty({ example: 'GSX-8R 2024' })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({ enum: ['SUZUKI', 'HAOJUE', 'ZONTES', 'KYMCO', 'OUTRO'] })
  @IsEnum(['SUZUKI', 'HAOJUE', 'ZONTES', 'KYMCO', 'OUTRO'])
  marca: MarcaMoto;

  @ApiProperty({ enum: ['SPORT', 'NAKED', 'ADVENTURE', 'SCOOTER', 'TRAIL'] })
  @IsEnum(['SPORT', 'NAKED', 'ADVENTURE', 'SCOOTER', 'TRAIL'])
  tipo: TipoMoto;

  @ApiPropertyOptional({ example: 49900.0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  preco?: number;

  @ApiPropertyOptional({ example: 'R$ 49.900,00' })
  @IsOptional()
  @IsString()
  precoFormatado?: string;

  @ApiProperty({ example: 'A GSX-8R é uma naked esportiva...' })
  @IsString()
  @IsNotEmpty()
  descricao: string;

  @ApiPropertyOptional()
  @IsOptional()
  specs?: Record<string, string | string[]>;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  destaque?: boolean;

  @ApiPropertyOptional({ enum: ['DISPONIVEL', 'VENDIDA', 'RESERVADA', 'ALUGUEL'] })
  @IsOptional()
  @IsEnum(['DISPONIVEL', 'VENDIDA', 'RESERVADA', 'ALUGUEL'])
  status?: StatusMoto;
}
