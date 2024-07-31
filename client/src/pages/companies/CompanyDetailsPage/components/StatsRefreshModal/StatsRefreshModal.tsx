import { useState } from "react";
import { useTranslation } from "react-i18next";
import { SyncOutlined } from "@ant-design/icons";
import { Button, Checkbox, Group, Modal, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
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

  const { mutate: updateStats } = useUpdateYearStats();

  const showModal = () => {
    setVisible(true);
  };

  const handleFormSubmit = (values: FormValues) => {
    updateStats({
      companyId: +companyId!,
      year: selectedYear,
      updateApiPrice: values.updateStockPrice,
    });
    // const message = `${t("Updating company stats for year")} ${t(
    //   selectedYear,
    // )}`;
    // setVisible(false);
    // toast.success<string>(message);

    return { result: true, message: "" };
  };

  const form = useForm({
    initialValues: {
      companyId,
      year: selectedYear,
      updateStockPrice: false,
    },
  });

  const handleCancel = () => {
    form.reset();
    setVisible(false);
  };

  return (
    <>
      <Button
        mt="20"
        onClick={showModal}
        leftSection={<SyncOutlined />}
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
            <Button type="submit" color="blue">
              {t("Update stats")}
            </Button>
          </Group>
          {/* <Form.Item style={{ marginBottom: 0 }}>
            <Checkbox
              onChange={onStockPriceChange}
              checked={updateStockPriceSwitch}
            >
              {t("Update the stock price from API")}
            </Checkbox>
          </Form.Item> */}
        </form>
      </Modal>
    </>
  );
}
