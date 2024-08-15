import { useTranslation } from "react-i18next";
import { Group, rem, Text } from "@mantine/core";
import { Dropzone, FileWithPath, MIME_TYPES } from "@mantine/dropzone";
import { IconFileSpreadsheet, IconUpload, IconX } from "@tabler/icons-react";

interface Props {
  onComplete: (fileData: string[][]) => void;
}

export default function DragAndDropCsvParser({ onComplete }: Props) {
  const { t } = useTranslation();

  const handleCsvDrop = (files: FileWithPath[]) => {
    // Read the content of the file
    files.map((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const csvData: string[][] = [];
        const lines = (e.target?.result as string).split("\n");
        lines.forEach((line) => {
          // In some cases, there are lines which contains values in quotes: "2024-07-09,03:11:59"
          // In these cases, we need to split the line by the delimiter, but only if the delimiter is not inside quotes.
          const regex = /(".*?"|[^",]+)(?=\s*,|\s*$)/g;
          const matches = line.match(regex);
          if (matches) {
            const values = matches.map((match) => match.replace(/"/g, ""));
            csvData.push(values);
            return;
          }
        });
        onComplete(csvData);
      };
      reader.readAsText(file);
    });
  };

  return (
    <Dropzone accept={[MIME_TYPES.csv]} onDrop={handleCsvDrop} maxFiles={1}>
      <Group
        justify="center"
        gap="xl"
        mih={220}
        style={{ pointerEvents: "none" }}
      >
        <Dropzone.Accept>
          <IconUpload
            style={{
              width: rem(52),
              height: rem(52),
              color: "var(--mantine-color-blue-6)",
            }}
            stroke={1.5}
          />
        </Dropzone.Accept>
        <Dropzone.Reject>
          <IconX
            style={{
              width: rem(52),
              height: rem(52),
              color: "var(--mantine-color-red-6)",
            }}
            stroke={1.5}
          />
        </Dropzone.Reject>
        <Dropzone.Idle>
          <IconFileSpreadsheet
            style={{
              width: rem(52),
              height: rem(52),
              color: "var(--mantine-color-dimmed)",
            }}
            stroke={1.5}
          />
        </Dropzone.Idle>

        <div>
          <Text size="xl" inline>
            {t(
              "Click or drag here a .csv file generated from the Interactive Brokers reports.",
            )}
          </Text>
          <Text size="sm" c="dimmed" inline mt={7}>
            {t(
              "If you have more than one portfolio, during the generation, select the option 'concatenate reports'.",
            )}
          </Text>
        </div>
      </Group>
    </Dropzone>
  );
}
