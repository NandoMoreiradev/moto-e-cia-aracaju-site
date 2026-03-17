import type { 
  MotoDto, PaginatedResponse, MotoFiltersDto, LoginDto, AuthResponseDto,
  BannerDto, CreateBannerDto, MarcaDto, CreateMarcaDto
} from '@moto-e-cia/shared';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// ─── Token helpers (client-side only) ─────────────────────────────────────────
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('moto_cia_token');
}
export function setToken(token: string) {
  localStorage.setItem('moto_cia_token', token);
}
export function clearToken() {
  localStorage.removeItem('moto_cia_token');
}

// ─── Fetch helpers ─────────────────────────────────────────────────────────────
async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_URL}/api${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Erro desconhecido' }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json();
}

async function apiFetchFormData<T>(path: string, body: FormData): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_URL}/api${path}`, {
    method: 'POST',
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Erro desconhecido' }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json();
}

// ─── Auth ──────────────────────────────────────────────────────────────────────
export const auth = {
  login: (dto: LoginDto) =>
    apiFetch<AuthResponseDto>('/auth/login', { method: 'POST', body: JSON.stringify(dto) }),
  me: () => apiFetch<AuthResponseDto['user']>('/auth/me'),
};

// ─── Motos (público) ───────────────────────────────────────────────────────────
export const motos = {
  list: (filters: MotoFiltersDto = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
    });
    return apiFetch<PaginatedResponse<MotoDto>>(`/motos?${params}`);
  },
  get: (slug: string) => apiFetch<MotoDto>(`/motos/${slug}`),
  getById: (id: string) => apiFetch<MotoDto>(`/motos/id/${id}`),
};

// ─── Banners (público) ────────────────────────────────────────────────────────
export const banners = {
  list: () => apiFetch<BannerDto[]>('/banners'),
};

// ─── Marcas (público) ─────────────────────────────────────────────────────────
export const marcas = {
  list: () => apiFetch<MarcaDto[]>('/marcas'),
};

// ─── Admin — Motos ─────────────────────────────────────────────────────────────
export const adminMotos = {
  list: (filters: MotoFiltersDto = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
    });
    return apiFetch<PaginatedResponse<MotoDto>>(`/motos?${params}`);
  },

  create: (data: Partial<MotoDto>) =>
    apiFetch<MotoDto>('/admin/motos', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: string, data: Partial<MotoDto>) =>
    apiFetch<MotoDto>(`/admin/motos/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  delete: (id: string) =>
    apiFetch<{ message: string }>(`/admin/motos/${id}`, { method: 'DELETE' }),

  // Fotos & Capa
  uploadCapa: (motoId: string, file: File) => {
    const formData = new FormData();
    formData.append('capa', file);
    return apiFetchFormData<MotoDto>(`/admin/motos/${motoId}/capa`, formData);
  },

  deleteCapa: (motoId: string) =>
    apiFetch<MotoDto>(`/admin/motos/${motoId}/capa`, { method: 'DELETE' }),

  uploadLogo: (motoId: string, file: File) => {
    const formData = new FormData();
    formData.append('logo', file);
    return apiFetchFormData<MotoDto>(`/admin/motos/${motoId}/logo`, formData);
  },

  deleteLogo: (motoId: string) =>
    apiFetch<MotoDto>(`/admin/motos/${motoId}/logo`, { method: 'DELETE' }),

  uploadFoto: (motoId: string, file: File) => {
    const formData = new FormData();
    formData.append('foto', file);
    return apiFetchFormData<{ id: string; url: string; principal: boolean; corHex: string | null }>(
      `/admin/motos/${motoId}/fotos`,
      formData,
    );
  },

  updateFoto: (motoId: string, fotoId: string, data: { corHex?: string; corNome?: string }) =>
    apiFetch<{ id: string }>(`/admin/motos/${motoId}/fotos/${fotoId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteFoto: (motoId: string, fotoId: string) =>
    apiFetch<{ message: string }>(`/admin/motos/${motoId}/fotos/${fotoId}`, { method: 'DELETE' }),

  setFotoPrincipal: (motoId: string, fotoId: string) =>
    apiFetch<{ message: string }>(`/admin/motos/${motoId}/fotos/${fotoId}/principal`, {
      method: 'PUT',
    }),
};

// ─── Admin — Meta Commerce ──────────────────────────────────────────────────────
export const adminMeta = {
  status: () => apiFetch<any>('/admin/meta/status'),
  syncAll: () => apiFetch<any>('/admin/meta/sync', { method: 'POST' }),
  syncMoto: (motoId: string) =>
    apiFetch<any>(`/admin/meta/sync/${motoId}`, { method: 'POST' }),
};

// ─── Admin — Leads ──────────────────────────────────────────────────────────────
export const adminLeads = {
  list: (params = {}) => {
    const qs = new URLSearchParams(params as any).toString();
    return apiFetch<PaginatedResponse<any>>(`/admin/leads?${qs}`);
  },
  markRead: (id: string) =>
    apiFetch<any>(`/admin/leads/${id}/lido`, { method: 'PUT' }),
};

// ─── Admin — Banners ──────────────────────────────────────────────────────────
export const adminBanners = {
  list: () => apiFetch<BannerDto[]>('/admin/banners'),
  create: (dto: CreateBannerDto) => 
    apiFetch<BannerDto>('/admin/banners', { method: 'POST', body: JSON.stringify(dto) }),
  update: (id: string, dto: Partial<CreateBannerDto>) =>
    apiFetch<BannerDto>(`/admin/banners/${id}`, { method: 'PATCH', body: JSON.stringify(dto) }),
  delete: (id: string) =>
    apiFetch<{ message: string }>(`/admin/banners/${id}`, { method: 'DELETE' }),
  uploadImage: (id: string, file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return apiFetchFormData<BannerDto>(`/admin/banners/${id}/image`, formData);
  },
};

// ─── Admin — Marcas ───────────────────────────────────────────────────────────
export const adminMarcas = {
  list: () => apiFetch<MarcaDto[]>('/admin/marcas'),
  create: (dto: CreateMarcaDto) =>
    apiFetch<MarcaDto>('/admin/marcas', { method: 'POST', body: JSON.stringify(dto) }),
  update: (id: string, dto: Partial<CreateMarcaDto>) =>
    apiFetch<MarcaDto>(`/admin/marcas/${id}`, { method: 'PATCH', body: JSON.stringify(dto) }),
  delete: (id: string) =>
    apiFetch<{ message: string }>(`/admin/marcas/${id}`, { method: 'DELETE' }),
  uploadLogo: (id: string, file: File) => {
    const formData = new FormData();
    formData.append('logo', file);
    return apiFetchFormData<MarcaDto>(`/admin/marcas/${id}/logo`, formData);
  },
};

// ─── Admin — Generic R2 ────────────────────────────────────────────────────────
export const adminR2 = {
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return apiFetchFormData<{ url: string }>('/admin/r2/upload/image', formData);
  },
};

