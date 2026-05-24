import { NextRequest, NextResponse } from 'next/server';

const MOBILE_REGEX = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
const MOBILE_REDIRECT = 'https://moto-e-cia-web.onrender.com/motos';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname !== '/') return NextResponse.next();

  const ua = request.headers.get('user-agent') ?? '';
  if (!MOBILE_REGEX.test(ua)) return NextResponse.next();

  // Navegação interna (ex: clicar no logo) não deve redirecionar
  const referer = request.headers.get('referer') ?? '';
  const host = request.headers.get('host') ?? '';
  if (referer && host && referer.includes(host)) return NextResponse.next();

  return NextResponse.redirect(MOBILE_REDIRECT, { status: 302 });
}

export const config = {
  matcher: '/',
};
