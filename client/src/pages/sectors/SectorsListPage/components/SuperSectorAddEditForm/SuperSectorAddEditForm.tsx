import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Form, Input, Modal } from "antd";
import LoadingSpin from "components/LoadingSpin/LoadingSpin";
import {
  useAddSuperSector,
  useSuperSector,
  useUpdateSuperSector,
} from "hooks/use-sectors/use-super-sectors";

interface AddEditFormProps {
  title: string;
  okText: string;
  sectorId?: number;
  isModalVisible: boolean;
  onCreate: (values: any) => void;
  onCancel: () => void;
}

function SuperSectorAddEditForm({
  title,
  okText,
  sectorId,
  isModalVisible,
  onCreate,
  onCancel,
}: AddEditFormProps) {
  const [form] = Form.useForm();
  const { t } = useTranslation();

  const { mutate: createSuperSector } = useAddSuperSector();
  const { mutate: updateSuperSector } = useUpdateSuperSector();

  const {
    data: sector,
    error: errorFetching,
    isFetching,
    isSuccess,
  } = useSuperSector(sectorId);

  const handleSuperSectorSubmit = async (newSector: any) => {
    if (sectorId) {
      updateSuperSector({ sectorId, newSector });
    } else {
      createSuperSector(newSector);
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
    await handleSuperSectorSubmit(newSector);
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
        </Form>
      )}
    </Modal>
  );
}
SuperSectorAddEditForm.defaultProps = {
  sectorId: undefined,
};

export default SuperSectorAddEditForm;
