export const COUNTRIES: Record<string, { name: string; iso2: string }> = {
  ar: { name: "Argentina", iso2: "AR" },
  bo: { name: "Bolivia", iso2: "BO" },
  br: { name: "Brasil", iso2: "BR" },
  cl: { name: "Chile", iso2: "CL" },
  co: { name: "Colombia", iso2: "CO" },
  ec: { name: "Ecuador", iso2: "EC" },
  py: { name: "Paraguay", iso2: "PY" },
  pe: { name: "Perú", iso2: "PE" },
  uy: { name: "Uruguay", iso2: "UY" },
  ve: { name: "Venezuela", iso2: "VE" },
  cr: { name: "Costa Rica", iso2: "CR" },
  sv: { name: "El Salvador", iso2: "SV" },
  gt: { name: "Guatemala", iso2: "GT" },
  hn: { name: "Honduras", iso2: "HN" },
  ni: { name: "Nicaragua", iso2: "NI" },
  pa: { name: "Panamá", iso2: "PA" },
  cu: { name: "Cuba", iso2: "CU" },
  do: { name: "República Dominicana", iso2: "DO" },
  pr: { name: "Puerto Rico", iso2: "PR" },
  us: { name: "Estados Unidos", iso2: "US" },
  mx: { name: "México", iso2: "MX" },
  es: { name: "España", iso2: "ES" },
  gq: { name: "Guinea Ecuatorial", iso2: "GQ" },
};

export function getCountryBySlug(slug: string) {
  return COUNTRIES[slug?.toLowerCase()] ?? null;
}
