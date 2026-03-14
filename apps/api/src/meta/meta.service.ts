import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

/**
 * MetaService — Integração com Meta Commerce API (Graph API v25.0)
 *
 * Suporta dois catálogos:
 *   1. Vehicle Catalog  → anúncios dinâmicos de retargeting (META_CATALOG_ID)
 *   2. Product Catalog  → Instagram Shopping / botão "Loja" (META_PRODUCT_CATALOG_ID)
 *
 * Documentação Vehicle: https://developers.facebook.com/docs/marketing-api/catalog/reference/vehicle
 * Documentação Product:  https://developers.facebook.com/docs/marketing-api/catalog
 */
@Injectable()
export class MetaService {
  private readonly logger = new Logger(MetaService.name);

  private readonly accessToken: string | undefined;
  private readonly catalogId: string | undefined;        // Catálogo de Veículos
  private readonly productCatalogId: string | undefined; // Catálogo de Produtos (Instagram Shopping)
  private readonly frontendUrl: string;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    this.accessToken = this.configService.get<string>('META_ACCESS_TOKEN');
    this.catalogId = this.configService.get<string>('META_CATALOG_ID');
    this.productCatalogId = this.configService.get<string>('META_PRODUCT_CATALOG_ID');
    this.frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'https://motoeciaaracaju.com.br';

