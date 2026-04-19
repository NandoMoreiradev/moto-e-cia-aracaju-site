import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { R2Service } from '../r2/r2.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';

@Injectable()
export class BannersService {
  constructor(
    private prisma: PrismaService,
    private r2: R2Service,
  ) {}

  async findAll() {
    return this.prisma.banner.findMany({
      where: { ativo: true },
      orderBy: { ordem: 'asc' },
    });
  }

  async findAllAdmin() {
    return this.prisma.banner.findMany({
      orderBy: { ordem: 'asc' },
    });
  }

  async findOne(id: string) {
    const banner = await this.prisma.banner.findUnique({ where: { id } });
    if (!banner) throw new NotFoundException('Banner não encontrado');
    return banner;
  }

  async create(dto: CreateBannerDto) {
    return this.prisma.banner.create({
      data: {
        ...dto,
        imageUrl: '', // Será atualizado no upload
        imageR2Key: '',
        mobileImageUrl: null,
        mobileImageR2Key: null,
      },
    });
  }

  async update(id: string, dto: UpdateBannerDto) {
    await this.findOne(id);
    return this.prisma.banner.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    const banner = await this.findOne(id);
    if (banner.imageR2Key) {
      await this.r2.deleteFile(banner.imageR2Key).catch(() => null);
    }
    if (banner.mobileImageR2Key) {
      await this.r2.deleteFile(banner.mobileImageR2Key).catch(() => null);
    }
    await this.prisma.banner.delete({ where: { id } });
    return { message: 'Banner removido com sucesso' };
  }

  async uploadImage(id: string, file: Express.Multer.File) {
    const banner = await this.findOne(id);

    if (banner.imageR2Key) {
      await this.r2.deleteFile(banner.imageR2Key).catch(() => null);
    }

    const r2Key = `banners/${id}-${Date.now()}-${file.originalname}`;
    const url = await this.r2.uploadFile(r2Key, file.buffer, file.mimetype);

    return this.prisma.banner.update({
      where: { id },
      data: {
        imageUrl: url,
        imageR2Key: r2Key,
      },
    });
  }

  async uploadMobileImage(id: string, file: Express.Multer.File) {
    const banner = await this.findOne(id);

    if (banner.mobileImageR2Key) {
      await this.r2.deleteFile(banner.mobileImageR2Key).catch(() => null);
    }

    const r2Key = `banners/mobile-${id}-${Date.now()}-${file.originalname}`;
    const url = await this.r2.uploadFile(r2Key, file.buffer, file.mimetype);

    return this.prisma.banner.update({
      where: { id },
      data: {
        mobileImageUrl: url,
        mobileImageR2Key: r2Key,
      },
    });
  }
}
