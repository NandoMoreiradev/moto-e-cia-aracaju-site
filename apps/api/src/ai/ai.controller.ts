import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AiService } from './ai.service';
import { IsString, IsNotEmpty } from 'class-validator';

export class GenerateSpecsDto {
  @IsString()
  @IsNotEmpty()
  marca: string;

  @IsString()
  @IsNotEmpty()
  nome: string;
}

@ApiTags('ai')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('moto-specs')
  @ApiOperation({ summary: 'Gera especificações técnicas de uma moto via IA' })
  async generateSpecs(@Body() dto: GenerateSpecsDto) {
    const specs = await this.aiService.generateMotoSpecs(dto.marca, dto.nome);
    return { data: specs };
  }
}
