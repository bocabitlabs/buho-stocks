import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActionIcon,
  Button,
  Group,
  Menu,
  rem,
  Title,
  useMantineTheme,
} from "@mantine/core";
import {
  IconChevronDown,
  IconDatabaseImport,
  IconPlus,
} from "@tabler/icons-react";
import SectorFormProvider from "../SectorForm/SectorFormProvider";
import { useInitializeSectors } from "hooks/use-sectors/use-sectors";

function SectorsPageHeader() {
  const { t } = useTranslation();
  const theme = useMantineTheme();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCreatingSuperSector, setIsCreatingSuperSector] = useState(false);
  const { mutate: initializeSectors, isPending: isInitializingSectors } =
    useInitializeSectors();

  const showModal = (isSuperSector: boolean) => {
    setIsModalVisible(true);
    setIsCreatingSuperSector(isSuperSector);
  };

  const onClose = () => {
    setIsModalVisible(false);
  };

  return (
    <Group justify="space-between">
      <Title order={1} textWrap="pretty">
        {t("Sectors")}
      </Title>
      <Group wrap="nowrap" gap={0}>
        <Button
          leftSection={<IconPlus />}
          style={{
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
          }}
          onClick={() => showModal(false)}
        >
          {t("Add sector")}
        </Button>
        <Menu
          transitionProps={{ transition: "pop" }}
          position="bottom-start"
          withinPortal
        >
          <Menu.Target>
            <ActionIcon
              variant="filled"
              color={theme.primaryColor}
              size={36}
              style={{
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
              }}
            >
              <IconChevronDown
                style={{ width: rem(16), height: rem(16) }}
                stroke={1.5}
              />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={
                <IconPlus
                  style={{ width: rem(16), height: rem(16) }}
                  stroke={1.5}
                  color={theme.colors.blue[5]}
                />
              }
              onClick={() => showModal(true)}
            >
              {t("Add super sector")}
            </Menu.Item>
            <Menu.Item
              leftSection={
                <IconDatabaseImport
                  style={{ width: rem(16), height: rem(16) }}
                  stroke={1.5}
                  color={theme.colors.blue[5]}
                />
              }
              onClick={() => initializeSectors()}
              disabled={isInitializingSectors}
            >
              {t("Initialize sectors")}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
        <SectorFormProvider
          isSuperSector={isCreatingSuperSector}
          isVisible={isModalVisible}
          onCloseCallback={onClose}
        />
      </Group>
    </Group>
  );
}

export default SectorsPageHeader;
