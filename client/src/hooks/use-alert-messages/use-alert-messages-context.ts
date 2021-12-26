import { useCallback, useState } from "react";
import { AlertMessagesContextType } from "contexts/alert-messages";
import {
  IAlertMessageFormFields,
  IAlertMessageType
} from "types/alert-message";

export function useAlertMessagesContext(): AlertMessagesContextType {
  const [messages, setMessages] = useState<any[] | []>([]);

  const create = useCallback(
    (newValues: IAlertMessageFormFields) => {
      setMessages([...messages, { ...newValues, id: messages.length }]);
    },
    [messages]
  );

  const createSuccess = useCallback(
    (text: string) => {
      create({ text, type: IAlertMessageType.Success });
    },
    [create]
  );

  const createError = useCallback(
    (text: string) => {
      create({ text, type: IAlertMessageType.Error });
    },
    [create]
  );

  const createInfo = useCallback(
    (text: string) => {
      create({ text, type: IAlertMessageType.Info });
    },
    [create]
  );

  const createWarning = useCallback(
    (text: string) => {
      create({ text, type: IAlertMessageType.Warning });
    },
    [create]
  );

  const deleteById = useCallback(
    (id: number) => {
      const index = messages
        .map((x) => {
          return x.id;
        })
        .indexOf(id);
      const newMessages = [...messages];
      newMessages.splice(index, 1);

      setMessages(newMessages);
    },
    [messages]
  );

  return {
    messages,
    create,
    createSuccess,
    createError,
    createInfo,
    createWarning,
    deleteById
  };
}

export default useAlertMessagesContext;
