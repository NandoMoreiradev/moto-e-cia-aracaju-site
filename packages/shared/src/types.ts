// Tipos de Motos
export type MarcaMoto = 'SUZUKI' | 'HAOJUE' | 'ZONTES' | 'KYMCO' | 'OUTRO' | 'SEMINOVA';
export type TipoMoto = 'SPORT' | 'NAKED' | 'ADVENTURE' | 'SCOOTER' | 'TRAIL';
export type StatusMoto = 'DISPONIVEL' | 'VENDIDA' | 'RESERVADA' | 'ALUGUEL';
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
  specs: MotoSpecs;
  fotos: MotoFotoDto[];
  destaque: boolean;
  status: StatusMoto;
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
  motor?: string;
  potencia?: string;
  torque?: string;
  peso?: string;
  tanque?: string;
  freios?: string;
  pneuDianteiro?: string;
  pneuTraseiro?: string;
  [key: string]: string | string[] | undefined;
}

export interface CreateMotoDto {
  nome: string;
  marca: MarcaMoto;
  tipo: TipoMoto;
  preco?: number;
  precoFormatado?: string;
  descricao: string;
  capaUrl?: string;
  capaR2Key?: string;
  specs?: MotoSpecs;
  destaque?: boolean;
  status?: StatusMoto;
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
}

// Banners
export interface BannerDto {
  id: string;
  label: string | null;
  titulo: string;
  subtitulo: string | null;
  imageUrl: string;
  imageR2Key: string;
  link: string | null;
  ordem: number;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBannerDto {
  label?: string;
  titulo: string;
  subtitulo?: string;
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
