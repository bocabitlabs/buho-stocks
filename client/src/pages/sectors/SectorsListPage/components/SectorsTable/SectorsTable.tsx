import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Group, Menu, Modal, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  MantineReactTable,
  MRT_ColumnDef,
  MRT_Localization,
  MRT_PaginationState,
  MRT_Row,
  useMantineReactTable,
} from "mantine-react-table";
import SectorFormProvider from "../SectorForm/SectorFormProvider";
import { useDeleteSector, useSectors } from "hooks/use-sectors/use-sectors";
import { ISector } from "types/sector";

interface Props {
  mrtLocalization: MRT_Localization;
}

function NameCell({ row }: Readonly<{ row: MRT_Row<ISector> }>) {
  const { t } = useTranslation();
  return (
    <Text size="sm" fw={700}>
      {t(row.original.name)}
    </Text>
  );
}

export default function SectorsTable({ mrtLocalization }: Props) {
  const { t } = useTranslation();
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const {
    data: sectorsData,
    isError,
    isFetching,
    isLoading,
  } = useSectors({
    pagination,
  });
  const { mutate: deleteSector } = useDeleteSector();
  const [selectedSectorId, setSelectedSectorId] = useState<number | undefined>(
    undefined,
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteModalOpen, { open: openDeleteModal, close: closeDeleteModal }] =
    useDisclosure(false);
  const showModal = (recordId: number) => {
    setSelectedSectorId(recordId);
    setIsModalVisible(true);
  };

  const showDeleteModal = (recordId: number) => {
    setSelectedSectorId(recordId);
    openDeleteModal();
  };

  const confirmDelete = async (recordId: number | undefined) => {
    if (!recordId) return;
    deleteSector(recordId);
    setSelectedSectorId(undefined);
    closeDeleteModal();
  };

  const onCloseCallback = () => {
    setIsModalVisible(false);
    setSelectedSectorId(undefined);
  };

  const onDeleteCloseCallback = () => {
    closeDeleteModal();
    setSelectedSectorId(undefined);
  };

  const columns = useMemo<MRT_ColumnDef<ISector>[]>(
    () => [
      {
        accessorKey: "name",
        header: t("Name"),
        Cell: NameCell,
      },
      {
        accessorKey: "superSector.name",
        header: t("Super Sector"),
      },
    ],
    [t],
  );

  const fetchedSectors = sectorsData?.results ?? [];
  const totalRowCount = sectorsData?.count ?? 0;

  const table = useMantineReactTable({
    columns,
    data: fetchedSectors, // must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
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
          children: "Error loading data",
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
      <SectorFormProvider
        sectorId={selectedSectorId}
        isUpdate
        isVisible={isModalVisible}
        onCloseCallback={onCloseCallback}
      />
      <Modal
        opened={deleteModalOpen}
        onClose={closeDeleteModal}
        title={t("Delete sector")}
      >
        <Text>{t("Are you sure you want to delete this sector?")}</Text>
        <Group mt="md">
          <Button
            disabled={!selectedSectorId}
            onClick={() => confirmDelete(selectedSectorId)}
          >
            {t("Yes")}
          </Button>
          <Button onClick={onDeleteCloseCallback}>{t("No")}</Button>
        </Group>
      </Modal>
    </div>
  );
}
