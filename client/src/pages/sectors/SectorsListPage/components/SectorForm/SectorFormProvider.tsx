import { useTranslation } from "react-i18next";
import { Alert, Loader } from "@mantine/core";
import SectorAddEditForm from "./SectorForm";
import {
  useAddSector,
  useSector,
  useUpdateSector,
} from "hooks/use-sectors/use-sectors";
import {
  useAddSuperSector,
  useSuperSector,
  useUpdateSuperSector,
  useSuperSectors,
} from "hooks/use-sectors/use-super-sectors";
import { ISectorFormFields } from "types/sector";

interface Props {
  sectorId?: number;
  superSectorId?: number;
  isUpdate?: boolean;
  isVisible: boolean;
  isSuperSector?: boolean;
  onCloseCallback: () => void;
}

function SectorFormProvider({
  sectorId,
  superSectorId,
  isVisible,
  isUpdate = false,
  isSuperSector = false,
  onCloseCallback,
}: Readonly<Props>) {
  const { t } = useTranslation();
  const { data: superSectors } = useSuperSectors({});

  const {
    data: sector,
    error: errorFetchingSector,
    isFetching: fetchingSector,
  } = useSector(sectorId);

  const {
    data: superSector,
    error: errorFetchingSuperSector,
    isFetching: fetchingSuperSector,
  } = useSuperSector(superSectorId);

  const onSuccess = () => {
    onCloseCallback();
  };

  const { mutate: createSector } = useAddSector({
    onSuccess,
  });
  const { mutate: updateSector } = useUpdateSector({
    onSuccess,
  });

  const { mutate: createSuperSector } = useAddSuperSector({
    onSuccess,
  });
  const { mutate: updateSuperSector } = useUpdateSuperSector({
    onSuccess,
  });

  const onSubmitCallback = (values: ISectorFormFields) => {
    if (isUpdate) {
      if (isSuperSector) {
        updateSuperSector({ id: superSectorId, newSector: values });
      } else {
        updateSector({ id: sectorId, newSector: values });
      }
    } else if (isSuperSector) {
      createSuperSector(values);
    } else {
      createSector(values);
    }
  };

  if (fetchingSector || fetchingSuperSector) {
    return <Loader color="blue" type="dots" />;
  }

  if (errorFetchingSector || errorFetchingSuperSector) {
    return (
      <Alert title={t("Unable to load sector")} color="red">
        {errorFetchingSector?.message}
        {errorFetchingSuperSector?.message}
      </Alert>
    );
  }

  const data = isSuperSector ? superSector : sector;

  if (superSectors) {
    return (
      <SectorAddEditForm
        id={sectorId}
        data={data}
        isUpdate={isUpdate}
        isVisible={isVisible}
        isSuperSector={isSuperSector}
        onCloseCallback={onCloseCallback}
        onSubmitCallback={onSubmitCallback}
        superSectors={superSectors.results}
      />
    );
  }
  return null;
}

export default SectorFormProvider;
