import { Group, Image, Title } from "@mantine/core";

export default function Logo() {
  return (
    <Group>
      <Image
        fit="contain"
        src="/favicon-96x96.png"
        width="auto"
        height={40}
        style={{ width: "auto" }}
      />
      <Title order={1} size="1.5rem">
        Buho Stocks
      </Title>
    </Group>
  );
}
