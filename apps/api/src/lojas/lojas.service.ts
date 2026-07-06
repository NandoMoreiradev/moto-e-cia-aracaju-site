import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { R2Service } from '../r2/r2.service';
import { CreateLojaDto } from './dto/create-loja.dto';
import { UpdateLojaDto } from './dto/update-loja.dto';

@Injectable()
export class LojasService {
  constructor(
    private prisma: PrismaService,
    private r2: R2Service,
  ) {}

  async findAll() {
    return this.prisma.loja.findMany({
      where: { ativa: true },
      orderBy: { ordem: 'asc' },
      include: { fotos: { orderBy: { ordem: 'asc' } } },
    });
  }

  async findAllAdmin() {
    return this.prisma.loja.findMany({
      orderBy: { ordem: 'asc' },
      include: { fotos: { orderBy: { ordem: 'asc' } } },
    });
  }

  async findOne(id: string) {
    const loja = await this.prisma.loja.findUnique({
      where: { id },
      include: { fotos: { orderBy: { ordem: 'asc' } } },
    });
    if (!loja) throw new NotFoundException('Loja não encontrada');
    return loja;
  }

  async create(dto: CreateLojaDto) {
    return this.prisma.loja.create({ data: dto, include: { fotos: true } });
  }

  async update(id: string, dto: UpdateLojaDto) {
    await this.findOne(id);
    return this.prisma.loja.update({
      where: { id },
      data: dto,
      include: { fotos: { orderBy: { ordem: 'asc' } } },
    });
  }

  async remove(id: string) {
    const loja = await this.findOne(id);
    await Promise.all(loja.fotos.map((foto) => this.r2.deleteFile(foto.r2Key).catch(() => null)));
    await this.prisma.loja.delete({ where: { id } });
    return { message: 'Loja removida com sucesso' };
  }

  async uploadFoto(id: string, file: Express.Multer.File) {
    await this.findOne(id);

    const r2Key = `lojas/${id}-${Date.now()}-${file.originalname}`;
    const url = await this.r2.uploadFile(r2Key, file.buffer, file.mimetype);

    const ultima = await this.prisma.lojaFoto.findFirst({
      where: { lojaId: id },
      orderBy: { ordem: 'desc' },
    });

    return this.prisma.lojaFoto.create({
      data: {
        lojaId: id,
        url,
        r2Key,
        ordem: ultima ? ultima.ordem + 1 : 0,
      },
    });
  }

  async deleteFoto(id: string, fotoId: string) {
    const foto = await this.prisma.lojaFoto.findFirst({ where: { id: fotoId, lojaId: id } });
    if (!foto) throw new NotFoundException('Foto não encontrada');

    await this.r2.deleteFile(foto.r2Key).catch(() => null);
    await this.prisma.lojaFoto.delete({ where: { id: fotoId } });
    return { message: 'Foto removida com sucesso' };
  }
}
