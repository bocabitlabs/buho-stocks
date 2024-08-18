import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Group, Modal, NumberInput, Textarea } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import dayjs from "dayjs";
import { useExchangeRate } from "hooks/use-exchange-rates/use-exchange-rates";
import {
  IRightsTransaction,
  IRightsTransactionFormFields,
} from "types/rights-transaction";

interface IProps {
  transaction?: IRightsTransaction;
  isUpdate?: boolean;
  companyId: number;
  companyBaseCurrency: string;
  portfolioBaseCurrency: string;
  isVisible: boolean;
  onCloseCallback: () => void;
  onSubmitCallback: (values: IRightsTransactionFormFields) => void;
}

export default function RightsTransactionForm({
  transaction = undefined,
  companyId,
  companyBaseCurrency,
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

  const form = useForm<IRightsTransactionFormFields>({
    mode: "uncontrolled",
    initialValues: {
      company: companyId,
      totalAmount: transaction ? transaction.totalAmount : 0,
      totalAmountCurrency: companyBaseCurrency,
      totalCommissionCurrency: companyBaseCurrency,
      totalCommission: transaction ? transaction.totalCommission : 0,
      exchangeRate: transaction ? transaction.exchangeRate : 1,
      notes: transaction ? transaction.notes : "",
      count: transaction ? transaction.count : 0,
      grossPricePerShare: transaction ? transaction.grossPricePerShare : 0,
      grossPricePerShareCurrency: companyBaseCurrency,
      type: transaction ? transaction.type : "BUY",
      transactionDate: transaction
        ? new Date(transaction.transactionDate)
        : new Date(),
    },
  });

  const { isLoading, refetch } = useExchangeRate(
    companyBaseCurrency,
    portfolioBaseCurrency,
    dayjs(currentTransactionDate).format(dateFormat),
  );

  form.watch("transactionDate", ({ previousValue, value, touched, dirty }) => {
    console.log({ previousValue, value, touched, dirty });
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

  const onSubmit = (values: IRightsTransactionFormFields) => {
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
          ? t("Update rights transaction")
          : t("Add new rights transaction")
      }
      onClose={onCloseCallback}
    >
      <form onSubmit={form.onSubmit(onSubmit)}>
        <NumberInput
          withAsterisk
          label={t("Total Amount")}
          key={form.key("totalAmount")}
          suffix={` ${companyBaseCurrency}`}
          decimalScale={2}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...form.getInputProps("totalAmount")}
        />

        <NumberInput
          mt="md"
          withAsterisk
          label={t("Shares count")}
          key={form.key("count")}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...form.getInputProps("count")}
        />

        <NumberInput
          mt="md"
          withAsterisk
          label={t("Gross price per right")}
          key={form.key("grossPricePerShare")}
          suffix={` ${companyBaseCurrency}`}
          decimalScale={2}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...form.getInputProps("grossPricePerShare")}
        />

        <NumberInput
          mt="md"
          withAsterisk
          label={t("Total Commission")}
          key={form.key("totalCommission")}
          suffix={` ${companyBaseCurrency}`}
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

        {companyBaseCurrency !== portfolioBaseCurrency && (
          <Group mt="md">
            <NumberInput
              withAsterisk
              label={t("Exchange Rate")}
              key={form.key("exchangeRate")}
              suffix={` ${companyBaseCurrency}${portfolioBaseCurrency}`}
              decimalScale={2}
              description={`${companyBaseCurrency} ${t(
                "to",
              )} ${portfolioBaseCurrency}`}
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...form.getInputProps("exchangeRate")}
            />
            <Button
              disabled={
                form.getValues().transactionDate === null ||
                portfolioBaseCurrency === null ||
                companyBaseCurrency === null
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
