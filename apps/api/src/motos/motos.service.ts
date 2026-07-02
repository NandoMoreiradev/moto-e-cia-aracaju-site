import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { R2Service } from '../r2/r2.service';
import { MetaService } from '../meta/meta.service';
import { CreateMotoDto } from './dto/create-moto.dto';
import { UpdateMotoDto } from './dto/update-moto.dto';
import slugify from 'slugify';

@Injectable()
export class MotosService {
  constructor(
    private prisma: PrismaService,
    private r2: R2Service,
    private meta: MetaService,
  ) {}

  private generateSlug(nome: string): string {
    return slugify(nome, { lower: true, strict: true, locale: 'pt' });
  }

  async findAll(filters: {
    marca?: string;
    tipo?: string;
    status?: string;
    destaque?: boolean;
    search?: string;
    page?: number;
    limit?: number;
    condicao?: 'NOVA' | 'SEMINOVA';
  }) {
    const page = filters.page || 1;
    const limit = filters.limit || 12;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (filters.marca) where.marca = filters.marca;
    if (filters.tipo) where.tipo = filters.tipo;
    if (filters.status) where.status = filters.status;
    if (filters.destaque !== undefined) where.destaque = filters.destaque;
    if (filters.search) {
      where.OR = [
        { nome: { contains: filters.search, mode: 'insensitive' } },
        { descricao: { contains: filters.search, mode: 'insensitive' } },
      ];
    }
    if (filters.condicao === 'NOVA') {
      where.km = 0;
    } else if (filters.condicao === 'SEMINOVA') {
      where.km = { gt: 0 };
    }

    const [motos, total] = await Promise.all([
      this.prisma.moto.findMany({
        where,
        include: { fotos: { orderBy: { ordem: 'asc' } } },
        orderBy: [{ destaque: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
      }),
      this.prisma.moto.count({ where }),
    ]);

    return {
      data: motos,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(slug: string) {
    const moto = await this.prisma.moto.findUnique({
      where: { slug },
      include: { fotos: { orderBy: { ordem: 'asc' } } },
    });

    if (!moto) throw new NotFoundException(`Moto "${slug}" não encontrada`);
    return moto;
  }

  async findById(id: string) {
    const moto = await this.prisma.moto.findUnique({
      where: { id },
      include: { fotos: { orderBy: { ordem: 'asc' } } },
    });

    if (!moto) throw new NotFoundException('Moto não encontrada');
    return moto;
  }

  async create(dto: CreateMotoDto) {
    let slug = this.generateSlug(dto.nome);

    // Garantir slug único
    const existing = await this.prisma.moto.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const moto = await this.prisma.moto.create({
      data: {
        ...dto,
        slug,
        preco: dto.preco ? dto.preco : null,
        specs: dto.specs || {},
      },
      include: { fotos: true },
    });

    return moto;
  }

  async update(id: string, dto: UpdateMotoDto) {
    await this.findById(id);

    const moto = await this.prisma.moto.update({
      where: { id },
      data: {
        ...dto,
        preco: dto.preco !== undefined ? dto.preco : undefined,
      },
      include: { fotos: { orderBy: { ordem: 'asc' } } },
    });

    return moto;
  }

  async remove(id: string) {
    const moto = await this.findById(id);

    // Deletar fotos do R2
    for (const foto of moto.fotos) {
      await this.r2.deleteFile(foto.r2Key);
    }

    await this.prisma.moto.delete({ where: { id } });
    return { message: 'Moto deletada com sucesso' };
  }

  async uploadFoto(id: string, file: Express.Multer.File) {
    await this.findById(id);

    const r2Key = `motos/${id}/${Date.now()}-${file.originalname}`;
    const url = await this.r2.uploadFile(r2Key, file.buffer, file.mimetype);

    // Verificar se é a primeira foto (será a principal)
    const fotosCount = await this.prisma.motoFoto.count({ where: { motoId: id } });

    const foto = await this.prisma.motoFoto.create({
      data: {
        url,
        r2Key,
        principal: fotosCount === 0,
        ordem: fotosCount,
        motoId: id,
      },
    });

    return foto;
  }

  async deleteFoto(motoId: string, fotoId: string) {
    const foto = await this.prisma.motoFoto.findFirst({
      where: { id: fotoId, motoId },
    });

    if (!foto) throw new NotFoundException('Foto não encontrada');

    await this.r2.deleteFile(foto.r2Key);
    await this.prisma.motoFoto.delete({ where: { id: fotoId } });

    return { message: 'Foto removida com sucesso' };
  }

  async updateFoto(motoId: string, fotoId: string, data: { corHex?: string; corNome?: string; exibirNoSeletor?: boolean; exibirNaGaleria?: boolean }) {
    const foto = await this.prisma.motoFoto.findFirst({
      where: { id: fotoId, motoId },
    });

    if (!foto) throw new NotFoundException('Foto não encontrada');

    const updated = await this.prisma.motoFoto.update({
      where: { id: fotoId },
      data: {
        corHex: data.corHex,
        corNome: data.corNome,
        exibirNoSeletor: data.exibirNoSeletor,
        exibirNaGaleria: data.exibirNaGaleria,
      },
    });

    return updated;
  }

  async uploadCapa(id: string, file: Express.Multer.File) {
    const moto = await this.findById(id);

    // Se já havia uma capa, excluí-la primeiro do R2
    if (moto.capaR2Key) {
      await this.r2.deleteFile(moto.capaR2Key).catch(() => null);
    }

    const r2Key = `motos/${id}/capa-${Date.now()}-${file.originalname}`;
    const url = await this.r2.uploadFile(r2Key, file.buffer, file.mimetype);

    const updatedMoto = await this.prisma.moto.update({
      where: { id },
      data: {
        capaUrl: url,
        capaR2Key: r2Key,
      },
      include: { fotos: { orderBy: { ordem: 'asc' } } },
    });

    return updatedMoto;
  }

  async deleteCapa(id: string) {
    const moto = await this.findById(id);

    if (moto.capaR2Key) {
      await this.r2.deleteFile(moto.capaR2Key).catch(() => null);
    }

    const updatedMoto = await this.prisma.moto.update({
      where: { id },
      data: {
        capaUrl: null,
        capaR2Key: null,
      },
      include: { fotos: { orderBy: { ordem: 'asc' } } },
    });

    return updatedMoto;
  }

  async uploadLogo(id: string, file: Express.Multer.File) {
    const moto = await this.findById(id);

    // Se já havia uma logo, excluí-la primeiro do R2
    if (moto.logoR2Key) {
      await this.r2.deleteFile(moto.logoR2Key).catch(() => null);
    }

    const r2Key = `motos/${id}/logo-${Date.now()}-${file.originalname}`;
    const url = await this.r2.uploadFile(r2Key, file.buffer, file.mimetype);

    const updatedMoto = await this.prisma.moto.update({
      where: { id },
      data: {
        logoUrl: url,
        logoR2Key: r2Key,
      },
      include: { fotos: { orderBy: { ordem: 'asc' } } },
    });

    return updatedMoto;
  }

  async deleteLogo(id: string) {
    const moto = await this.findById(id);

    if (moto.logoR2Key) {
      await this.r2.deleteFile(moto.logoR2Key).catch(() => null);
    }

    const updatedMoto = await this.prisma.moto.update({
      where: { id },
      data: {
        logoUrl: null,
        logoR2Key: null,
      },
      include: { fotos: { orderBy: { ordem: 'asc' } } },
    });

    return updatedMoto;
  }

  async setFotoPrincipal(motoId: string, fotoId: string) {
    await this.findById(motoId);

    // Remover principal de todas as fotos
    await this.prisma.motoFoto.updateMany({
      where: { motoId },
      data: { principal: false },
    });

    // Definir nova principal
    await this.prisma.motoFoto.update({
      where: { id: fotoId },
      data: { principal: true },
    });

    return { message: 'Foto principal atualizada' };
  }
}
