import {
  Controller, Get, Post, Patch, Delete, Body, Param, Query,
  UseGuards, UseInterceptors, UploadedFile, ParseFilePipe,
  MaxFileSizeValidator, FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { MotosService } from './motos.service';
import { CreateMotoDto } from './dto/create-moto.dto';
import { UpdateMotoDto } from './dto/update-moto.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Motos')
@Controller()
export class MotosController {
  constructor(private readonly motosService: MotosService) {}

  // ==========================================
  // Endpoints públicos
  // ==========================================

  @ApiOperation({ summary: 'Listar motos com filtros e paginação' })
  @Get('motos')
  findAll(@Query() query: any) {
    return this.motosService.findAll({
      ...query,
      page: query.page ? parseInt(query.page, 10) : undefined,
      limit: query.limit ? parseInt(query.limit, 10) : undefined,
      destaque: query.destaque !== undefined
        ? query.destaque === 'true' || query.destaque === true
        : undefined,
      precoMin: query.precoMin ? parseFloat(query.precoMin) : undefined,
      precoMax: query.precoMax ? parseFloat(query.precoMax) : undefined,
    });
  }

  @ApiOperation({ summary: 'Detalhe de uma moto por slug' })
  @Get('motos/:slug')
  findOne(@Param('slug') slug: string) {
    return this.motosService.findOne(slug);
  }

  // ==========================================
  // Endpoints admin (requerem JWT)
  // ==========================================

  @ApiOperation({ summary: '[Admin] Criar nova moto' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @Post('admin/motos')
  create(@Body() dto: CreateMotoDto) {
    return this.motosService.create(dto);
  }

  @ApiOperation({ summary: '[Admin] Atualizar moto' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @Patch('admin/motos/:id')
  update(@Param('id') id: string, @Body() dto: UpdateMotoDto) {
    return this.motosService.update(id, dto);
  }

  @ApiOperation({ summary: '[Admin] Deletar moto' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete('admin/motos/:id')
  remove(@Param('id') id: string) {
    return this.motosService.remove(id);
  }

  @ApiOperation({ summary: '[Admin] Upload de foto da moto' })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @Post('admin/motos/:id/fotos')
  @UseInterceptors(FileInterceptor('foto'))
  uploadFoto(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
          new FileTypeValidator({ fileType: '.(jpeg|jpg|png|webp|svg\\+xml|svg)$' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.motosService.uploadFoto(id, file);
  }

  @ApiOperation({ summary: '[Admin] Deletar foto da moto' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @Delete('admin/motos/:id/fotos/:fotoId')
  deleteFoto(@Param('id') id: string, @Param('fotoId') fotoId: string) {
    return this.motosService.deleteFoto(id, fotoId);
  }

  @ApiOperation({ summary: '[Admin] Definir foto principal da moto' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @Patch('admin/motos/:id/fotos/:fotoId/principal')
  setFotoPrincipal(@Param('id') id: string, @Param('fotoId') fotoId: string) {
    return this.motosService.setFotoPrincipal(id, fotoId);
  }

  @ApiOperation({ summary: '[Admin] Atualizar metadados da foto (Cor)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @Patch('admin/motos/:id/fotos/:fotoId')
  updateFoto(
    @Param('id') id: string,
    @Param('fotoId') fotoId: string,
    @Body() body: { corHex?: string; corNome?: string },
  ) {
    return this.motosService.updateFoto(id, fotoId, body);
  }

  @ApiOperation({ summary: '[Admin] Upload da foto de capa (Banner)' })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @Post('admin/motos/:id/capa')
  @UseInterceptors(FileInterceptor('capa'))
  uploadCapa(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
          new FileTypeValidator({ fileType: '.(jpeg|jpg|png|webp|svg\\+xml|svg)$' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.motosService.uploadCapa(id, file);
  }

  @ApiOperation({ summary: '[Admin] Deletar foto de capa' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @Delete('admin/motos/:id/capa')
  deleteCapa(@Param('id') id: string) {
    return this.motosService.deleteCapa(id);
  }

  @ApiOperation({ summary: '[Admin] Upload da logomarca da moto' })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @Post('admin/motos/:id/logo')
  @UseInterceptors(FileInterceptor('logo'))
  uploadLogo(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: '.(jpeg|jpg|png|webp|svg\\+xml|svg)$' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.motosService.uploadLogo(id, file);
  }

  @ApiOperation({ summary: '[Admin] Deletar logomarca da moto' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @Delete('admin/motos/:id/logo')
  deleteLogo(@Param('id') id: string) {
    return this.motosService.deleteLogo(id);
  }
}
