import { Controller, Get, Post, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { MetaService } from './meta.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Meta Commerce')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin/meta')
export class MetaController {
  constructor(private readonly metaService: MetaService) {}

  @ApiOperation({ summary: 'Status dos dois catálogos Meta (Veículos + Produtos)' })
  @Get('status')
  status() {
    return this.metaService.getStatus();
  }

  @ApiOperation({ summary: 'Sincronizar todas as motos nos dois catálogos Meta' })
  @Post('sync')
  syncAll() {
    return this.metaService.syncAll();
  }

  @ApiOperation({ summary: 'Sincronizar moto nos dois catálogos (Veículos + Produtos)' })
  @Post('sync/:motoId')
  syncMoto(@Param('motoId') motoId: string) {
    return this.metaService.syncAllBoth(motoId);
  }

  @ApiOperation({ summary: 'Sincronizar moto apenas no Catálogo de Veículos (retargeting)' })
  @Post('sync/:motoId/vehicle')
  syncVehicle(@Param('motoId') motoId: string) {
    return this.metaService.syncMoto(motoId);
  }

  @ApiOperation({ summary: 'Sincronizar moto apenas no Catálogo de Produtos (Instagram Shopping)' })
  @Post('sync/:motoId/product')
  syncProduct(@Param('motoId') motoId: string) {
    return this.metaService.syncMotoAsProduct(motoId);
  }

  @ApiOperation({ summary: 'Remover produto do Meta Catalog' })
  @Delete('product/:metaProductId')
  deletarProduto(@Param('metaProductId') metaProductId: string) {
    return this.metaService.deletarProduto(metaProductId);
  }
}
