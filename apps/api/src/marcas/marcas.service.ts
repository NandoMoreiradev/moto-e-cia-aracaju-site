import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { R2Service } from '../r2/r2.service';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';

@Injectable()
export class MarcasService {
  constructor(
    private prisma: PrismaService,
    private r2: R2Service,
  ) {}

  async findAll() {
    return this.prisma.marca.findMany({
      where: { ativa: true },
      orderBy: { ordem: 'asc' },
    });
  }

  async findAllAdmin() {
    return this.prisma.marca.findMany({
      orderBy: { ordem: 'asc' },
    });
  }

  async findOne(id: string) {
    const marca = await this.prisma.marca.findUnique({ where: { id } });
    if (!marca) throw new NotFoundException('Marca não encontrada');
    return marca;
  }

  async create(dto: CreateMarcaDto) {
    const existing = await this.prisma.marca.findUnique({ where: { nome: dto.nome } });
    if (existing) throw new ConflictException('Marca já existe');

    return this.prisma.marca.create({
      data: {
        ...dto,
        logoUrl: '',
        logoR2Key: '',
      },
    });
  }

  async update(id: string, dto: UpdateMarcaDto) {
    await this.findOne(id);
    return this.prisma.marca.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    const marca = await this.findOne(id);
    if (marca.logoR2Key) {
      await this.r2.deleteFile(marca.logoR2Key).catch(() => null);
    }
    await this.prisma.marca.delete({ where: { id } });
    return { message: 'Marca removida com sucesso' };
  }

  async uploadLogo(id: string, file: Express.Multer.File) {
    const marca = await this.findOne(id);

    if (marca.logoR2Key) {
      await this.r2.deleteFile(marca.logoR2Key).catch(() => null);
    }

    const r2Key = `marcas/${id}-${Date.now()}-${file.originalname}`;
    const url = await this.r2.uploadFile(r2Key, file.buffer, file.mimetype);

    return this.prisma.marca.update({
      where: { id },
      data: {
        logoUrl: url,
        logoR2Key: r2Key,
      },
    });
  }
}
