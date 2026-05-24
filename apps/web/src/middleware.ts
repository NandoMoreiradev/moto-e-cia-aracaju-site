import { NextRequest, NextResponse } from 'next/server';

const MOBILE_REGEX = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
const MOBILE_REDIRECT = 'https://moto-e-cia-web.onrender.com/motos';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname !== '/') return NextResponse.next();

  const ua = request.headers.get('user-agent') ?? '';
  if (MOBILE_REGEX.test(ua)) {
    return NextResponse.redirect(MOBILE_REDIRECT, { status: 302 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/',
};
