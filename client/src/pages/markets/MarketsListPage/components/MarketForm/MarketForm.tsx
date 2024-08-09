import { useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Group,
  Modal,
  Textarea,
  TextInput,
  Select,
  ActionIcon,
  rem,
} from "@mantine/core";
import { TimeInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { IconClock } from "@tabler/icons-react";
import CountrySelector from "components/CountrySelector/CountrySelector";
import { IMarket, IMarketFormFields, ITimezone } from "types/market";

interface AddEditFormProps {
  isVisible: boolean;
  timezones: ITimezone[];
  data?: IMarket;
  isUpdate?: boolean;
  onCloseCallback?: () => void;
  // eslint-disable-next-line no-unused-vars
  onSubmitCallback: (values: IMarketFormFields) => void;
}

function MarketForm({
  data = undefined,
  timezones,
  onSubmitCallback,
  isUpdate = false,
  isVisible,
  onCloseCallback = () => {},
}: Readonly<AddEditFormProps>) {
  const { t } = useTranslation();

  const market = data;

  const form = useForm<IMarketFormFields>({
    mode: "uncontrolled",
    initialValues: {
      name: market ? market.name : "",
      description: market ? market.description : "",
      region: market ? market.region : "",
      openTime: market ? market?.openTime : new Date(),
      closeTime: market ? market?.closeTime : new Date(),
      timezone: market ? market.timezone : "",
      color: "#607d8b",
    },
  });

  const ref = useRef<HTMLInputElement>(null);

  const pickerControl = (
    <ActionIcon
      variant="subtle"
      color="gray"
      onClick={() => ref.current?.showPicker()}
    >
      <IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
    </ActionIcon>
  );

  const onSubmit = (values: any) => {
    onSubmitCallback(values);
  };

  const timezonesOptions = useMemo(() => {
    const tzOptions = timezones?.map((timezone: ITimezone) => ({
      value: timezone.name,
      label: t(timezone.name),
    }));
    return tzOptions;
  }, [timezones, t]);

  const hideModal = () => {
    form.reset();
    onCloseCallback();
  };

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

        <TimeInput
          label={t("Opening time")}
          withAsterisk
          description={t<string>("Please input the opening time")}
          ref={ref}
          rightSection={pickerControl}
          withSeconds={false}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...form.getInputProps("openTime")}
        />
        <TimeInput
          label={t("Closing time")}
          withAsterisk
          description={t<string>("Please input the closing time")}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...form.getInputProps("closeTime")}
        />

        <Select
          mt="md"
          withAsterisk
          searchable
          label={t("Timezone")}
          data={timezonesOptions}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...form.getInputProps("timezone")}
          required
        />
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

export default MarketForm;
