import React from "react";
import { useTranslation } from "react-i18next";
import { Tag } from "antd";

interface Props {
  value: string;
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
