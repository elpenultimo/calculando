export const COUNTRIES = {
  cl: {
    code: 'cl',
    slug: 'cl',
  },
  mx: {
    code: 'mx',
    slug: 'mx',
  },
};

export function getCountryFromPath(pathname = '/') {
  if (pathname.startsWith('/mx')) {
    return 'mx';
  }
  return 'cl';
}

export function isCountrySupported(code) {
  return Boolean(COUNTRIES[code]);
}