    if (!this.accessToken) {
      this.logger.warn('META_ACCESS_TOKEN não definido. Integração Meta desativada.');
    }
    if (!this.catalogId) {
      this.logger.warn('META_CATALOG_ID não definido. Catálogo de Veículos desativado.');
    }
    if (!this.productCatalogId) {
      this.logger.warn('META_PRODUCT_CATALOG_ID não definido. Instagram Shopping desativado.');
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // CATÁLOGO DE VEÍCULOS (anúncios dinâmicos / retargeting)
  // ─────────────────────────────────────────────────────────────────────────────

  private buildVehiclePayload(moto: any) {
    const fotoPrincipal = moto.fotos?.find((f: any) => f.principal) ?? moto.fotos?.[0];
    const priceStr = moto.preco ? `${Math.round(Number(moto.preco) * 100)} BRL` : '0 BRL';
    const stateOfVehicle =
      moto.marca === 'SEMINOVA' || (moto.km !== null && moto.km > 0) ? 'USED' : 'NEW';

    const transmissaoMap: Record<string, string> = {
      MANUAL: 'MANUAL',
      AUTOMATICA: 'AUTOMATIC',
      SEMI_AUTOMATICA: 'SEMI_AUTOMATIC',
    };
    const combustivelMap: Record<string, string> = {
      GASOLINA: 'gasoline',
      ETANOL: 'ethanol',
      FLEX: 'flex',
      ELETRICO: 'electric',
    };

    return {
      vehicle_id: moto.slug,
      title: moto.nome,
      description: (moto.descricao || moto.nome).substring(0, 5000),
      url: `${this.frontendUrl}/motos/${moto.slug}`,
      // Campos obrigatórios pelo Meta Vehicle Catalog API v25.0
      make: moto.marca === 'SEMINOVA' ? 'Outra' : this.capitalize(moto.marca),
      model: moto.nome,
      year: moto.ano ?? new Date().getFullYear(),
      mileage: { unit: 'KILOMETERS', value: moto.km ?? 0 },
      price: priceStr,
      currency: 'BRL',
      state_of_vehicle: stateOfVehicle,
      vehicle_type: 'MOTORCYCLE',
      vin: moto.vin || undefined,
      // Campos opcionais mas recomendados
      exterior_color: moto.cor || undefined,
      transmission: transmissaoMap[moto.transmissao] || 'MANUAL',
      fuel_type: combustivelMap[moto.combustivel] || 'gasoline',
      image_0_url: fotoPrincipal?.url || undefined,
      availability: moto.status === 'DISPONIVEL' ? 'AVAILABLE' : 'NOT_AVAILABLE',
    };
  }

  async syncMoto(motoId: string): Promise<{ success: boolean; metaProductId?: string; message: string }> {
    if (!this.accessToken || !this.catalogId) {
      return { success: false, message: 'Catálogo de Veículos não configurado' };
    }

    const moto = await this.prisma.moto.findUnique({
      where: { id: motoId },
      include: { fotos: { orderBy: { principal: 'desc' } } },
    });
    if (!moto) return { success: false, message: 'Moto não encontrada' };

    const payload = this.buildVehiclePayload(moto);

    try {
      const url = moto.metaProductId
        ? `https://graph.facebook.com/v25.0/${moto.metaProductId}`
        : `https://graph.facebook.com/v25.0/${this.catalogId}/vehicles`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as any;
      if (!response.ok) {
        this.logger.error(`Erro Meta Vehicle API: ${JSON.stringify(result)}`);
        return { success: false, message: `Erro Meta API: ${result?.error?.message}` };
      }

      const metaProductId = result.id || moto.metaProductId;
      if (metaProductId && metaProductId !== moto.metaProductId) {
        await this.prisma.moto.update({ where: { id: motoId }, data: { metaProductId } });
      }

      return { success: true, metaProductId, message: 'Sincronizado com Catálogo de Veículos' };
    } catch (error) {
      this.logger.error('Erro ao sincronizar com Meta Vehicle Catalog:', error);
      return { success: false, message: 'Erro de conexão com Meta API' };
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // CATÁLOGO DE PRODUTOS PADRÃO (Instagram Shopping / botão "Loja")
  // ─────────────────────────────────────────────────────────────────────────────

  private buildProductPayload(moto: any) {
    const fotoPrincipal = moto.fotos?.find((f: any) => f.principal) ?? moto.fotos?.[0];
    // Meta exige price em centavos como inteiro para produtos
    const priceInCents = moto.preco ? Math.round(Number(moto.preco) * 100) : 0;
    const isAvailable = moto.status === 'DISPONIVEL';

    return {
      retailer_id: moto.slug,
      name: moto.nome,
      description: (moto.descricao || moto.nome).substring(0, 5000),
      availability: isAvailable ? 'in stock' : 'out of stock',
      condition: moto.marca === 'SEMINOVA' || (moto.km && moto.km > 0) ? 'used' : 'new',
      price: priceInCents,
      currency: 'BRL',
      image_url: fotoPrincipal?.url || '',
      url: `${this.frontendUrl}/motos/${moto.slug}`,
      brand: moto.marca === 'SEMINOVA' ? 'Seminova' : this.capitalize(moto.marca),
      // Categoria Google para motos (usada pelo Meta)
      google_product_category: '3392',
      // Campos extras para enriquecer o anúncio
      additional_image_urls: moto.fotos
        ?.filter((f: any) => !f.principal)
        .map((f: any) => f.url)
        .slice(0, 9) || [],
    };
  }

  async syncMotoAsProduct(motoId: string): Promise<{
    success: boolean;
    metaShopProductId?: string;
    message: string;
  }> {
    if (!this.accessToken || !this.productCatalogId) {
      return { success: false, message: 'Catálogo de Produtos (Instagram Shopping) não configurado' };
    }

    const moto = await this.prisma.moto.findUnique({
      where: { id: motoId },
      include: { fotos: { orderBy: { principal: 'desc' } } },
    });
    if (!moto) return { success: false, message: 'Moto não encontrada' };

    const payload = this.buildProductPayload(moto);

    try {
      // Sempre usa POST — o Meta usa o retailer_id para identificar se é criar ou atualizar
      const url = `https://graph.facebook.com/v25.0/${this.productCatalogId}/products`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as any;
      if (!response.ok) {
        this.logger.error(`Erro Meta Product API: ${JSON.stringify(result)}`);
        return { success: false, message: `Erro Meta API: ${result?.error?.message}` };
      }

      return {
        success: true,
        metaShopProductId: result.id,
        message: 'Sincronizado com Catálogo de Produtos (Instagram Shopping)',
      };
    } catch (error) {
      this.logger.error('Erro ao sincronizar com Meta Product Catalog:', error);
      return { success: false, message: 'Erro de conexão com Meta API' };
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // SYNC ALL — sincroniza nos DOIS catálogos
  // ─────────────────────────────────────────────────────────────────────────────

  async syncAll(): Promise<{
    total: number;
    veiculosSincronizados: number;
    produtosSincronizados: number;
    erros: number;
  }> {
    const motos = await this.prisma.moto.findMany({
      where: { status: { in: ['DISPONIVEL', 'RESERVADA'] } },
      select: { id: true },
    });

    let veiculosSincronizados = 0;
    let produtosSincronizados = 0;
    let erros = 0;

    for (const moto of motos) {
      const [vehicleResult, productResult] = await Promise.all([
        this.syncMoto(moto.id),
        this.syncMotoAsProduct(moto.id),
      ]);
      if (vehicleResult.success) veiculosSincronizados++;
      if (productResult.success) produtosSincronizados++;
      if (!vehicleResult.success && !productResult.success) erros++;
    }

    return { total: motos.length, veiculosSincronizados, produtosSincronizados, erros };
  }

  async syncAllBoth(motoId: string) {
    const [vehicle, product] = await Promise.all([
      this.syncMoto(motoId),
      this.syncMotoAsProduct(motoId),
    ]);
    return { vehicle, product };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // REMOÇÃO
  // ─────────────────────────────────────────────────────────────────────────────

  async deletarProduto(metaProductId: string): Promise<{ success: boolean }> {
    if (!this.accessToken) return { success: false };
    try {
      const response = await fetch(
        `https://graph.facebook.com/v25.0/${metaProductId}?access_token=${this.accessToken}`,
        { method: 'DELETE' },
      );
      return { success: response.ok };
    } catch {
      return { success: false };
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // STATUS
  // ─────────────────────────────────────────────────────────────────────────────

  getStatus() {
    return {
      vehicleCatalog: {
        configurado: !!(this.accessToken && this.catalogId),
        catalogId: this.catalogId || null,
        descricao: 'Anúncios dinâmicos / retargeting no Facebook e Instagram',
      },
      productCatalog: {
        configurado: !!(this.accessToken && this.productCatalogId),
        catalogId: this.productCatalogId || null,
        descricao: 'Instagram Shopping — botão "Loja" no perfil e marcação em posts',
      },
      mensagem:
        !this.accessToken
          ? 'Configure META_ACCESS_TOKEN para ativar'
          : 'Token configurado. Verifique os catálogos acima.',
    };
  }

  private capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
}
