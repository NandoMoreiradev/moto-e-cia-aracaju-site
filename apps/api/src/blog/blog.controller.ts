import {
  Controller, Get, Post, Patch, Delete, Body, Param, Query,
  UseGuards, UseInterceptors, UploadedFile, ParseFilePipe,
  MaxFileSizeValidator, FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { BlogService } from './blog.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Blog')
@Controller()
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @ApiOperation({ summary: 'Listar posts publicados' })
  @Get('blog')
  findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.blogService.findAll(+page, +limit, true);
  }

  @ApiOperation({ summary: 'Detalhe de um post por slug' })
  @Get('blog/:slug')
  findOne(@Param('slug') slug: string) {
    return this.blogService.findOne(slug);
  }

  @ApiOperation({ summary: '[Admin] Listar todos os posts (incluindo rascunhos)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @Get('admin/blog')
  findAllAdmin(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.blogService.findAll(+page, +limit, false);
  }

  @ApiOperation({ summary: '[Admin] Detalhe de post por ID' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @Get('admin/blog/:id')
  findOneAdmin(@Param('id') id: string) {
    return this.blogService.findOneAdmin(id);
  }

  @ApiOperation({ summary: '[Admin] Criar post' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @Post('admin/blog')
  create(@Body() dto: any) {
    return this.blogService.create(dto);
  }

  @ApiOperation({ summary: '[Admin] Atualizar post' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @Patch('admin/blog/:id')
  update(@Param('id') id: string, @Body() dto: any) {
    return this.blogService.update(id, dto);
  }

  @ApiOperation({ summary: '[Admin] Deletar post' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete('admin/blog/:id')
  remove(@Param('id') id: string) {
    return this.blogService.remove(id);
  }

  @ApiOperation({ summary: '[Admin] Upload de capa do post' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @Post('admin/blog/:id/cover')
  @UseInterceptors(FileInterceptor('cover'))
  uploadCover(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /^image\/(jpeg|png|webp)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.blogService.uploadCover(id, file);
  }
}
