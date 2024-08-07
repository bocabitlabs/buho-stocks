import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Button, Group, Modal, Select, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { ISector, ISectorFormFields } from "types/sector";

interface AddEditFormProps {
  id?: number;
  isUpdate?: boolean;
  isVisible: boolean;
  isSuperSector?: boolean;
  superSectors: ISector[];
  data?: ISector;
  onCloseCallback?: () => void;
  onSubmitCallback: (values: ISectorFormFields) => void;
}

function SectorForm({
  data,
  superSectors,
  isUpdate = false,
  isVisible,
  isSuperSector = false,
  onSubmitCallback,
  onCloseCallback = () => {},
}: Readonly<AddEditFormProps>) {
  const { t } = useTranslation();

  const form = useForm<ISectorFormFields>({
    mode: "uncontrolled",
    initialValues: {
      name: data?.name ?? "",
      superSector: data?.superSector?.toString(),
    },
  });

  const onSubmit = (values: any) => {
    onSubmitCallback(values);
  };

  const hideModal = () => {
    form.reset();
    onCloseCallback();
  };

  const superSectorsOptions = useMemo(() => {
    const tzOptions = superSectors?.map((sup: ISector) => ({
      value: sup.id.toString(),
      label: t(sup.name),
    }));
    return tzOptions;
  }, [superSectors, t]);

  const getTitle = () => {
    let title = "";
    if (isUpdate && isSuperSector) {
      title = t(`Update super sector`);
    } else if (isUpdate && !isSuperSector) {
      title = t(`Update sector`);
    } else if (!isUpdate && isSuperSector) {
      title = t(`Add new super sector`);
    } else {
      title = t(`Add new sector`);
    }
    return title;
  };

  return (
    <Modal opened={isVisible} title={getTitle()} onClose={onCloseCallback}>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <TextInput
          withAsterisk
          label={t("Name")}
          key={form.key("name")}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...form.getInputProps("name")}
        />
        {!isSuperSector && (
          <Select
            mt="md"
            withAsterisk
            searchable
            label={t("Super sector")}
            data={superSectorsOptions}
            value={form.getValues().superSector}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...form.getInputProps("superSector")}
            required
          />
        )}
        <Group justify="space-between" mt="md">
          <Button type="button" color="gray" onClick={hideModal}>
            {t("Cancel")}
          </Button>
          <Button type="submit" color="blue">
            {data ? t("Update") : t("Create")}
          </Button>
        </Group>
      </form>
    </Modal>
  );
}

export default SectorForm;
