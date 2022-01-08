import React, { ReactElement } from "react";
import getUnicodeFlagIcon from "country-flag-icons/unicode";

interface Props {
  code: string;
}

export default function CountryFlag({ code }: Props): ReactElement | null {
  return <span style={{ fontSize: 20 }}>{getUnicodeFlagIcon(code)}</span>;
}
