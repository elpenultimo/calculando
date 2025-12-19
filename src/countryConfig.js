import { clConfig } from './countries/cl/config.js';
import { mxConfig } from './countries/mx/config.js';

export const COUNTRY_CONFIGS = {
  cl: clConfig,
  mx: mxConfig,
};

export function getConfigByCountry(countryCode) {
  return COUNTRY_CONFIGS[countryCode];
}
