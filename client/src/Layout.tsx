import { useEffect } from "react";
import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import {
  AppShell,
  Burger,
  Group,
  Loader,
  ScrollArea,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Notifications } from "@mantine/notifications";
import * as Sentry from "@sentry/react";
import Logo from "components/Logo/Logo";
import NavigationLinks from "components/NavigationLinks/NavigationLinks";
import PageFooter from "components/PageFooter/PageFooter";
import TasksModal from "components/TasksModal/TasksModal";
import ToggleThemeButton from "components/ToggleThemeButton/ToggleThemeButton";
import WelcomeScreen from "components/WelcomeScreen/WelcomeScreen";
import config from "config";
import { useSettings } from "hooks/use-settings/use-settings";
import i18n from "i18n";

function Layout() {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  const location = useLocation();
  useEffect(() => {
    close();
  }, [location]);

  const { data, isLoading, error, isError } = useSettings();

  useEffect(() => {
    if (data) {
      i18n.changeLanguage(data?.language);
      // Init Sentry here since the DSN is fetched from the settings
      Sentry.init({
        dsn: data.sentryDsn,
        enabled: data.sentryEnabled,
        environment: config.SENTRY_ENV,

        // Set tracesSampleRate to 1.0 to capture 100%
        // of transactions for performance monitoring.
        // We recommend adjusting this value in production
        tracesSampleRate: 0.5,
      });
    }
  }, [data]);

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <div>{error?.message}</div>;
  }

  if (data) {
    return (
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: "sm",
          collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
        }}
        padding="md"
      >
        <AppShell.Header>
          <Group h="100%" px="md" justify="space-between">
            <Group>
              <Burger
                opened={mobileOpened}
                onClick={toggleMobile}
                hiddenFrom="sm"
                size="sm"
              />
              <Burger
                opened={desktopOpened}
                onClick={toggleDesktop}
                visibleFrom="sm"
                size="sm"
              />
              <Logo />
            </Group>
            <Group visibleFrom="sm">
              <ToggleThemeButton />
              <TasksModal />
            </Group>
          </Group>
        </AppShell.Header>
        <AppShell.Navbar p="md">
          <AppShell.Section hiddenFrom="sm">
            <Group>
              <ToggleThemeButton />
              <TasksModal />
            </Group>
          </AppShell.Section>
          <AppShell.Section my="md" component={ScrollArea}>
            <NavigationLinks />
          </AppShell.Section>
        </AppShell.Navbar>
        <AppShell.Main
          style={{
            backgroundColor: colorScheme === "dark" ? "" : theme.colors.gray[0],
          }}
        >
          <Outlet />
          <PageFooter />
          <WelcomeScreen />
        </AppShell.Main>
        <ScrollRestoration />
        <Notifications />
      </AppShell>
    );
  }
}

export default Layout;
