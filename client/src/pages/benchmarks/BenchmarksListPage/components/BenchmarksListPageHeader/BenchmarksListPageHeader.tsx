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
import BenchmarkFormProvider from "../BenchmarkForm/BenchmarkFormProvider";
import { useInitializeBenchmarks } from "hooks/use-benchmarks/use-benchmarks";

function BenchmarksListPageHeader() {
  const { t } = useTranslation();
  const { mutate: initializeBenchmarks, isPending: isInitializingBenchmarks } =
    useInitializeBenchmarks();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const theme = useMantineTheme();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const onClose = () => {
    setIsModalVisible(false);
  };

  return (
    <Group justify="space-between">
      <Title order={1} textWrap="pretty">
        {t("Benchmarks")}
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
          {t("Add Benchmark")}
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
              onClick={() => initializeBenchmarks()}
              disabled={isInitializingBenchmarks}
            >
              {t("Initialize benchmarks")}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
      <BenchmarkFormProvider
        isVisible={isModalVisible}
        onCloseCallback={onClose}
      />
    </Group>
  );
}

export default BenchmarksListPageHeader;
