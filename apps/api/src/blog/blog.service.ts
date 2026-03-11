import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { R2Service } from '../r2/r2.service';
import slugify from 'slugify';

@Injectable()
export class BlogService {
  constructor(
    private prisma: PrismaService,
    private r2: R2Service,
  ) {}

  async findAll(page = 1, limit = 10, apenasPublicados = true) {
    const skip = (page - 1) * limit;
    const where = apenasPublicados ? { publicado: true } : {};

    const [posts, total] = await Promise.all([
      this.prisma.blogPost.findMany({
        where,
        select: {
          id: true, slug: true, titulo: true, resumo: true,
          coverUrl: true, tags: true, publicado: true,
          publicadoEm: true, createdAt: true, updatedAt: true,
        },
        orderBy: { publicadoEm: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.blogPost.count({ where }),
    ]);

    return { data: posts, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(slug: string) {
    const post = await this.prisma.blogPost.findUnique({ where: { slug } });
    if (!post || !post.publicado) throw new NotFoundException('Post não encontrado');
    return post;
  }

  async findOneAdmin(id: string) {
    const post = await this.prisma.blogPost.findUnique({ where: { id } });
    if (!post) throw new NotFoundException('Post não encontrado');
    return post;
  }

  async create(dto: { titulo: string; resumo: string; conteudo?: any; tags?: string[] }) {
    let slug = slugify(dto.titulo, { lower: true, strict: true, locale: 'pt' });
    const existing = await this.prisma.blogPost.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now()}`;

    return this.prisma.blogPost.create({
      data: { ...dto, slug, conteudo: dto.conteudo || {}, tags: dto.tags || [] },
    });
  }

  async update(id: string, dto: Partial<{ titulo: string; resumo: string; conteudo: any; tags: string[]; publicado: boolean }>) {
    await this.findOneAdmin(id);
    const data: any = { ...dto };
    if (dto.publicado === true) data.publicadoEm = new Date();
    if (dto.publicado === false) data.publicadoEm = null;
    return this.prisma.blogPost.update({ where: { id }, data });
  }

  async remove(id: string) {
    const post = await this.findOneAdmin(id);
    if (post.coverR2Key) await this.r2.deleteFile(post.coverR2Key);
    await this.prisma.blogPost.delete({ where: { id } });
    return { message: 'Post deletado com sucesso' };
  }

  async uploadCover(id: string, file: Express.Multer.File) {
    const post = await this.findOneAdmin(id);
    if (post.coverR2Key) await this.r2.deleteFile(post.coverR2Key);

    const r2Key = `blog/${id}/cover-${Date.now()}-${file.originalname}`;
    const url = await this.r2.uploadFile(r2Key, file.buffer, file.mimetype);

    return this.prisma.blogPost.update({
      where: { id },
      data: { coverUrl: url, coverR2Key: r2Key },
    });
  }
}
