import React from "react";
import { Tag } from "antd";

interface Props {
  value: string;
}

export const BuySellLabel = ({ value }: Props) => {
  let color = "green";
  if (value === "SELL") {
    color = "volcano";
  }
  return (
    <Tag color={color} key={value}>
      {value}
    </Tag>
  );
};

export default BuySellLabel;
