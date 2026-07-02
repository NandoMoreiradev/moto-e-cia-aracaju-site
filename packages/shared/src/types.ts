// Tipos de Motos
export type MarcaMoto = 'SUZUKI' | 'HAOJUE' | 'ZONTES' | 'KYMCO' | 'OUTRO';
export type TipoMoto = 'SPORT' | 'NAKED' | 'ADVENTURE' | 'SCOOTER' | 'TRAIL' | 'STREET' | 'CROSSOVER' | 'CUSTOM' | 'TOURING';
export type StatusMoto = 'DISPONIVEL' | 'VENDIDA' | 'RESERVADA' | 'ALUGUEL';
export type CondicaoMoto = 'NOVA' | 'SEMINOVA';
export type Combustivel = 'GASOLINA' | 'ETANOL' | 'FLEX' | 'ELETRICO';
export type Transmissao = 'MANUAL' | 'AUTOMATICA' | 'SEMI_AUTOMATICA';

export interface MotoFotoDto {
  id: string;
  url: string;
  r2Key: string;
  principal: boolean;
  ordem: number;
  corHex: string | null;
  corNome: string | null;
  exibirNoSeletor: boolean;
  exibirNaGaleria: boolean;
}

export interface MotoDto {
  id: string;
  slug: string;
  nome: string;
  marca: MarcaMoto;
  tipo: TipoMoto;
  preco: number | null;
  precoFormatado: string | null;
  descricao: string;
  capaUrl: string | null;
  capaR2Key: string | null;
  logoUrl: string | null;
  logoR2Key: string | null;
  slogan: string | null;
  diferenciais: string | null;
  specs: MotoSpecs;
  fotos: MotoFotoDto[];
  destaque: boolean;
  status: StatusMoto;
  condicao: CondicaoMoto;
  metaProductId: string | null;
  // Campos Meta Vehicle Catalog (Graph API v25.0)
  ano: number | null;
  km: number | null;
  cor: string | null;
  vin: string | null;
  combustivel: Combustivel;
  transmissao: Transmissao;
  createdAt: string;
  updatedAt: string;
}

export interface MotoSpecs {
  // Motor
  motor?: string;           // Ex: "Monocilíndrico, 4 tempos, DOHC"
  cilindrada?: string;      // Ex: "776 cm³"
  refrigeracao?: string;    // Ex: "Refrigerada a líquido"
  alimentacao?: string;     // Ex: "Injeção eletrônica de combustível"
  relacaoCompressao?: string; // Ex: "12,5:1"

  // Desempenho
  potencia?: string;        // Ex: "83 cv"
  potenciaRpm?: string;     // Ex: "8.500 rpm"
  torque?: string;          // Ex: "78 Nm"
  torqueRpm?: string;       // Ex: "6.500 rpm"

  // Transmissão e trem de força
  partida?: string;         // Ex: "Elétrica"
  embreagem?: string;       // Ex: "Multidiscos em banho de óleo, antideslizante"
  cambio?: string;          // Ex: "6 velocidades"

  // Dimensões e pesos
  comprimento?: string;     // Ex: "2.055 mm"
  largura?: string;         // Ex: "810 mm"
  altura?: string;          // Ex: "1.150 mm"
  distanciaEntreEixos?: string; // Ex: "1.455 mm"
  alturaAssento?: string;   // Ex: "790 mm"
  peso?: string;            // Ex: "193 kg (peso seco)"

  // Fluidos
  tanque?: string;          // Ex: "20 L"
  capacidadeOleo?: string;  // Ex: "3,5 L"

  // Suspensão
  suspensaoD?: string;      // Ex: "Telescópica invertida Ø 41 mm, curso 120 mm"
  suspensaoT?: string;      // Ex: "Monoamortecedor, curso 130 mm"

  // Freios
  freioD?: string;          // Ex: "Disco duplo Ø 310 mm, pinça radial 4 pistões com ABS"
  freioT?: string;          // Ex: "Disco Ø 240 mm, pinça 1 pistão com ABS"

  // Pneus
  pneuDianteiro?: string;   // Ex: "120/70-ZR17"
  pneuTraseiro?: string;    // Ex: "180/55-ZR17"

  // Campo legado / genérico
  freios?: string;
  [key: string]: string | string[] | undefined;
}

export interface CreateMotoDto {
  nome: string;
  marca: MarcaMoto;
  tipo: TipoMoto;
  preco?: number;
  precoFormatado?: string;
  descricao: string;
  diferenciais?: string;
  capaUrl?: string;
  capaR2Key?: string;
  specs?: MotoSpecs;
  destaque?: boolean;
  status?: StatusMoto;
  condicao?: CondicaoMoto;
  // Campos Meta Vehicle Catalog
  ano?: number;
  km?: number;
  cor?: string;
  vin?: string;
  combustivel?: Combustivel;
  transmissao?: Transmissao;
}

export interface UpdateMotoDto extends Partial<CreateMotoDto> {}

// Tipos de Blog
export interface BlogPostDto {
  id: string;
  slug: string;
  titulo: string;
  resumo: string;
  conteudo: Record<string, unknown>; // TipTap JSON
  coverUrl: string | null;
  coverR2Key: string | null;
  tags: string[];
  publicado: boolean;
  publicadoEm: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogPostDto {
  titulo: string;
  resumo: string;
  conteudo?: Record<string, unknown>;
  tags?: string[];
}

export interface UpdateBlogPostDto extends Partial<CreateBlogPostDto> {
  publicado?: boolean;
}

// Tipos de Lead
export interface LeadDto {
  id: string;
  nome: string;
  email: string;
  whatsapp: string | null;
  mensagem: string;
  motoInteresse: string | null;
  lido: boolean;
  createdAt: string;
}

export interface CreateLeadDto {
  nome: string;
  email: string;
  whatsapp?: string;
  mensagem: string;
  motoInteresse?: string;
}

// Tipos de Auth
export type UserRole = 'ADMIN' | 'EDITOR';

export interface UserDto {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponseDto {
  user: UserDto;
  accessToken: string;
}

// Paginação
export interface PaginationDto {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Filtros de Moto
export interface MotoFiltersDto extends PaginationDto {
  marca?: MarcaMoto;
  tipo?: TipoMoto;
  status?: StatusMoto;
  destaque?: boolean;
  search?: string;
  precoMin?: number;
  precoMax?: number;
  condicao?: CondicaoMoto;
}

// Banners
export interface BannerDto {
  id: string;
  label: string | null;
  titulo: string | null;
  subtitulo: string | null;
  imageUrl: string;
  imageR2Key: string;
  mobileImageUrl: string | null;
  mobileImageR2Key: string | null;
  link: string | null;
  ordem: number;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBannerDto {
  label?: string;
  titulo?: string;
  subtitulo?: string;
  mobileImageUrl?: string;
  mobileImageR2Key?: string;
  link?: string;
  ordem?: number;
  ativo?: boolean;
}

// Marcas Oficiais
export interface MarcaDto {
  id: string;
  nome: string;
  logoUrl: string;
  logoR2Key: string;
  ordem: number;
  ativa: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMarcaDto {
  nome: string;
  ordem?: number;
  ativa?: boolean;
}
