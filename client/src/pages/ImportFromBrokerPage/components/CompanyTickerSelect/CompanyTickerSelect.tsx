import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Select } from "antd";
import { useCompanies } from "hooks/use-companies/use-companies";

interface Props {
  portfolioId: number | undefined;
  ticker: string;
  onSelect: Function;
  initialValue?: number;
}

export default function CompanyTickerSelect({
  initialValue,
  ticker,
  portfolioId,
  onSelect,
}: Props) {
  const { t } = useTranslation();
  const { data: companies, isFetching: fetchingCompanies } =
    useCompanies(portfolioId);

  const handleChange = (value: any) => {
    const company = companies?.find((element) => element.id === value);
    onSelect(company);
  };

  useEffect(() => {
    const company = companies?.find((element) => {
      const altTickers = element.altTickers
        .split(",")
        .map((string) => string.trim());

      return (
        element.ticker === ticker ||
        ticker.includes(element.ticker) ||
        altTickers.includes(ticker)
      );
    });
    if (company) {
      onSelect(company);
    }
  }, [companies, ticker, onSelect]);

  return (
    <Select
      placeholder={t("Company")}
      loading={fetchingCompanies}
      onChange={handleChange}
      value={initialValue}
      defaultValue={initialValue}
      data-testid="company-selector"
    >
      {companies &&
        companies.map((element) => (
          <Select.Option key={element.id} value={element.id}>
            {element.name} ({element.ticker})
          </Select.Option>
        ))}
    </Select>
  );
}

CompanyTickerSelect.defaultProps = {
  initialValue: undefined,
};
