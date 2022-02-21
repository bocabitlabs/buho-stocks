import { toast } from "react-toastify";
import { useSettings } from "hooks/use-settings/use-settings";
import i18n from "i18n";

function LanguageLoader() {
  useSettings({
    onSuccess: (data: any) => {
      i18n.changeLanguage(data?.language);
    },
    onError: () => {
      toast.error("Unable to load settings");
    },
  });
  return null;
}

export default LanguageLoader;
