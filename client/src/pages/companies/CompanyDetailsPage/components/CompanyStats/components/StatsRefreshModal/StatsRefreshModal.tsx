import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Checkbox, Group, Modal, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconRefresh } from "@tabler/icons-react";
import { useUpdateYearStats } from "hooks/use-stats/use-company-stats";

interface Props {
  companyId: string | undefined;
  selectedYear: string;
}

interface FormValues {
  updateStockPrice: boolean;
}

export default function StatsRefreshModal({ companyId, selectedYear }: Props) {
  const { t } = useTranslation();

  const [visible, setVisible] = useState(false);

  const showModal = () => {
    setVisible(true);
  };

  const form = useForm({
    initialValues: {
      companyId,
      year: selectedYear,
      updateStockPrice: false,
    },
  });

  const { mutate: updateStats, isPending } = useUpdateYearStats({
    onSuccess: () => {
      setVisible(false);
      form.reset();
    },
  });

  const handleFormSubmit = (values: FormValues) => {
    updateStats({
      companyId: +companyId!,
      year: selectedYear,
      updateApiPrice: values.updateStockPrice,
    });
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
        title={t("Refresh stats and stock prices")}
        opened={visible}
        onClose={handleCancel}
      >
        <form onSubmit={form.onSubmit(handleFormSubmit)}>
          <Text>
            {t("Do you want to update the stats and the stock price?")}
          </Text>
          <Checkbox
            mt="md"
            key={form.key("updateStockPrice")}
            label={t("Update the stock price from API")}
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
