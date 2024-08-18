import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Paper,
  Stack,
  Title,
  Text,
  Grid,
  Group,
  Button,
  Select,
  NumberInput,
  Textarea,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { IconCheck } from "@tabler/icons-react";
import dayjs from "dayjs";
import classes from "./TradesImportForm.module.css";
import { useExchangeRate } from "hooks/use-exchange-rates/use-exchange-rates";
import { useAddSharesTransaction } from "hooks/use-shares-transactions/use-shares-transactions";
import CompanyTickerSelectProvider from "pages/import/components/CompanyTickerSelect/CompanyTickerSelectProvider";
import { ICsvTradesRow } from "types/csv";
import { IPortfolio } from "types/portfolio";
import { ISharesTransactionFormFields } from "types/shares-transaction";

interface Props {
  portfolio: IPortfolio;
  trade: ICsvTradesRow;
  onSubmitCallback: () => void;
}

export default function TradesImportForm({
  portfolio,
  trade,
  onSubmitCallback,
}: Props) {
  const { t } = useTranslation();
  const dateFormat = "YYYY-MM-DD";
  const [formSent, setFormSent] = useState(false);

  const { mutate: createTradesTransaction, isPending } =
    useAddSharesTransaction({
      onSuccess: () => setFormSent(true),
    });

  const form = useForm<ISharesTransactionFormFields>({
    mode: "uncontrolled",
    initialValues: {
      transactionDate: new Date(trade.date),
      totalAmount: trade.totalWithCommission,
      totalAmountCurrency: trade.currency,
      totalCommission: trade.commission,
      totalCommissionCurrency: trade.currency,
      notes: trade.description,
      exchangeRate: 1,
      company: 0,
      count: trade.count,
      grossPricePerShare: trade.price,
      grossPricePerShareCurrency: trade.currency,
      type: trade.count < 0 ? "SELL" : "BUY",
    },
  });

  const onCompanyChange = useCallback(
    (value: string) => {
      form.setFieldValue("company", +value);
    },
    [form],
  );

  const handleSubmit = (values: ISharesTransactionFormFields) => {
    const { totalAmount, totalCommission, grossPricePerShare, notes } = values;

    console.log("Creating transaction with:");
    const newValues = {
      ...values,
      totalAmount: totalAmount,
      totalCommission: totalCommission,
      grossPricePerShare: grossPricePerShare,
      notes: `Imported from IB CSV on ${dayjs(new Date()).format(
        "YYYY-MM-DD HH:mm:ss.",
      )}. ${notes}`,
    };
    createTradesTransaction({
      newTransaction: newValues,
      updatePortfolio: false,
    });
    onSubmitCallback();
  };

  const options1 = [
    { label: t("Buy"), value: "BUY" },
    { label: t("Sell"), value: "SELL" },
  ];

  const { isLoading, refetch } = useExchangeRate(
    trade.currency,
    portfolio?.baseCurrency.code,
    dayjs(form.getValues().transactionDate).format(dateFormat),
  );

  const fetchExchangeRate = async () => {
    const { data: exchangeRateResult } = await refetch();
    if (exchangeRateResult) {
      form.setFieldValue("exchangeRate", exchangeRateResult.exchangeRate);
    } else {
      form.setFieldError(
        "exchangeRate",
        t("Unable to fetch the exchange rates for the given date"),
      );
    }
  };

  return (
    <Stack>
      <Paper p="lg" shadow="xs" mt={20}>
        <Stack>
          <Title order={4}>
            {trade.ticker} - {trade.currency}
          </Title>
          <Text>
            {trade.companyName} - ISIN: {trade.companyISIN} - {t("Market")}:{" "}
            {trade.market}
          </Text>

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Grid>
              <Grid.Col span={6}>
                <DateInput
                  withAsterisk
                  label={t("Date")}
                  key={form.key("transactionDate")}
                  description={`${t("Received")}: ${trade.date}`}
                  valueFormat={dateFormat}
                  defaultValue={new Date()}
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...form.getInputProps("transactionDate")}
                />
              </Grid.Col>

              <Grid.Col span={6}>
                <NumberInput
                  withAsterisk
                  label={t("Shares Count")}
                  key={form.key("count")}
                  description={`${t("Received")}: ${trade.count}`}
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...form.getInputProps("count")}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <Select
                  withAsterisk
                  label={t("Type")}
                  key={form.key("type")}
                  description={`${t("Received")}: ${
                    trade.count < 0 ? t("Sell") : t("Buy")
                  }`}
                  data={options1}
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...form.getInputProps("type")}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <NumberInput
                  withAsterisk
                  label={t("Total Amount")}
                  key={form.key("totalAmount")}
                  description={`${t("Received")}: ${trade.totalWithCommission}`}
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...form.getInputProps("totalAmount")}
                  suffix={` ${trade.currency}`}
                  decimalScale={2}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <NumberInput
                  withAsterisk
                  label={t("Gross price per share")}
                  key={form.key("grossPricePerShare")}
                  description={`${t("Received")}: ${trade.price}`}
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...form.getInputProps("grossPricePerShare")}
                  suffix={` ${trade.currency}`}
                  decimalScale={2}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <NumberInput
                  withAsterisk
                  label={t("Commission")}
                  key={form.key("totalCommission")}
                  description={`${t("Received")}: ${trade.commission}`}
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...form.getInputProps("totalCommission")}
                  suffix={` ${trade.currency}`}
                  decimalScale={2}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <CompanyTickerSelectProvider
                  onSelect={onCompanyChange}
                  ticker={trade.ticker}
                  portfolioId={portfolio.id}
                  setFieldValue={form.setFieldValue}
                  withAsterisk
                  description={`${t("Received")}: ${trade.ticker}`}
                />
              </Grid.Col>
              <Grid.Col span={6} />
              {trade.currency !== portfolio.baseCurrency.code && (
                <Grid.Col span={6}>
                  <Group align="flex-end">
                    <NumberInput
                      withAsterisk
                      label={t("Exchange Rate")}
                      key={form.key("exchangeRate")}
                      suffix={` ${trade.currency}${portfolio?.baseCurrency.code}`}
                      decimalScale={2}
                      description={`${trade.currency} ${t("to")} ${
                        portfolio.baseCurrency.code
                      }`}
                      // eslint-disable-next-line react/jsx-props-no-spreading
                      {...form.getInputProps("exchangeRate")}
                      classNames={classes}
                    />
                    <Button
                      disabled={
                        form.getValues().transactionDate === null ||
                        portfolio?.baseCurrency.code === null ||
                        trade.currency === null
                      }
                      onClick={fetchExchangeRate}
                      loading={isLoading}
                    >
                      {t("Get exchange rate")}
                    </Button>
                  </Group>
                </Grid.Col>
              )}
              <Grid.Col span={12}>
                <Textarea
                  mt="md"
                  label={t("Notes")}
                  key={form.key("notes")}
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...form.getInputProps("notes")}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <Group justify="space-between" mt="md">
                  <Button
                    type="submit"
                    color="blue"
                    disabled={formSent}
                    leftSection={formSent ? <IconCheck /> : null}
                    loading={isPending}
                  >
                    {t("Add trade")}
                  </Button>
                </Group>
              </Grid.Col>
            </Grid>
          </form>
        </Stack>
      </Paper>
    </Stack>
  );
}
