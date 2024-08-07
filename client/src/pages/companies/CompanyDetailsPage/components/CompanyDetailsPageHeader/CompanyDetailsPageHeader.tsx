import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import {
  ActionIcon,
  Anchor,
  Breadcrumbs,
  Button,
  Group,
  Modal,
  Stack,
  Title,
  Image,
  Text,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconEdit, IconTrash, IconWorld } from "@tabler/icons-react";
import CompanyFormProvider from "../CompanyForm/CompanyFormProvider";
import CountryFlag from "components/CountryFlag/CountryFlag";
import { useDeleteCompany } from "hooks/use-companies/use-companies";
import { ICompany } from "types/company";

interface Props {
  company: ICompany;
}

function CompanyDetailsPageHeader({ company }: Props) {
  const { t } = useTranslation();
  const { id, companyId } = useParams();
  const portfolioId = id ? parseInt(id, 10) : undefined;
  const companyIdNumber = companyId ? parseInt(companyId, 10) : undefined;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteModalOpen, { open: openDeleteModal, close: closeDeleteModal }] =
    useDisclosure(false);
  const routes = [
    {
      href: "/",
      title: t("Home"),
      id: "home",
    },
    {
      href: `/portfolios/${id}`,
      title: company.portfolio.name,
      id: "portfolio",
    },
    {
      href: `/portfolios/${id}/companies/${companyId}`,
      title: company.name,
      id: "company",
    },
  ].map((item) => (
    <Anchor href={item.href} key={item.id}>
      {item.title}
    </Anchor>
  ));
  const { mutate: deleteCompany } = useDeleteCompany();

  function confirmDelete() {
    deleteCompany({ portfolioId: +id!, companyId: +companyId! });
    setIsModalVisible(false);
  }

  const showModal = () => {
    setIsModalVisible(true);
  };

  const onCloseCallback = () => {
    setIsModalVisible(false);
  };

  const onDeleteCloseCallback = () => {
    closeDeleteModal();
  };

  return (
    <Stack>
      <Breadcrumbs>{routes}</Breadcrumbs>

      <Group justify="space-between">
        <Group>
          <Image radius="md" src={company.logo} h={100} w={100} />
          <Stack justify="flex-start" gap="xs">
            <Title order={1} textWrap="pretty">
              {company.name}
            </Title>
            <Text>
              {company.market.name}: {company.ticker}{" "}
              <CountryFlag
                code={company.countryCode}
                key={company.countryCode}
                width={20}
              />
            </Text>
            <Group>
              <Stack gap="xs" justify="center">
                <Text c="dimmed" size="sm">
                  {t("Sector")}
                </Text>
                <Text size="sm">{t(company.sector.name)}</Text>
              </Stack>
              <Stack gap="xs" justify="center">
                <Text c="dimmed" size="sm">
                  {t("Super Sector")}
                </Text>
                <Text size="sm">
                  {company.sector.superSector &&
                    t(company.sector.superSector.name)}
                </Text>
              </Stack>
              <Stack gap="xs" justify="center">
                <Text c="dimmed" size="sm">
                  {t("Currencies")}
                </Text>
                <Text size="sm">
                  <Tooltip label={t("Company base currency")}>
                    <span>{company.baseCurrency.code}</span>
                  </Tooltip>{" "}
                  /{" "}
                  <Tooltip label={t("Dividends currency")}>
                    <span>{company.dividendsCurrency.code}</span>
                  </Tooltip>
                </Text>
              </Stack>
              <Stack gap="xs" justify="center">
                <Text c="dimmed" size="sm">
                  {t("ISIN")}
                </Text>
                <Text size="sm">{company.isin}</Text>
              </Stack>
            </Group>
          </Stack>
        </Group>
        <Stack justify="flex-end">
          <Group>
            <ActionIcon
              variant="default"
              aria-label={t("Company website")}
              component="a"
              href={company.url}
              target="_blank"
            >
              <IconWorld />
            </ActionIcon>
            <Button
              variant="default"
              aria-label={t("Edit company")}
              onClick={showModal}
              leftSection={<IconEdit />}
            >
              {t("Edit company")}
            </Button>
            <ActionIcon
              variant="default"
              aria-label={t("Delete company")}
              onClick={openDeleteModal}
              color="red"
            >
              <IconTrash
                color="red"
                style={{ width: "70%", height: "70%" }}
                stroke={1.5}
              />
            </ActionIcon>
          </Group>
        </Stack>

        {portfolioId && (
          <CompanyFormProvider
            portfolioId={portfolioId}
            companyId={companyIdNumber}
            isVisible={isModalVisible}
            isUpdate
            onCloseCallback={onCloseCallback}
          />
        )}
        <Modal
          opened={deleteModalOpen}
          onClose={onCloseCallback}
          title={t("Delete company")}
        >
          {t("Are you sure you want to delete this company?")}
          <Group>
            <Button disabled={!companyId} onClick={() => confirmDelete()}>
              {t("Yes")}
            </Button>
            <Button onClick={onDeleteCloseCallback}>{t("No")}</Button>
          </Group>
        </Modal>
      </Group>
    </Stack>
  );
}

export default CompanyDetailsPageHeader;
