import { useCallback, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Button,
  Group,
  Modal,
  Textarea,
  TextInput,
  Grid,
  Select,
} from "@mantine/core";
import { TimeInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import CountrySelector from "components/CountrySelector/CountrySelector";
import LoadingSpin from "components/LoadingSpin/LoadingSpin";
import {
  useAddMarket,
  useMarket,
  useTimezones,
  useUpdateMarket,
} from "hooks/use-markets/use-markets";
import { ITimezone } from "types/market";

interface AddEditFormProps {
  id?: number;
  isUpdate?: boolean;
  showButton?: boolean;
  isVisible: boolean;
  onCloseCallback?: () => void;
}

function MarketAddEditForm({
  id = undefined,
  isUpdate = false,
  isVisible,
  onCloseCallback = () => {},
}: Readonly<AddEditFormProps>) {
  const { t } = useTranslation();

  const { data: timezones } = useTimezones();

  const {
    data: market,
    error: errorFetchingMarket,
    isLoading: isLoadingMarket,
  } = useMarket(id);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: market ? market.name : "",
      description: market ? market.description : "",
      region: market ? market.region : "",
      openTime: market ? market?.openTime : "",
      closeTime: market ? market?.closeTime : "",
      timezone: market ? market.timezone : "",
      color: "#607d8b",
    },
  });

  const onSuccess = () => {
    form.reset();
    onCloseCallback();
  };

  const { mutate: createMarket } = useAddMarket({
    onSuccess,
  });

  const { mutate: updatedMarket } = useUpdateMarket({
    onSuccess,
  });

  const onSubmit = (values: any) => {
    if (isUpdate) {
      updatedMarket({ id, newMarket: values });
    } else {
      createMarket(values);
    }
  };

  const timezonesOptions = useMemo(() => {
    const tzOptions = timezones?.map((timezone: ITimezone) => ({
      value: timezone.name,
      label: t(timezone.name),
    }));
    return tzOptions;
  }, [timezones, t]);

  const hideModal = useCallback(() => {
    form.reset();
    onCloseCallback();
  }, [onCloseCallback]);

  useEffect(() => {
    if (market) {
      console.log(market.timezone);
      form.setValues({
        name: market.name,
        description: market.description,
        region: market.region,
        openTime: market.openTime,
        closeTime: market.closeTime,
        timezone: market.timezone,
        color: market.color,
      });
    }
  }, [market]);

  if (isLoadingMarket) {
    return <LoadingSpin />;
  }

  if (errorFetchingMarket) {
    return (
      <Alert title={t("Unable to load market")} color="red">
        {errorFetchingMarket.message}
      </Alert>
    );
  }

  return (
    <Modal
      opened={isVisible}
      title={isUpdate ? t("Update market") : t("Add new market")}
      onClose={onCloseCallback}
    >
      <form onSubmit={form.onSubmit(onSubmit)}>
        <TextInput
          withAsterisk
          label={t("Name")}
          key={form.key("name")}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...form.getInputProps("name")}
        />

        <Textarea
          mt="md"
          label={t("Description")}
          key={form.key("description")}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...form.getInputProps("description")}
        />
        <CountrySelector form={form} fieldName="region" />

        <Grid.Col span={6}>
          <TimeInput
            label={t("Opening time")}
            withAsterisk
            description={t<string>("Please input the opening time")}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...form.getInputProps("openTime")}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TimeInput
            label={t("Closing time")}
            withAsterisk
            description={t<string>("Please input the closing time")}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...form.getInputProps("closeTime")}
          />
        </Grid.Col>

        {/* {timezonesLoading ? (
          t("Loading timezones...")
        ) : ( */}
        <Select
          mt="md"
          withAsterisk
          searchable
          label={t("Timezone")}
          data={timezonesOptions}
          value={form.getValues().timezone}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...form.getInputProps("timezone")}
          required
        />
        {/* )} */}
        <Group justify="space-between" mt="md">
          <Button type="button" color="gray" onClick={hideModal}>
            {t("Cancel")}
          </Button>
          <Button type="submit" color="blue">
            {market ? t("Update") : t("Create")}
          </Button>
        </Group>
      </form>
    </Modal>
  );
}

export default MarketAddEditForm;
