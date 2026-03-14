import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MarcaMoto, TipoMoto, StatusMoto, Combustivel, Transmissao } from '@moto-e-cia/shared';

const MARCAS = ['SUZUKI', 'HAOJUE', 'ZONTES', 'KYMCO', 'OUTRO', 'SEMINOVA'];
const TIPOS = ['SPORT', 'NAKED', 'ADVENTURE', 'SCOOTER', 'TRAIL'];
const STATUS = ['DISPONIVEL', 'VENDIDA', 'RESERVADA', 'ALUGUEL'];
const COMBUSTIVEIS = ['GASOLINA', 'ETANOL', 'FLEX', 'ELETRICO'];
const TRANSMISSOES = ['MANUAL', 'AUTOMATICA', 'SEMI_AUTOMATICA'];

export class CreateMotoDto {
  @ApiProperty({ example: 'GSX-8R 2024' })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({ enum: MARCAS })
  @IsEnum(MARCAS)
  marca: MarcaMoto;

  @ApiProperty({ enum: TIPOS })
  @IsEnum(TIPOS)
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

  @ApiPropertyOptional({ enum: STATUS })
  @IsOptional()
  @IsEnum(STATUS)
  status?: StatusMoto;

  // ── Campos obrigatórios Meta Vehicle Catalog (Graph API v25.0) ─────────────

  @ApiProperty({ example: 2024, description: 'Ano de fabricação' })
  @IsOptional()
  @IsNumber()
  ano?: number;

  @ApiPropertyOptional({ example: 0, description: 'Quilometragem (0 = zero km)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  km?: number;

  @ApiPropertyOptional({ example: 'Vermelho Triton' })
  @IsOptional()
  @IsString()
  cor?: string;

  @ApiPropertyOptional({ example: '9BVHS44R0KB016423', description: 'Número de chassi' })
  @IsOptional()
  @IsString()
  vin?: string;

  @ApiPropertyOptional({ enum: COMBUSTIVEIS, default: 'GASOLINA' })
  @IsOptional()
  @IsEnum(COMBUSTIVEIS)
  combustivel?: Combustivel;

  @ApiPropertyOptional({ enum: TRANSMISSOES, default: 'MANUAL' })
  @IsOptional()
  @IsEnum(TRANSMISSOES)
  transmissao?: Transmissao;
}
