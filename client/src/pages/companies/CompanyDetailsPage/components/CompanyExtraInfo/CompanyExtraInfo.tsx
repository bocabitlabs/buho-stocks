import { Paper } from "@mantine/core";

interface Props {
  companyDescription: string;
}

export default function CompanyInfo({ companyDescription }: Props) {
  if (companyDescription !== null && companyDescription !== "") {
    return (
      <Paper p="lg" shadow="xs">
        <div dangerouslySetInnerHTML={{ __html: companyDescription }} />
      </Paper>
    );
  }
  return null;
}
