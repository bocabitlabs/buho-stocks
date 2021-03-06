import React, { ReactElement, useContext, useEffect, useState } from "react";
import { Button, Form, Input, message, Select, Switch } from "antd";
import { useHistory } from "react-router-dom";

import { SectorsContext } from "contexts/sectors";
import ColorSelector from "components/ColorSelector/ColorSelector";
import { ISector } from "types/sector";
import { useTranslation } from "react-i18next";

interface AddEditFormProps {
  sectorId?: string;
}

function SectorAddEditForm({
  sectorId
}: AddEditFormProps): ReactElement | null {
  const [form] = Form.useForm();
  const history = useHistory();
  const [color, setColor] = useState("#607d8b");
  const [sectors, setSectors] = useState<ISector[]>([]);
  const { t } = useTranslation();
  const key = "updatable";

  const {
    sector,
    create: addSector,
    getAll,
    getById: getSectorById,
    update: updateSector
  } = useContext(SectorsContext);

  useEffect(() => {
    const sectors = getAll();
    setSectors(sectors);
    if (sectorId) {
      const newSector = getSectorById(sectorId);
      if (newSector) {
        setColor(newSector.color);
      }
    }
  }, [sectorId, getSectorById, getAll]);

  const handleSubmit = (values: any) => {
    message.loading({ content: t("Adding sector..."), key });

    const { name, isSuperSector, superSectorId } = values;
    const newSector = {
      name,
      color,
      isSuperSector: isSuperSector? true: false,
      superSectorId
    };
    let changes = null;
    if (sectorId) {
      changes = updateSector(sectorId, newSector);
    } else {
      changes = addSector(newSector);
    }
    if (changes.changes) {
      getAll();
      if (!sectorId) {
        message.success({ content: t("Sector has been added"), key });
      } else {
        message.success({ content: t("Sector has been updated"), key });
      }
      history.push("/sectors");
    } else {
      message.error({ content: t("Unable to add the sector"), key });
    }
  };

  const handleColorChange = (color: any, event: any) => {
    setColor(color.hex);
  };

  if (sectorId && !sector) {
    return null;
  }

  return (
    <Form
      form={form}
      name="basic"
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        name: sector?.name,
        isSuperSector: sector?.isSuperSector,
        superSectorId: sector?.superSectorId
      }}
    >
      <Form.Item
        name="name"
        label={t("Name")}
        rules={[
          { required: true, message: t("Please input the name of the sector") }
        ]}
      >
        <Input type="text" />
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
      <Form.Item label={t("Is a super sector")} name="isSuperSector" valuePropName="checked">
        <Switch />
      </Form.Item>
      <Form.Item name="superSectorId" label={t("Super sector")}>
        <Select
          placeholder={t("Select its super sector")}
          allowClear
        >
          {sectors &&
            sectors.filter((sec)=> sec.isSuperSector).map((sector: ISector, index: number) => (
              <Select.Option
                value={sector.id}
                key={`sector-${sector.id}-${index}`}
              >
                {sector.name}
              </Select.Option>
            ))}
        </Select>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {sectorId ? t("Save changes") : t("Add sector")}
        </Button>
      </Form.Item>
    </Form>
  );
}

export default SectorAddEditForm;
