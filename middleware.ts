import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function isTucalculoHost(host: string | null) {
  if (!host) return false;
  const h = host.toLowerCase();
  return h === "tucalculo.com" || h === "www.tucalculo.com";
}

function getCountry(req: NextRequest) {
  // Vercel geo
  const geo = (req as any).geo?.country;
  if (typeof geo === "string" && geo.length) return geo.toUpperCase();

  // Vercel header
  const vercel = req.headers.get("x-vercel-ip-country");
  if (vercel) return vercel.toUpperCase();

  // Cloudflare header
  const cf = req.headers.get("cf-ipcountry");
  if (cf) return cf.toUpperCase();

  return "";
}

export function middleware(req: NextRequest) {
  const host = req.headers.get("host");
  if (!isTucalculoHost(host)) return NextResponse.next();

  const { pathname } = req.nextUrl;

  // Solo en la home
  if (pathname !== "/") return NextResponse.next();

  const country = getCountry(req);

  if (country === "MX") {
    const url = req.nextUrl.clone();
    url.pathname = "/mx";
    return NextResponse.redirect(url);
  }

  if (country === "CL") {
    return NextResponse.redirect("https://calculando.cl/");
  }

  const url = req.nextUrl.clone();
  url.pathname = "/go";
  return NextResponse.redirect(url);
}

// matcher para que solo corra en /
export const config = {
  matcher: ["/"],
};
