import { useContext } from "react";
import { AlertMessagesContext } from "contexts/alert-messages";
import { useSettings } from "hooks/use-settings/use-settings";
import i18n from "i18n";

function LanguageLoader() {
  const { createError } = useContext(AlertMessagesContext);

  useSettings({
    onSuccess: (data: any) => {
      i18n.changeLanguage(data?.language);
    },
    onError: (error: any) => {
      createError(error);
    },
  });
  return null;
}

export default LanguageLoader;
