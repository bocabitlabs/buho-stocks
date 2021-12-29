import React, { ReactElement, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, Select, Spin, Switch } from "antd";
import useFetch from "use-http";
import ColorSelector from "components/ColorSelector/ColorSelector";
import { AlertMessagesContext } from "contexts/alert-messages";
import { ISector } from "types/sector";

interface AddEditFormProps {
  sectorId?: string;
  isSuper?: boolean;
}

function SectorAddEditForm({
  sectorId,
  isSuper,
}: AddEditFormProps): ReactElement | null {
  const [form] = Form.useForm();
  const [color, setColor] = useState("#607d8b");
  const { t } = useTranslation();
  const { createSuccess, createError } = useContext(AlertMessagesContext);
  const [sector, setSector] = useState<ISector | null>(null);
  const [superSectors, setSuperSectors] = useState<ISector[] | []>([]);
  const { loading, response, get, post, put, cache } = useFetch("sectors");
  const {
    get: getSuperSectors,
    post: postSuperSector,
    put: putSuperSector,
    response: superSectorsResponse,
    cache: superSectorCache,
  } = useFetch("sectors/super");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSector() {
      let result;
      if (isSuper) {
        result = await getSuperSectors(`${sectorId}/`);
        if (superSectorsResponse.ok) {
          setSector(result);
          setColor(result.color);
          form.setFieldsValue({
            name: result.name,
          });
        }
      } else {
        result = await get(`${sectorId}/`);
        if (response.ok) {
          setSector(result);
          setColor(result.color);
          form.setFieldsValue({
            name: result.name,
            isSuperSector: result.isSuperSector,
            superSectorId: result.superSector?.id,
          });
        }
      }
    }
    async function fetchSuperSectors() {
      const result = await getSuperSectors();
      if (response.ok) {
        setSuperSectors(result);
      }
    }

    if (sectorId) {
      fetchSector();
      fetchSuperSectors();
    }
  }, [
    sectorId,
    get,
    response.ok,
    form,
    getSuperSectors,
    superSectorsResponse,
    isSuper,
  ]);

  const handleSuperSectorSubmit = async (newSector: any) => {
    let actionType = "update";
    if (sectorId) {
      const id: number = +sectorId;
      await putSuperSector(`${id}/`, newSector);
    } else {
      actionType = "create";
      await postSuperSector("/", newSector);
    }
    if (!superSectorsResponse.ok) {
      createError(`Cannot ${actionType} super sector`);
    } else {
      superSectorCache.clear();
      createSuccess(`Super sector has been ${actionType}d`);
      navigate(-1);
    }
  };

  const handleSectorSubmit = async (newSector: any) => {
    let actionType = "update";

    if (sectorId) {
      const id: number = +sectorId;
      await put(`${id}/`, newSector);
    } else {
      await post("/", newSector);
      actionType = "create";
    }
    if (!response.ok) {
      createError(`Cannot ${actionType} sector`);
    } else {
      cache.clear();
      createSuccess(`Sector has been ${actionType}d`);
      navigate(-1);
    }
  };

  const handleSubmit = async (values: any) => {
    const { name, isSuperSector, superSectorId } = values;
    const newSector = {
      name,
      color,
      superSector: superSectorId,
      isSuperSector,
    };

    if (isSuper) {
      await handleSuperSectorSubmit(newSector);
    } else {
      await handleSectorSubmit(newSector);
    }
  };

  const handleColorChange = (newColor: any) => {
    setColor(newColor.hex);
  };

  if (sectorId && !sector) {
    return <Spin />;
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        name: sectorId ? sector?.name : "",
        isSuperSector: sectorId ? sector?.isSuperSector : "",
        superSectorId: sectorId ? sector?.superSector?.id : "",
      }}
    >
      <Form.Item
        name="name"
        label={t("Name")}
        rules={[
          { required: true, message: t("Please input the name of the sector") },
        ]}
      >
        <Input type="text" placeholder="REIT, Banks, Semiconductors,..." />
      </Form.Item>
      <Form.Item
        label={
          <div>
            {t("Color")}:{" "}
            <svg
              width="35"
              height="35"
              viewBox="0 0 35 35"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="10"
                y="10"
                width="25"
                height="25"
                rx="5"
                ry="5"
                fill={color}
              />
            </svg>
          </div>
        }
      >
        <ColorSelector color={color} handleColorChange={handleColorChange} />
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
      {!isSuper && !sectorId && (
        <Form.Item
          label={t("Is a super sector")}
          name="isSuperSector"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
      )}
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          {sectorId
            ? t(`Update ${isSuper ? "super" : ""} sector`)
            : t("Add sector")}
        </Button>
      </Form.Item>
    </Form>
  );
}
SectorAddEditForm.defaultProps = {
  sectorId: null,
  isSuper: false,
};

export default SectorAddEditForm;
