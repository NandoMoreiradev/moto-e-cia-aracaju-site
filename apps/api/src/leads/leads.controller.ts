import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Leads')
@Controller()
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @ApiOperation({ summary: 'Enviar formulário de contato' })
  @Post('leads')
  create(@Body() dto: CreateLeadDto) {
    return this.leadsService.create(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @Get('admin/leads')
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('naoLidos') naoLidos?: string,
  ) {
    return this.leadsService.findAll(+page, +limit, naoLidos === 'true');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @Patch('admin/leads/:id/ler')
  marcarComoLido(@Param('id') id: string) {
    return this.leadsService.marcarComoLido(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete('admin/leads/:id')
  remove(@Param('id') id: string) {
    return this.leadsService.remove(id);
  }
}
