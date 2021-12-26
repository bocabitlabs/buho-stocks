import React, { ReactElement } from "react";
import getUnicodeFlagIcon from "country-flag-icons/unicode";

interface Props {
  code: string;
}

export default function CountryFlag({ code }: Props): ReactElement | null {
  return <span>{getUnicodeFlagIcon(code)}</span>;
}
