import { Box } from "@mantine/core";
import { PACKAGE_VERSION } from "version";

export default function PageFooter() {
  return (
    <Box style={{ textAlign: "center" }}>
      Buho Stocks {PACKAGE_VERSION} - Bocabitlabs ©2021 -{" "}
      {new Date().getFullYear()}
    </Box>
  );
}
