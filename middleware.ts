import { NextRequest, NextResponse } from 'next/server';

function isTucalculoHost(host: string | null): boolean {
  if (!host) return false;
  const normalized = host.toLowerCase();
  return normalized === 'tucalculo.com' || normalized === 'www.tucalculo.com';
}

function getCountry(request: NextRequest): string | undefined {
  const geoCountry = request.geo?.country?.toUpperCase();
  if (geoCountry) return geoCountry;

  const headerCountry =
    request.headers.get('x-vercel-ip-country') ?? request.headers.get('cf-ipcountry');

  return headerCountry?.toUpperCase();
}

export function middleware(request: NextRequest) {
  const host = request.headers.get('host');
  const { nextUrl } = request;

  if (!isTucalculoHost(host)) {
    return NextResponse.next();
  }

  if (nextUrl.pathname !== '/') {
    return NextResponse.next();
  }

  const country = getCountry(request);

  if (country === 'MX') {
    const mxUrl = nextUrl.clone();
    mxUrl.pathname = '/mx';
    return NextResponse.redirect(mxUrl);
  }

  if (country === 'CL') {
    return NextResponse.redirect('https://calculando.cl/');
  }

  const goUrl = nextUrl.clone();
  goUrl.pathname = '/go';
  return NextResponse.redirect(goUrl);
}

export const config = {
  matcher: ['/'],
};
