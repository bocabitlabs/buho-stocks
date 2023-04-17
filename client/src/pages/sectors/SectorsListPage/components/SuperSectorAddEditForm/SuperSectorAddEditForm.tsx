import React, { ReactElement, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Col, Form, Input, Modal, Row } from "antd";
import LoadingSpin from "components/LoadingSpin/LoadingSpin";
import {
  useAddSuperSector,
  useSuperSector,
  useUpdateSuperSector,
} from "hooks/use-sectors/use-super-sectors";

interface AddEditFormProps {
  title: string;
  okText: string;
  id?: number;
  isModalVisible: boolean;
  onCreate: (values: any) => void;
  onCancel: () => void;
}

function SuperSectorAddEditForm({
  title,
  okText,
  id,
  isModalVisible,
  onCreate,
  onCancel,
}: AddEditFormProps): ReactElement | null {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const { mutate: createSector } = useAddSuperSector();
  const { mutate: updateSector } = useUpdateSuperSector();
  const {
    data: sector,
    error: errorFetchingSector,
    isFetching: fetchingSector,
  } = useSuperSector(id);

  const handleSubmit = async (values: any) => {
    const { name, superSector } = values;
    const newSector = {
      name,
      superSector,
    };
    if (id) {
      updateSector({ id, newSector });
    } else {
      createSector(newSector);
    }
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
      });
    }
  }, [form, sector]);

  if (fetchingSector) {
    return <LoadingSpin />;
  }

  if (errorFetchingSector) {
    return (
      <Alert
        showIcon
        message={t("Unable to load super sector")}
        description={errorFetchingSector.message}
        type="error"
      />
    );
  }

  return (
    <Modal
      open={isModalVisible}
      title={title}
      okText={okText}
      cancelText={t("Cancel")}
      onCancel={onCancel}
      afterClose={onCancel}
      onOk={handleFormSubmit}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          name: sector?.name,
        }}
      >
        {" "}
        <Row gutter={24}>
          <Col span={24}>
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
                placeholder="Industrial, Consumer defensive..."
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

SuperSectorAddEditForm.defaultProps = {
  id: undefined,
};

export default SuperSectorAddEditForm;
