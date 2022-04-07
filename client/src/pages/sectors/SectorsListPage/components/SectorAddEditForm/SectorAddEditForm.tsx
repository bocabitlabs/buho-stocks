import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Form, Input, Modal, Select, Switch } from "antd";
import LoadingSpin from "components/LoadingSpin/LoadingSpin";
import {
  useAddSector,
  useSector,
  useUpdateSector,
} from "hooks/use-sectors/use-sectors";
import { useSuperSectors } from "hooks/use-sectors/use-super-sectors";
import { ISector } from "types/sector";

interface AddEditFormProps {
  title: string;
  okText: string;
  sectorId?: number;
  isModalVisible: boolean;
  onCreate: (values: any) => void;
  onCancel: () => void;
  isSuper?: boolean;
}

function SectorAddEditForm({
  title,
  okText,
  sectorId,
  isModalVisible,
  onCreate,
  onCancel,
  isSuper,
}: AddEditFormProps) {
  const [form] = Form.useForm();
  const { t } = useTranslation();

  const { data: superSectors } = useSuperSectors();
  const { mutate: createSector } = useAddSector();
  const { mutate: updateSector } = useUpdateSector();
  const {
    data: sector,
    error: errorFetching,
    isFetching,
    isSuccess,
  } = useSector(sectorId, {
    onSuccess: (data: any) => {
      form.setFieldsValue({ superSectorId: data.superSector });
    },
  });

  const handleSectorSubmit = async (newSector: any) => {
    if (sectorId) {
      updateSector({ sectorId, newSector });
    } else {
      createSector(newSector);
    }
  };

  const handleSubmit = async (values: any) => {
    const { name, isSuperSector, superSectorId } = values;
    const newSector = {
      name,
      color: "#607d8b",
      superSector: superSectorId,
      isSuperSector,
    };

    await handleSectorSubmit(newSector);
  };

  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();
      await handleSubmit(values);
      form.resetFields();
      onCreate(values);
    } catch (error) {
      console.log("Validate Failed:", error);
    }
  };

  useEffect(() => {
    if (sector) {
      form.setFieldsValue({
        name: sector?.name,
        isSuperSector: sector?.isSuperSector,
        superSectorId: sector?.superSector?.id,
      });
    }
  }, [form, sector]);

  return (
    <Modal
      visible={isModalVisible}
      title={title}
      okText={okText}
      cancelText={t("Cancel")}
      onCancel={onCancel}
      onOk={handleFormSubmit}
    >
      {isFetching && <LoadingSpin />}
      {errorFetching && (
        <Alert
          showIcon
          message={t("Unable to load sector")}
          description={errorFetching.message}
          type="error"
        />
      )}
      {(isSuccess || !sectorId) && (
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label={t("Name")}
            rules={[
              {
                required: true,
                message: t("Please input the name of the sector"),
              },
            ]}
          >
            <Input
              type="text"
              placeholder={t("REIT, Banks, Semiconductors,...")}
            />
          </Form.Item>
          {!isSuper && (
            <Form.Item name="superSectorId" label={t("Super sector")}>
              <Select placeholder={t("Select its super sector")} allowClear>
                {superSectors &&
                  superSectors.map((sectorItem: ISector) => (
                    <Select.Option
                      value={sectorItem.id}
                      key={`sector-${sectorItem.id}-${sectorItem.id}`}
                    >
                      {sectorItem.name}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
          )}
          {!isSuper && !sector && (
            <Form.Item
              label={t("Is a super sector")}
              name="isSuperSector"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          )}
        </Form>
      )}
    </Modal>
  );
}
SectorAddEditForm.defaultProps = {
  sectorId: undefined,
  isSuper: false,
};

export default SectorAddEditForm;
