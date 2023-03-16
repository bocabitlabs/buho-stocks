import { useTranslation } from "react-i18next";
import { Tag } from "antd";

export type LabelType = "SELL" | "BUY";

interface Props {
  value: LabelType;
}

export function BuySellLabel({ value }: Props) {
  const { t } = useTranslation();

  let color = "green";
  if (value === "SELL") {
    color = "volcano";
  }
  return (
    <Tag color={color} key={value}>
      {t(value)}
    </Tag>
  );
}

export default BuySellLabel;
