import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@mantine/core";
import { useExchangeRate } from "hooks/use-exchange-rates/use-exchange-rates";

interface Props {
  fromCurrency: string;
  toCurrency: string | undefined;
  date: string;
  onChange: Function;
  onError: Function;
}

export default function ExchangeRateFetchButton({
  fromCurrency,
  toCurrency,
  date,
  onChange,
  onError,
}: Readonly<Props>) {
  const { t } = useTranslation();
  const [currentDate, setCurrentDate] = React.useState<string>(date);
  const {
    isRefetching: exchangeRateRefetching,
    isFetching: exchangeRateFetching,
    refetch: getExchangeRate,
    data: exchangeRateData,
    error: errorFetchingExchangeRate,
    isRefetchError: errorRefetchingExchangeRate,
  } = useExchangeRate(fromCurrency, toCurrency, currentDate);

  const fetchExchangeRate = async () => {
    getExchangeRate();
  };

  useEffect(() => {
    setCurrentDate(date);
  }, [date]);

  useEffect(() => {
    if (exchangeRateData) {
      onChange(exchangeRateData.exchangeRate);
    }
  }, [exchangeRateData, t, onChange]);

  useEffect(() => {
    if (errorFetchingExchangeRate || errorRefetchingExchangeRate) {
      console.log(t("Unable to fetch the exchange rates for the given date"));
      onError();
    }
  }, [errorFetchingExchangeRate, errorRefetchingExchangeRate, onError, t]);

  return (
    <Button
      disabled={date === null}
      onClick={fetchExchangeRate}
      loading={exchangeRateFetching || exchangeRateRefetching}
      title={`${fromCurrency} to ${toCurrency}`}
    >
      {t("Get exchange rate")}
    </Button>
  );
}
