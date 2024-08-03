import {
  Affix,
  Button,
  Grid,
  Paper,
  rem,
  Stack,
  Transition,
} from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";
import { IconArrowUp } from "@tabler/icons-react";
import ImportFromBrokerPageHeader from "./components/ImportFromBrokerPageHeader/ImportFromBrokerPageHeader";
import ImportSteps from "./components/ImportSteps/ImportSteps";

export default function ImportFromBrokerPage() {
  const [scroll, scrollTo] = useWindowScroll();
  return (
    <Grid p={20}>
      <Grid.Col span={12}>
        <ImportFromBrokerPageHeader />
      </Grid.Col>
      <Grid.Col span={12}>
        <ImportSteps />
        <Affix position={{ bottom: 20, right: 20 }}>
          <Paper p="md" shadow="xs">
            <Stack>
              <Transition transition="slide-up" mounted={scroll.y > 0}>
                {(transitionStyles) => (
                  <Button
                    leftSection={
                      <IconArrowUp
                        style={{ width: rem(16), height: rem(16) }}
                      />
                    }
                    style={transitionStyles}
                    onClick={() => scrollTo({ y: 0 })}
                  >
                    Scroll to top
                  </Button>
                )}
              </Transition>
            </Stack>
          </Paper>
        </Affix>
      </Grid.Col>
    </Grid>
  );
}
