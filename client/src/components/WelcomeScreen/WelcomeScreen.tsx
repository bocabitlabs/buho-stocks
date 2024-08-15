import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Checkbox,
  List,
  Modal,
  rem,
  ThemeIcon,
  Text,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import {
  IconCheck,
  IconCircleCheck,
  IconCircleDashed,
} from "@tabler/icons-react";
import { useInitializeBenchmarks } from "hooks/use-benchmarks/use-benchmarks";
import { useInitializeCurrencies } from "hooks/use-currencies/use-currencies";
import { useInitializeMarkets } from "hooks/use-markets/use-markets";
import { useInitializeSectors } from "hooks/use-sectors/use-sectors";
import {
  useSettings,
  useUpdateSettings,
} from "hooks/use-settings/use-settings";

interface FormProps {
  initBenchmarks: boolean;
  initCurrencies: boolean;
  initMarkets: boolean;
  initSectors: boolean;
  doNotShowWelcomeScreen: boolean;
}

export default function WelcomeScreen() {
  const { t } = useTranslation();
  const { data } = useSettings();
  const [opened, { open, close }] = useDisclosure(false);
  const { mutate: initializeBenchmarks, isSuccess: isSuccessBenchmarks } =
    useInitializeBenchmarks();
  const { mutate: initializeMarkets, isSuccess: isSuccessMarkets } =
    useInitializeMarkets();
  const { mutate: initializeCurrencies, isSuccess: isSuccessCurrencies } =
    useInitializeCurrencies();
  const { mutate: initializeSectors, isSuccess: isSuccessSectors } =
    useInitializeSectors();
  const { mutate: updateSettings, isSuccess } = useUpdateSettings({
    onSuccess: () => {
      close();
    },
  });

  const form = useForm<FormProps>({
    initialValues: {
      initBenchmarks: false,
      initCurrencies: false,
      initMarkets: false,
      initSectors: false,
      doNotShowWelcomeScreen: false,
    },
  });

  const onFormSubmit = (values: FormProps) => {
    console.log("values", values);
    if (values.initBenchmarks) {
      initializeBenchmarks();
    }
    if (values.initCurrencies) {
      initializeCurrencies();
    }
    if (values.initMarkets) {
      initializeMarkets();
    }
    if (values.initSectors) {
      initializeSectors();
    }
    if (values.doNotShowWelcomeScreen) {
      updateSettings({
        newSettings: {
          displayWelcome: !values.doNotShowWelcomeScreen,
        },
      });
    }
  };

  useEffect(() => {
    if (data?.displayWelcome) {
      open();
    }
  }, [data, open]);

  if (data?.displayWelcome) {
    return (
      <Modal
        opened={opened}
        onClose={close}
        title={<Title order={3}>{t("Welcome to Buho Stocks")}</Title>}
        size="lg"
      >
        <Text>{t("WELCOME_MESSAGE1")}</Text>
        <Text mt={"sm"}>{t("WELCOME_MESSAGE2")}</Text>
        <Text mt={"sm"}>{t("WELCOME_MESSAGE3")}</Text>
        <form onSubmit={form.onSubmit(onFormSubmit)}>
          <List mt="md" spacing="xs" size="sm" center>
            <List.Item
              icon={
                isSuccessBenchmarks ? (
                  <ThemeIcon color="teal" size={24} radius="xl">
                    <IconCircleCheck
                      style={{ width: rem(16), height: rem(16) }}
                    />
                  </ThemeIcon>
                ) : (
                  <ThemeIcon color="gray" size={24} radius="xl">
                    <IconCircleDashed
                      style={{ width: rem(16), height: rem(16) }}
                    />
                  </ThemeIcon>
                )
              }
            >
              <Checkbox
                label={t("Initialize benchmarks")}
                {...form.getInputProps("initBenchmarks", {
                  type: "checkbox",
                })}
              />
            </List.Item>
            <List.Item
              icon={
                isSuccessCurrencies ? (
                  <ThemeIcon color="teal" size={24} radius="xl">
                    <IconCircleCheck
                      style={{ width: rem(16), height: rem(16) }}
                    />
                  </ThemeIcon>
                ) : (
                  <ThemeIcon color="gray" size={24} radius="xl">
                    <IconCircleDashed
                      style={{ width: rem(16), height: rem(16) }}
                    />
                  </ThemeIcon>
                )
              }
            >
              <Checkbox
                label={t("Initialize currencies")}
                {...form.getInputProps("initCurrencies", {
                  type: "checkbox",
                })}
              />
            </List.Item>
            <List.Item
              icon={
                isSuccessMarkets ? (
                  <ThemeIcon color="teal" size={24} radius="xl">
                    <IconCircleCheck
                      style={{ width: rem(16), height: rem(16) }}
                    />
                  </ThemeIcon>
                ) : (
                  <ThemeIcon color="gray" size={24} radius="xl">
                    <IconCircleDashed
                      style={{ width: rem(16), height: rem(16) }}
                    />
                  </ThemeIcon>
                )
              }
            >
              <Checkbox
                label={t("Initialize markets")}
                {...form.getInputProps("initMarkets", {
                  type: "checkbox",
                })}
              />
            </List.Item>
            <List.Item
              icon={
                isSuccessSectors ? (
                  <ThemeIcon color="teal" size={24} radius="xl">
                    <IconCircleCheck
                      style={{ width: rem(16), height: rem(16) }}
                    />
                  </ThemeIcon>
                ) : (
                  <ThemeIcon color="gray" size={24} radius="xl">
                    <IconCircleDashed
                      style={{ width: rem(16), height: rem(16) }}
                    />
                  </ThemeIcon>
                )
              }
            >
              <Checkbox
                label={t("Initialize sectors")}
                {...form.getInputProps("initSectors", {
                  type: "checkbox",
                })}
              />
            </List.Item>
          </List>
          <Checkbox
            mt="lg"
            description={t("You can always enable this screen in the settings")}
            label={t("Do not display this screen again")}
            {...form.getInputProps("doNotShowWelcomeScreen", {
              type: "checkbox",
            })}
          />

          <Button
            leftSection={isSuccess && <IconCheck />}
            type="submit"
            variant="filled"
            mt={"lg"}
            disabled={isSuccess}
          >
            {t("Submit")}
          </Button>
        </form>
      </Modal>
    );
  }
  return null;
}
