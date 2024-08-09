import { useEffect, useState } from "react";
import { Loader } from "@mantine/core";
import CompanyTickerSelect from "./CompanyTickerSelect";
import { useCompaniesAll } from "hooks/use-companies/use-companies";
import { ICompany } from "types/company";

interface Props {
  portfolioId: number | undefined;
  ticker: string;
  // eslint-disable-next-line no-unused-vars
  onSelect: (company: any) => void;
  withAsterisk?: boolean;
  form: any;
  description?: string;
}

export default function CompanyTickerSelectProvider({
  portfolioId,
  ticker,
  onSelect,
  withAsterisk = false,
  form,
  description = undefined,
}: Props) {
  const { data: companies, isFetching: fetchingCompanies } =
    useCompaniesAll(portfolioId);
  const [initialValue, setInitialValue] = useState<ICompany | undefined | null>(
    null,
  );

  useEffect(() => {
    function loadInitialValue() {
      if (companies) {
        const company = companies.find((element) => {
          const altTickers = element.altTickers
            .split(",")
            .map((string) => string.trim());
          return element.ticker === ticker || altTickers.includes(ticker);
        });
        if (company) {
          setInitialValue(company);
          form.setFieldValue("company", company.id);
        } else {
          setInitialValue(undefined);
        }
      }
    }
    loadInitialValue();
    // We don't want form to be here
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companies, ticker]);

  if (fetchingCompanies) {
    return <Loader />;
  }
  if (companies && initialValue !== null) {
    return (
      <CompanyTickerSelect
        companies={companies}
        initialValue={initialValue}
        onSelect={onSelect}
        withAsterisk={withAsterisk}
        description={description}
      />
    );
  }
}
