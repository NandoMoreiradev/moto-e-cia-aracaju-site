import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

/**
 * MetaService — Integração com Meta Commerce API
 *
 * Para ativar, configurar as variáveis de ambiente:
 *   META_ACCESS_TOKEN, META_CATALOG_ID, META_BUSINESS_ID
 *
 * O catálogo do Facebook/Instagram é gerenciado via Meta Graph API.
 * Documentação: https://developers.facebook.com/docs/marketing-api/catalog
 */
@Injectable()
export class MetaService {
  private readonly logger = new Logger(MetaService.name);
  private readonly accessToken: string | undefined;
  private readonly catalogId: string | undefined;
  private readonly isConfigured: boolean;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    this.accessToken = this.configService.get<string>('META_ACCESS_TOKEN');
    this.catalogId = this.configService.get<string>('META_CATALOG_ID');
    this.isConfigured = !!(this.accessToken && this.catalogId);

    if (!this.isConfigured) {
      this.logger.warn(
        'Meta Commerce não configurado. Defina META_ACCESS_TOKEN e META_CATALOG_ID.',
      );
    }
  }

  /**
   * Sincroniza uma moto com o catálogo do Meta Commerce
   */
  async syncMoto(motoId: string): Promise<{ success: boolean; metaProductId?: string; message: string }> {
    if (!this.isConfigured) {
      return { success: false, message: 'Meta Commerce não configurado' };
    }

    const moto = await this.prisma.moto.findUnique({
      where: { id: motoId },
      include: { fotos: { where: { principal: true } } },
    });

    if (!moto) return { success: false, message: 'Moto não encontrada' };

    const fotoPrincipal = moto.fotos[0];
    const productData = {
      retailer_id: moto.slug,
      name: moto.nome,
      description: moto.descricao,
      availability: moto.status === 'DISPONIVEL' ? 'in stock' : 'out of stock',
      condition: 'new',
      price: moto.preco ? `${Number(moto.preco) * 100} BRL` : '0 BRL', // em centavos
      currency: 'BRL',
      image_url: fotoPrincipal?.url || '',
      url: `${this.configService.get('FRONTEND_URL') || 'https://motoeciaaracaju.com.br'}/motos/${moto.slug}`,
      brand: moto.marca,
      google_product_category: '3392', // Motorcycles
    };

    try {
      const url = moto.metaProductId
        ? `https://graph.facebook.com/v19.0/${moto.metaProductId}`
        : `https://graph.facebook.com/v19.0/${this.catalogId}/products`;

      const method = moto.metaProductId ? 'POST' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.accessToken}`,
        },
        body: JSON.stringify(productData),
      });

      const result = (await response.json()) as any;

      if (!response.ok) {
        this.logger.error(`Erro Meta API: ${JSON.stringify(result)}`);
        return { success: false, message: `Erro Meta API: ${result?.error?.message}` };
      }

      const metaProductId = result.id || moto.metaProductId;

      // Salvar o metaProductId na moto
      if (metaProductId && metaProductId !== moto.metaProductId) {
        await this.prisma.moto.update({
          where: { id: motoId },
          data: { metaProductId },
        });
      }

      return { success: true, metaProductId, message: 'Moto sincronizada com sucesso' };
    } catch (error) {
      this.logger.error('Erro ao sincronizar com Meta:', error);
      return { success: false, message: 'Erro de conexão com Meta API' };
    }
  }

  /**
   * Sincroniza todas as motos disponíveis com o Meta Catalog
   */
  async syncAll(): Promise<{ total: number; sincronizadas: number; erros: number }> {
    const motos = await this.prisma.moto.findMany({
      where: { status: { in: ['DISPONIVEL', 'RESERVADA'] } },
      select: { id: true },
    });

    let sincronizadas = 0;
    let erros = 0;

    for (const moto of motos) {
      const result = await this.syncMoto(moto.id);
      if (result.success) sincronizadas++;
      else erros++;
    }

    return { total: motos.length, sincronizadas, erros };
  }

  /**
   * Remove um produto do catálogo Meta
   */
  async deletarProduto(metaProductId: string): Promise<{ success: boolean }> {
    if (!this.isConfigured) return { success: false };

    try {
      const response = await fetch(
        `https://graph.facebook.com/v19.0/${metaProductId}?access_token=${this.accessToken}`,
        { method: 'DELETE' },
      );
      return { success: response.ok };
    } catch {
      return { success: false };
    }
  }

  getStatus() {
    return {
      configurado: this.isConfigured,
      catalogId: this.catalogId || null,
      mensagem: this.isConfigured
        ? 'Meta Commerce configurado e pronto'
        : 'Configure META_ACCESS_TOKEN e META_CATALOG_ID para ativar',
    };
  }
}
