import { hasFlag } from "country-flag-icons";
import Flags from "country-flag-icons/react/3x2";

interface Props {
  code: string;
  width?: number;
}

export default function CountryFlag({
  code,
  width = undefined,
}: Readonly<Props>) {
  let countryCode = code;
  if (code === "EUR") {
    countryCode = "EU";
  }
  if (!countryCode || !hasFlag(countryCode.toUpperCase())) return null;
  const FlagComponent = Flags[countryCode.toUpperCase() as keyof typeof Flags];
  return (
    <FlagComponent
      data-testid="country-flag"
      style={{ maxHeight: 20, width }}
    />
  );
}
