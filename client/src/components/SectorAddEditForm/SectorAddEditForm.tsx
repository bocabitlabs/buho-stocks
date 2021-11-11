import React, { ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Form, Input, Select, Spin, Switch } from "antd";
import ColorSelector from "components/ColorSelector/ColorSelector";
import { useSectorsContext } from "hooks/use-sectors/use-sectors-context";
import { ISector } from "types/sector";

interface AddEditFormProps {
  sectorId?: string;
}

function SectorAddEditForm({
  sectorId
}: AddEditFormProps): ReactElement | null {
  const [form] = Form.useForm();
  const [color, setColor] = useState("#607d8b");
  // const [superSectorId, setSuperSectorId] = useState<number | undefined>(
  //   undefined
  // );
  const { t } = useTranslation();

  const {
    sector,
    superSectors,
    create: addSector,
    createSuperSector,
    getAllSuperSectors,
    getById: getSectorById,
    update: updateSector,
    updateSuperSector
  } = useSectorsContext();

  useEffect(() => {
    if (sectorId) {
      const id: number = +sectorId;
      getSectorById(id);
    }
  }, [sectorId, getSectorById]);

  useEffect(() => {
    const getAll = async () => {
      getAllSuperSectors();
    };
    getAll();
  }, [getAllSuperSectors]);

  useEffect(() => {
    if (sectorId) {
      if (sector) {
        setColor(sector.color);
        // setSuperSectorId(sector.superSector);
      }
    }
  }, [sectorId, sector]);

  const handleSubmit = (values: any) => {
    const { name, isSuperSector, superSectorId } = values;
    const newSector = {
      name,
      color,
      superSector: superSectorId
    };
    console.log(newSector);

    if (isSuperSector) {
      if (sectorId) {
        const id: number = +sectorId;
        updateSuperSector(id, newSector);
      } else if (isSuperSector && !sectorId) {
        createSuperSector(newSector);
      }
      return;
    }

    if (sectorId) {
      const id: number = +sectorId;
      updateSector(id, newSector);
    } else {
      addSector(newSector);
    }
  };

  const handleColorChange = (newColor: any) => {
    setColor(newColor.hex);
  };

  // const handleSuperSectorChange = (id: number) => {
  //   setSuperSectorId(id);
  // };

  if (sectorId && !sector) {
    return <Spin />;
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        name: sector?.name,
        isSuperSector: sector?.isSuperSector,
        superSectorId: sector?.superSector
      }}
    >
      <Form.Item
        name="name"
        label={t("Name")}
        rules={[
          { required: true, message: t("Please input the name of the market") }
        ]}
      >
        <Input type="text" placeholder="NYSE, NASDAQ,..." />
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
      <Form.Item
        label={t("Is a super sector")}
        name="isSuperSector"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {sectorId ? t("Update sector") : t("Add sector")}
        </Button>
      </Form.Item>
    </Form>
  );
}

SectorAddEditForm.defaultProps = {
  sectorId: null
};

export default SectorAddEditForm;
