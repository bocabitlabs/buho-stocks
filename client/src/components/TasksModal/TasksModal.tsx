import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { ActionIcon, Progress, rem, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconCheck,
  IconClockHour3,
  IconWifi,
  IconWifiOff,
} from "@tabler/icons-react";
import { ITaskResult, ITaskResultWrapper } from "types/task-result";

const getProgressStatus = (status: string) => {
  if (status === "FAILED") {
    return "Error";
  }
  if (status === "COMPLETED") {
    return "Completed";
  }
  return "Active";
};

const getProgressColor = (status: string) => {
  if (status === "FAILED") {
    return "red";
  }
  if (status === "COMPLETED") {
    return "teal";
  }
  return "blue";
};

function TasksModal() {
  const { t } = useTranslation();

  // URL must be set in .env file or if it is empty, get the current URL base
  // Env variables are injected at build time
  const baseUrl = import.meta.env.VITE_API_URL || window.location.origin;
  const websocketUrl = `${baseUrl}/ws/tasks/`;
  const [messageHistory, setMessageHistory] = useState<ITaskResult[]>([]);

  const { lastJsonMessage, readyState } = useWebSocket<ITaskResultWrapper>(
    websocketUrl,
    {
      share: false,
      shouldReconnect: () => true,
    },
  );

  useEffect(() => {
    if (lastJsonMessage !== null && lastJsonMessage !== undefined) {
      setMessageHistory((prev) => {
        // If the task.id is already in the list, update it, do not add a new one
        const existingMessageIndex = prev.findIndex(
          (msg: ITaskResult) => msg.task_id === lastJsonMessage.status.task_id,
        );

        if (existingMessageIndex !== -1) {
          const updatedMessages = [...prev];
          updatedMessages[existingMessageIndex] = {
            ...lastJsonMessage.status,
            notificationId:
              updatedMessages[existingMessageIndex].notificationId,
          };
          notifications.update({
            id: updatedMessages[existingMessageIndex].notificationId,
            color: getProgressColor(lastJsonMessage.status.status),
            title: `${t(lastJsonMessage.status.task_name)}
             (${lastJsonMessage.status.details.year})`,
            message: (
              <div>
                <Progress value={lastJsonMessage.status.progress} />
                <Text size="xs" variant="secondary">
                  {t("Status")}:{" "}
                  {t(getProgressStatus(lastJsonMessage.status.status))}
                </Text>
                <Text variant="secondary" size="xs">
                  {t(lastJsonMessage.status.details.task_description)}
                  {": "}
                  {lastJsonMessage.status.details.company}
                </Text>
              </div>
            ),
            icon: lastJsonMessage.status.status === "COMPLETED" && (
              <IconCheck style={{ width: rem(18), height: rem(18) }} />
            ),
            withCloseButton: lastJsonMessage.status.status === "COMPLETED",
            loading: lastJsonMessage.status.status === "PROGRESS",
            autoClose: false,
          });
          return updatedMessages;
        }

        const notificationId = notifications.show({
          id: lastJsonMessage.status.task_id,
          color: getProgressColor(lastJsonMessage.status.status),
          loading: true,
          title: `${t(lastJsonMessage.status.task_name)}
              (${lastJsonMessage.status.details.year})`,
          message: (
            <div>
              <Progress value={lastJsonMessage.status.progress} />
              <Text size="xs" variant="secondary">
                {t("Status")}:{" "}
                {t(getProgressStatus(lastJsonMessage.status.status))}
              </Text>
              <Text variant="secondary" size="xs">
                {t(lastJsonMessage.status.details.task_description)}
                {": "}
                {lastJsonMessage.status.details.company}
              </Text>
            </div>
          ),
          autoClose: false,
          withCloseButton: false,
        });
        const updatedMessage = { ...lastJsonMessage.status };
        updatedMessage.notificationId = notificationId;
        prev.push(updatedMessage);
        return prev;
      });
    }
  }, [lastJsonMessage, t]);

  if (readyState === ReadyState.OPEN) {
    if (messageHistory.some((task) => task.status === "PROGRESS")) {
      return (
        <ActionIcon
          style={{ marginLeft: 10 }}
          variant="default"
          loading
          loaderProps={{ type: "dots" }}
        >
          <IconClockHour3 style={{ width: "70%", height: "70%" }} />
        </ActionIcon>
      );
    }

    return (
      <ActionIcon style={{ marginLeft: 10 }} variant="default">
        <IconWifi style={{ width: "70%", height: "70%" }} />
      </ActionIcon>
    );
  }

  return (
    <ActionIcon
      variant="default"
      aria-label={t<string>("Websocket disconnected")}
      style={{ marginLeft: 10 }}
    >
      <IconWifiOff style={{ width: "70%", height: "70%" }} />
    </ActionIcon>
  );
}

export default TasksModal;
