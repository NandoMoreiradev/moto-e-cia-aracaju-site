import {
  Controller, Post, UploadedFile, UseGuards,
  UseInterceptors, ParseFilePipe, MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { R2Service } from './r2.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { randomUUID } from 'crypto';
import * as path from 'path';

@ApiTags('R2 Storage')
@Controller('admin/r2')
export class R2Controller {
  constructor(private readonly r2Service: R2Service) {}

  @ApiOperation({ summary: '[Admin] Upload genérico de imagem para o editor de texto rico' })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @Post('upload/image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
          new FileTypeValidator({ fileType: '.(jpeg|jpg|png|webp|gif)$' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const ext = path.extname(file.originalname) || '.jpg';
    const key = `editor/${randomUUID()}${ext}`;
    const url = await this.r2Service.uploadFile(key, file.buffer, file.mimetype);
    return { url };
  }
}
