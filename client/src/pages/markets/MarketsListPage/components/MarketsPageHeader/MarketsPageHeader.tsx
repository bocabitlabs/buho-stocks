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
import MarketAddEditForm from "../MarketAddEditForm/MarketAddEditForm";
import { useInitializeMarkets } from "hooks/use-markets/use-markets";

function MarketsPageHeader() {
  const { t } = useTranslation();
  const theme = useMantineTheme();
  const { mutate: initializeMarkets, isLoading: isInitializingMarkets } =
    useInitializeMarkets();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const handleClose = () => {
    hideModal();
  };

  return (
    <Group justify="space-between">
      <Title order={1} textWrap="pretty">
        {t("Markets")}
      </Title>
      <Group wrap="nowrap" gap={0}>
        <Button
          leftSection={<IconPlus />}
          style={{
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
          }}
          onClick={showModal}
        >
          {t("Add Market")}
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
                <IconDatabaseImport
                  style={{ width: rem(16), height: rem(16) }}
                  stroke={1.5}
                  color={theme.colors.blue[5]}
                />
              }
              onClick={() => initializeMarkets()}
              disabled={isInitializingMarkets}
            >
              {t("Initialize markets")}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
      <MarketAddEditForm
        onCloseCallback={handleClose}
        isVisible={isModalVisible}
      />
    </Group>
  );
}

export default MarketsPageHeader;
