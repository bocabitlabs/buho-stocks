import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Paper,
  Stack,
  Title,
  Text,
  Grid,
  TextInput,
  Button,
  Group,
  NumberInput,
  Textarea,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { IconCheck } from "@tabler/icons-react";
import dayjs from "dayjs";
import classes from "./DividendsImportForm.module.css";
import { useAddDividendsTransaction } from "hooks/use-dividends-transactions/use-dividends-transactions";
import { useExchangeRate } from "hooks/use-exchange-rates/use-exchange-rates";
import CompanyTickerSelectProvider from "pages/import/components/CompanyTickerSelect/CompanyTickerSelectProvider";
import { IDividendsTransactionFormFields } from "types/dividends-transaction";
import { IPortfolio } from "types/portfolio";

interface Props {
  portfolio: IPortfolio;
  dividend: any | boolean;
  onSubmitCallback: () => void;
}

export default function DividendsImportForm({
  portfolio,
  dividend,
  onSubmitCallback,
}: Props) {
  const { t } = useTranslation();
  const dateFormat = "YYYY-MM-DD";
  const [formSent, setFormSent] = useState(false);
  const { mutate: createDividendsTransaction, isPending } =
    useAddDividendsTransaction({
      onSuccess: () => setFormSent(true),
    });

  const form = useForm<IDividendsTransactionFormFields>({
    mode: "uncontrolled",
    initialValues: {
      transactionDate: new Date(dividend.date),
      totalAmount: dividend.amount,
      totalAmountCurrency: dividend.currency,
      totalCommission: dividend.commissions,
      totalCommissionCurrency: dividend.currency,
      notes: dividend.description,
      exchangeRate: 1,
      company: 0,
    },
  });

  const onCompanyChange = useCallback(
    (value: any) => {
      console.log("onCompanyChange", value);
      form.setFieldValue("company", value);
    },
    [form],
  );

  const handleSubmit = (values: any) => {
    createDividendsTransaction({
      newTransaction: values,
      updatePortfolio: false,
    });
    onSubmitCallback();
  };

  const { isLoading, refetch } = useExchangeRate(
    dividend.currency,
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
            {dividend.ticker} - {dividend.currency}
          </Title>

          <Text>
            {dividend.companyName ? `${dividend.companyName} - ` : ""}ISIN:{" "}
            {dividend.isin} - {t("Market")}: {dividend.market}
          </Text>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Grid>
              <Grid.Col span={6}>
                <DateInput
                  withAsterisk
                  label={t("Date")}
                  description={`${t("Received")}: ${dividend.date}`}
                  key={form.key("transactionDate")}
                  valueFormat={dateFormat}
                  defaultValue={new Date()}
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...form.getInputProps("transactionDate")}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  withAsterisk
                  label={t("Amount")}
                  description={`${t("Received")}: ${dividend.amount}`}
                  key={form.key("totalAmount")}
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...form.getInputProps("totalAmount")}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  withAsterisk
                  label={t("Commission")}
                  description={`${t("Received")}: ${dividend.commissions}`}
                  key={form.key("totalCommission")}
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...form.getInputProps("totalCommission")}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <CompanyTickerSelectProvider
                  onSelect={onCompanyChange}
                  ticker={dividend.ticker}
                  portfolioId={portfolio.id}
                  form={form}
                  withAsterisk
                  description={`${t<string>("Received")}: ${dividend.ticker}`}
                />
              </Grid.Col>
              {dividend.currency !== portfolio?.baseCurrency.code && (
                <Grid.Col span={6}>
                  <Group align="flex-end">
                    <NumberInput
                      withAsterisk
                      label={t("Exchange Rate")}
                      key={form.key("exchangeRate")}
                      suffix={` ${dividend.currency}${portfolio?.baseCurrency.code}`}
                      decimalScale={2}
                      description={`${dividend.currency} ${t("to")} ${
                        portfolio?.baseCurrency.code
                      }`}
                      // eslint-disable-next-line react/jsx-props-no-spreading
                      {...form.getInputProps("exchangeRate")}
                      classNames={classes}
                    />
                    <Button
                      disabled={
                        form.getValues().transactionDate === null ||
                        portfolio?.baseCurrency.code === null ||
                        dividend.currency === null
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
                    {t("Add dividend")}
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
