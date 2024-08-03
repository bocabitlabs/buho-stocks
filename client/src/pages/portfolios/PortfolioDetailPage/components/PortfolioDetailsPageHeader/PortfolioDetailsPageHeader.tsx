import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import {
  ActionIcon,
  Anchor,
  Breadcrumbs,
  Button,
  Group,
  Modal,
  Paper,
  Stack,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconChartBar,
  IconList,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import CountryFlag from "components/CountryFlag/CountryFlag";
import { useDeletePortfolio } from "hooks/use-portfolios/use-portfolios";
import CompanyFormProvider from "pages/companies/CompanyDetailsPage/components/CompanyForm/CompanyFormProvider";

interface Props {
  portfolioName: string;
  portfolioDescription: string;
  portfolioCountryCode: string;
}

function PortfolioDetailsPageHeader({
  portfolioName,
  portfolioDescription,
  portfolioCountryCode,
}: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const portfolioId = id ? parseInt(id, 10) : undefined;
  const { mutate: deletePortfolio } = useDeletePortfolio();
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
      title: portfolioName,
      id: "portfolio",
    },
  ].map((item) => (
    <Anchor href={item.href} key={item.id}>
      {item.title}
    </Anchor>
  ));
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const onDeleteCloseCallback = () => {
    closeDeleteModal();
  };

  const onCloseCallback = () => {
    setIsModalVisible(false);
  };

  const confirmDelete = async () => {
    deletePortfolio({ portfolioId: +id! });
    navigate(-1);
  };

  return (
    <Stack>
      <Breadcrumbs>{routes}</Breadcrumbs>
      <Group justify="space-between">
        <Group>
          <Title order={1}>
            {portfolioName}{" "}
            <CountryFlag
              code={portfolioCountryCode}
              key={portfolioCountryCode}
              width={30}
            />
          </Title>
        </Group>
        <Group>
          <ActionIcon
            variant="default"
            onClick={() => {
              navigate("logs");
            }}
            title={t<string>("View portfolio logs")}
          >
            <IconList style={{ width: "70%", height: "70%" }} stroke={1.5} />
          </ActionIcon>
          <ActionIcon
            variant="default"
            onClick={() => {
              navigate("charts");
            }}
            title={t<string>("View portfolio charts")}
          >
            <IconChartBar
              style={{ width: "70%", height: "70%" }}
              stroke={1.5}
            />
          </ActionIcon>
          <Button
            variant="default"
            key="company-add-header"
            leftSection={<IconPlus />}
            onClick={showModal}
          >
            {t("Add Company")}
          </Button>
          <ActionIcon
            variant="default"
            aria-label={t("Delete portfolio")}
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
        {portfolioId && (
          <CompanyFormProvider
            portfolioId={portfolioId}
            isVisible={isModalVisible}
            onCloseCallback={onCloseCallback}
          />
        )}

        <Modal
          opened={deleteModalOpen}
          onClose={onCloseCallback}
          title={t("Delete portfolio")}
        >
          {t("Are you sure you want to delete this portfolio?")}
          <Group>
            <Button disabled={!portfolioId} onClick={() => confirmDelete()}>
              {t("Yes")}
            </Button>
            <Button onClick={onDeleteCloseCallback}>{t("No")}</Button>
          </Group>
        </Modal>
      </Group>
      <Paper p="lg" shadow="xs">
        {portfolioDescription}
      </Paper>
    </Stack>
    // <PageHeader
    //   className="site-page-header"
    //   style={{
    //     background: token.colorBgContainer,
    //   }}
    //   title={<Typography.Title level={2}>{portfolioName}</Typography.Title>}
    //   tags={[
    //     <CountryFlag
    //       code={portfolioCountryCode}
    //       key={portfolioCountryCode}
    //       width={20}
    //     />,
    //   ]}
    //   extra={[
    //     <Button
    //       key="company-view-logs"
    //       icon={<UnorderedListOutlined />}
    //       onClick={() => {
    //         navigate(`log`);
    //       }}
    //       title={t<string>("View portfolio logs")}
    //     />,
    //     <Button
    //       key="company-view-charts"
    //       icon={<LineChartOutlined />}
    //       onClick={() => {
    //         navigate(`charts`);
    //       }}
    //       title={t<string>("View portfolio charts")}
    //     />,
    //     <Button
    //       type="primary"
    //       key="company-add-header"
    //       icon={<PlusOutlined />}
    //       onClick={showModal}
    //     >
    //       {t("Company")}
    //     </Button>,
    //     <Popconfirm
    //       key="portfolio-delete-header"
    //       title="Delete this portfolio?"
    //       onConfirm={() => confirmDelete()}
    //       okText={t("Yes")}
    //       cancelText={t("No")}
    //     >
    //       <Button icon={<DeleteOutlined />} danger>
    //         {t("Delete")}
    //       </Button>
    //     </Popconfirm>,
    //   ]}
    // >
    //   <Typography.Paragraph>{portfolioDescription}</Typography.Paragraph>
    //   {children}
    //   {portfolioId && (
    //     <CompanyFormProvider
    //       portfolioId={portfolioId}
    //       isVisible={isModalVisible}
    //       onCloseCallback={handleClose}
    //     />
    //   )}
    // </PageHeader>
  );
}

export default PortfolioDetailsPageHeader;
