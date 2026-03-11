import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLeadDto } from './dto/create-lead.dto';

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateLeadDto) {
    return this.prisma.lead.create({ data: dto });
  }

  findAll(page = 1, limit = 20, apenasNaoLidos = false) {
    const skip = (page - 1) * limit;
    const where = apenasNaoLidos ? { lido: false } : {};
    return this.prisma.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });
  }

  marcarComoLido(id: string) {
    return this.prisma.lead.update({ where: { id }, data: { lido: true } });
  }

  remove(id: string) {
    return this.prisma.lead.delete({ where: { id } });
  }
}
