import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Checkbox, Group, Modal, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconRefresh } from "@tabler/icons-react";
import { useUpdatePortfolioYearStats } from "hooks/use-stats/use-portfolio-stats";

interface Props {
  portfolioId: string;
  selectedYear: string;
}

interface FormValues {
  updateStockPrice: boolean;
}

export default function StatsRefreshModal({
  portfolioId,
  selectedYear,
}: Props) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  const showModal = () => {
    setVisible(true);
  };

  const form = useForm({
    initialValues: {
      portfolioId,
      year: selectedYear,
      updateStockPrice: false,
      companiesIds: [],
    },
  });

  const { mutate: updatePortfolioStats, isPending } =
    useUpdatePortfolioYearStats({
      onSuccess: () => {
        setVisible(false);
        form.reset();
      },
    });

  const handleFormSubmit = (values: FormValues) => {
    updatePortfolioStats({
      portfolioId: +portfolioId!,
      year: selectedYear ? selectedYear : null,
      updateApiPrice: values.updateStockPrice,
    });

    return { result: true, message: "" };
  };

  const handleCancel = () => {
    form.reset();
    setVisible(false);
  };

  return (
    <>
      <Button
        mt="20"
        onClick={showModal}
        leftSection={<IconRefresh />}
        variant="subtle"
      />
      <Modal
        title={`${t("Refresh stats and stock prices for")} ${t(selectedYear)}`}
        opened={visible}
        onClose={handleCancel}
      >
        <form onSubmit={form.onSubmit(handleFormSubmit)}>
          <Text>
            {t("For each company, the stats for the year")} {t(selectedYear)}{" "}
            {t("will be updated.")}
          </Text>
          <Checkbox
            mt="md"
            key={form.key("updateStockPrice")}
            label={t("Update the stock prices from API")}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...form.getInputProps("updateStockPrice")}
          />

          <Group justify="space-between" mt="md">
            <Button type="button" color="gray" onClick={handleCancel}>
              {t("Cancel")}
            </Button>
            <Button
              type="submit"
              color="blue"
              loading={isPending}
              disabled={isPending}
            >
              {t("Update stats")}
            </Button>
          </Group>
        </form>
      </Modal>
    </>
  );
}
