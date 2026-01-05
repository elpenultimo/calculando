import { COUNTRIES, getCountryBySlug } from "../lib/countries";
import { iso2ToFlagEmoji } from "../lib/flagEmoji";

type CountryTitleProps = {
  countrySlug: string;
  fallbackText?: string;
};

export function CountryTitle({ countrySlug, fallbackText = "Tu Cálculo" }: CountryTitleProps) {
  const country = getCountryBySlug(countrySlug);
  const flag = country ? iso2ToFlagEmoji(country.iso2) : "";
  const text = country ? `Tu Cálculo ${country.name}` : fallbackText;

  return (
    <span className="inline-flex items-center gap-2">
      {flag ? <span aria-hidden="true">{flag}</span> : null}
      <span>{text}</span>
    </span>
  );
}

export { COUNTRIES };
