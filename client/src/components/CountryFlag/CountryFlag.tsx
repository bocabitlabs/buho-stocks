import React, { ReactElement } from "react";
import countries from "utils/countries";
import FlagIcon from "utils/flag-icon";

interface Props {
  code: string;
}

export default function CountryFlag({ code }: Props): ReactElement | null {
  const country = countries[code];
  if (country) {
    return (
      <span title={`Flag for ${country.name}`}>
        <FlagIcon code={code} size="lg" />
      </span>
    );
  }
  return null;
}
