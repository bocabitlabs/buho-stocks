import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Group, Modal, NumberInput, Textarea } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import dayjs from "dayjs";
import { useExchangeRate } from "hooks/use-exchange-rates/use-exchange-rates";
import {
  IDividendsTransaction,
  IDividendsTransactionFormFields,
} from "types/dividends-transaction";

interface IProps {
  transaction?: IDividendsTransaction;
  isUpdate?: boolean;
  companyId: number;
  companyDividendsCurrency: string;
  portfolioBaseCurrency: string;
  isVisible: boolean;
  onCloseCallback: () => void;
  // eslint-disable-next-line no-unused-vars
  onSubmitCallback: (values: IDividendsTransactionFormFields) => void;
}

export default function DividendsTransactionForm({
  transaction = undefined,
  companyId,
  companyDividendsCurrency,
  portfolioBaseCurrency,
  isVisible,
  isUpdate = false,
  onCloseCallback,
  onSubmitCallback,
}: IProps) {
  const { t } = useTranslation();
  const dateFormat = "YYYY-MM-DD";
  const [currentTransactionDate, setCurrentTransactionDate] =
    useState<Date | null>(null);

  const form = useForm<IDividendsTransactionFormFields>({
    mode: "uncontrolled",
    initialValues: {
      company: companyId,
      totalAmount: transaction ? transaction.totalAmount : 0,
      totalAmountCurrency: companyDividendsCurrency,
      totalCommissionCurrency: companyDividendsCurrency,
      totalCommission: transaction ? transaction.totalCommission : 0,
      exchangeRate: transaction ? transaction.exchangeRate : 1,
      notes: transaction ? transaction.notes : "",
      transactionDate: transaction
        ? new Date(transaction.transactionDate)
        : new Date(),
    },
  });

  const { isLoading, refetch } = useExchangeRate(
    companyDividendsCurrency,
    portfolioBaseCurrency,
    dayjs(currentTransactionDate).format(dateFormat),
  );

  form.watch("transactionDate", ({ value }) => {
    console.log({ value });
    setCurrentTransactionDate(value);
  });

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

  const onSubmit = (values: any) => {
    onSubmitCallback(values);
  };

  const hideModal = () => {
    form.reset();
    onCloseCallback();
  };

  return (
    <Modal
      opened={isVisible}
      size="md"
      title={
        isUpdate
          ? t("Update dividends transaction")
          : t("Add new dividends transaction")
      }
      onClose={onCloseCallback}
    >
      <form onSubmit={form.onSubmit(onSubmit)}>
        <NumberInput
          withAsterisk
          label={t("Total Amount")}
          key={form.key("totalAmount")}
          suffix={` ${companyDividendsCurrency}`}
          decimalScale={2}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...form.getInputProps("totalAmount")}
        />

        <NumberInput
          mt="md"
          withAsterisk
          label={t("Total Commission")}
          key={form.key("totalCommission")}
          suffix={` ${companyDividendsCurrency}`}
          decimalScale={2}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...form.getInputProps("totalCommission")}
        />

        <DateInput
          mt="md"
          withAsterisk
          label={t("Date")}
          key={form.key("transactionDate")}
          valueFormat={dateFormat}
          defaultValue={new Date()}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...form.getInputProps("transactionDate")}
        />

        {companyDividendsCurrency !== portfolioBaseCurrency && (
          <Group mt="md">
            <NumberInput
              withAsterisk
              label={t("Exchange Rate")}
              key={form.key("exchangeRate")}
              suffix={` ${companyDividendsCurrency}${portfolioBaseCurrency}`}
              decimalScale={2}
              description={`${companyDividendsCurrency} ${t(
                "to",
              )} ${portfolioBaseCurrency}`}
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...form.getInputProps("exchangeRate")}
            />
            <Button
              disabled={
                form.getValues().transactionDate === null ||
                portfolioBaseCurrency === null ||
                companyDividendsCurrency === null
              }
              onClick={fetchExchangeRate}
              loading={isLoading}
            >
              {t("Get exchange rate")}
            </Button>
          </Group>
        )}

        <Textarea
          mt="md"
          label={t("Notes")}
          key={form.key("notes")}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...form.getInputProps("notes")}
        />
        <Group justify="space-between" mt="md">
          <Button type="button" color="gray" onClick={hideModal}>
            {t("Cancel")}
          </Button>
          <Button type="submit" color="blue">
            {transaction ? t("Update") : t("Create")}
          </Button>
        </Group>
      </form>
    </Modal>
  );
}
