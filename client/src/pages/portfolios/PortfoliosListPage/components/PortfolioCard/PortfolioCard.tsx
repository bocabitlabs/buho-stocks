import React, { ReactElement } from "react";
import PortfolioCardContent from "../PortfolioCardContent/PortfolioCardContent";
import { IPortfolio } from "types/portfolio";

interface Props {
  portfolio: IPortfolio;
}

export default function PortfolioCard({ portfolio }: Props): ReactElement {
  return <PortfolioCardContent portfolio={portfolio} />;
}
