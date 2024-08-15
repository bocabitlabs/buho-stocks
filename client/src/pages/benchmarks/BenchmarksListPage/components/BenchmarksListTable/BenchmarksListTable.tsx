import { useContext, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Group, Loader, Menu, Modal, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  MantineReactTable,
  MRT_ColumnDef,
  MRT_Localization,
  MRT_PaginationState,
  MRT_Row,
  useMantineReactTable,
} from "mantine-react-table";
import BenchmarkDetailsModal from "../BenchmarkDetailsModal/BenchmarkDetailsModal";
import BenchmarkFormProvider from "../BenchmarkForm/BenchmarkFormProvider";
import {
  LanguageContext,
  LanguageProvider,
} from "components/ListLanguageProvider/ListLanguageProvider";
import {
  useBenchmarks,
  useDeleteBenchmark,
} from "hooks/use-benchmarks/use-benchmarks";
import { IBenchmark } from "types/benchmark";

interface Props {
  mrtLocalization: MRT_Localization;
}

interface BenchmarkModalProps {
  id: number;
  isModalVisible: boolean;
  onCancel: () => void;
}

function BenchmarkDetailsModalContent({
  id,
  isModalVisible,
  onCancel,
}: BenchmarkModalProps) {
  const mrtLocalization = useContext(LanguageContext);

  return mrtLocalization ? (
    <BenchmarkDetailsModal
      id={id}
      isModalVisible={isModalVisible}
      onCancel={onCancel}
      mrtLocalization={mrtLocalization}
    />
  ) : (
    <Loader />
  );
}
function LinkCell({ row }: Readonly<{ row: MRT_Row<IBenchmark> }>) {
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [selectedBenchmarkId, setSelectedBenchmarkId] = useState<
    number | undefined
  >(undefined);

  const showDetailsModal = (recordId: number) => {
    setSelectedBenchmarkId(recordId);
    setIsDetailsModalVisible(true);
  };

  const handleDetailsCancel = () => {
    setIsDetailsModalVisible(false);
    setSelectedBenchmarkId(undefined);
  };
  return (
    <>
      <Button
        variant="transparent"
        onClick={() => showDetailsModal(row.original.id)}
      >
        {row.original.name}
      </Button>
      {selectedBenchmarkId && (
        <LanguageProvider>
          <BenchmarkDetailsModalContent
            id={selectedBenchmarkId}
            isModalVisible={isDetailsModalVisible}
            onCancel={handleDetailsCancel}
          />
        </LanguageProvider>
      )}
    </>
  );
}

export default function BenchmarkListTable({ mrtLocalization }: Props) {
  const { t } = useTranslation();
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const { data, isLoading, isError, isFetching } = useBenchmarks({
    pagination,
  });

  const { mutate: deleteBenchmark } = useDeleteBenchmark();
  const [selectedBenchmarkId, setSelectedBenchmarkId] = useState<
    number | undefined
  >(undefined);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteModalOpen, { open: openDeleteModal, close: closeDeleteModal }] =
    useDisclosure(false);

  const showModal = (recordId: number) => {
    setSelectedBenchmarkId(recordId);
    setIsModalVisible(true);
  };
  const showDeleteModal = (recordId: number) => {
    setSelectedBenchmarkId(recordId);
    openDeleteModal();
  };

  const confirmDelete = async (recordId: number | undefined) => {
    if (!recordId) return;
    deleteBenchmark(recordId);
    closeDeleteModal();
  };

  const onCloseCallback = () => {
    setIsModalVisible(false);
    setSelectedBenchmarkId(undefined);
  };

  const onDeleteCloseCallback = () => {
    closeDeleteModal();
    setSelectedBenchmarkId(undefined);
  };

  const columns = useMemo<MRT_ColumnDef<IBenchmark>[]>(
    () => [
      {
        accessorKey: "name", // access nested data with dot notation
        header: t("Name"),
        Cell: LinkCell,
      },
    ],
    [t],
  );

  const fetchedMarkets = data?.results ?? [];
  const totalRowCount = data?.count ?? 0;

  const table = useMantineReactTable({
    columns,
    data: fetchedMarkets,
    enableRowActions: true,
    positionActionsColumn: "last",
    renderRowActionMenuItems: ({ row }) => (
      <>
        <Menu.Item onClick={() => showModal(row.original.id)}>
          {t("Edit")}
        </Menu.Item>
        <Menu.Item onClick={() => showDeleteModal(row.original.id)}>
          {t("Delete")}
        </Menu.Item>
      </>
    ),
    rowCount: totalRowCount,
    manualPagination: true,
    mantineToolbarAlertBannerProps: isError
      ? {
          color: "red",
          children: t("Error loading data"),
        }
      : undefined,
    onPaginationChange: setPagination,
    state: {
      isLoading,
      showAlertBanner: isError,
      showProgressBars: isFetching,
      pagination,
    },
    localization: mrtLocalization,
  });

  return (
    <div>
      <MantineReactTable table={table} />
      <BenchmarkFormProvider
        id={selectedBenchmarkId}
        isVisible={isModalVisible}
        onCloseCallback={onCloseCallback}
        isUpdate
      />
      <Modal
        opened={deleteModalOpen}
        onClose={closeDeleteModal}
        title={t("Delete benchmark")}
      >
        <Text>{t("Are you sure you want to delete this benchmark?")}</Text>
        <Group mt="md">
          <Button
            disabled={!selectedBenchmarkId}
            onClick={() => confirmDelete(selectedBenchmarkId)}
          >
            {t("Yes")}
          </Button>
          <Button onClick={onDeleteCloseCallback}>{t("No")}</Button>
        </Group>
      </Modal>
    </div>
  );
}
