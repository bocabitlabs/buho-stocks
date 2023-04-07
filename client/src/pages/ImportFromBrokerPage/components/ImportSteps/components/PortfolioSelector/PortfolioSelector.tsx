import { useTranslation } from "react-i18next";
import { Select } from "antd";
import { usePortfolios } from "hooks/use-portfolios/use-portfolios";
import { IPortfolio } from "types/portfolio";

interface Props {
  onSelect: Function;
}

export default function PortfolioSelector({ onSelect }: Props) {
  const { t } = useTranslation();

  const {
    isFetching: loadingPortfolios,
    data: portfolios,
    // error: errorFetchingPortfolios,
  } = usePortfolios();

  const onPortfolioSelect = (value: any) => {
    onSelect(value);
  };

  return (
    <Select
      onSelect={onPortfolioSelect}
      showSearch
      placeholder={t("Select a portfolio")}
      loading={loadingPortfolios}
    >
      {portfolios &&
        portfolios.map((item: IPortfolio) => (
          <Select.Option
            value={item.id}
            key={`portfolio-${item.id}-${item.id}`}
          >
            {item.name}
          </Select.Option>
        ))}
    </Select>
  );
}
