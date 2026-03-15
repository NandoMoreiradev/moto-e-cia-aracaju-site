import {
  Controller, Get, Post, Patch, Delete, Body, Param,
  UseGuards, UseInterceptors, UploadedFile, ParseFilePipe,
  MaxFileSizeValidator, FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { MarcasService } from './marcas.service';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Marcas')
@Controller()
export class MarcasController {
  constructor(private readonly marcasService: MarcasService) {}

  @ApiOperation({ summary: 'Listar marcas ativas' })
  @Get('marcas')
  findAll() {
    return this.marcasService.findAll();
  }

  @ApiOperation({ summary: '[Admin] Listar todas as marcas' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @Get('admin/marcas')
  findAllAdmin() {
    return this.marcasService.findAllAdmin();
  }

  @ApiOperation({ summary: '[Admin] Criar nova marca' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @Post('admin/marcas')
  create(@Body() dto: CreateMarcaDto) {
    return this.marcasService.create(dto);
  }

  @ApiOperation({ summary: '[Admin] Atualizar marca' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @Patch('admin/marcas/:id')
  update(@Param('id') id: string, @Body() dto: UpdateMarcaDto) {
    return this.marcasService.update(id, dto);
  }

  @ApiOperation({ summary: '[Admin] Deletar marca' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete('admin/marcas/:id')
  remove(@Param('id') id: string) {
    return this.marcasService.remove(id);
  }

  @ApiOperation({ summary: '[Admin] Upload de logomarca' })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @Post('admin/marcas/:id/logo')
  @UseInterceptors(FileInterceptor('logo'))
  uploadLogo(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /^image\/(jpeg|png|webp|svg\+xml)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.marcasService.uploadLogo(id, file);
  }
}
