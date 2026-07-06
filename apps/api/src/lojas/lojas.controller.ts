import {
  Controller, Get, Post, Patch, Delete, Body, Param,
  UseGuards, UseInterceptors, UploadedFile, ParseFilePipe,
  MaxFileSizeValidator, FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { LojasService } from './lojas.service';
import { CreateLojaDto } from './dto/create-loja.dto';
import { UpdateLojaDto } from './dto/update-loja.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Lojas')
@Controller()
export class LojasController {
  constructor(private readonly lojasService: LojasService) {}

  @ApiOperation({ summary: 'Listar lojas ativas' })
  @Get('lojas')
  findAll() {
    return this.lojasService.findAll();
  }

  @ApiOperation({ summary: '[Admin] Listar todas as lojas' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @Get('admin/lojas')
  findAllAdmin() {
    return this.lojasService.findAllAdmin();
  }

  @ApiOperation({ summary: '[Admin] Criar nova loja' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @Post('admin/lojas')
  create(@Body() dto: CreateLojaDto) {
    return this.lojasService.create(dto);
  }

  @ApiOperation({ summary: '[Admin] Atualizar loja' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @Patch('admin/lojas/:id')
  update(@Param('id') id: string, @Body() dto: UpdateLojaDto) {
    return this.lojasService.update(id, dto);
  }

  @ApiOperation({ summary: '[Admin] Deletar loja' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete('admin/lojas/:id')
  remove(@Param('id') id: string) {
    return this.lojasService.remove(id);
  }

  @ApiOperation({ summary: '[Admin] Upload de foto da loja' })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @Post('admin/lojas/:id/fotos')
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
    return this.lojasService.uploadFoto(id, file);
  }

  @ApiOperation({ summary: '[Admin] Deletar foto da loja' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @Delete('admin/lojas/:id/fotos/:fotoId')
  deleteFoto(@Param('id') id: string, @Param('fotoId') fotoId: string) {
    return this.lojasService.deleteFoto(id, fotoId);
  }
}
