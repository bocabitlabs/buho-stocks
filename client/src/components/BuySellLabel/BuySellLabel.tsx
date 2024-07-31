import { useTranslation } from "react-i18next";
import { Badge } from "@mantine/core";

export type LabelType = "SELL" | "BUY";

interface Props {
  value: LabelType;
}

export function BuySellLabel({ value }: Props) {
  const { t } = useTranslation();

  let color = "green";
  if (value === "SELL") {
    color = "red";
  }
  return (
    <Badge color={color} key={value}>
      {t(value)}
    </Badge>
  );
}

export default BuySellLabel;
