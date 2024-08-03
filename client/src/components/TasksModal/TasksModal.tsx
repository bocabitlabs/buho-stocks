import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useWebSocket, { ReadyState } from "react-use-websocket";
import {
  ActionIcon,
  Button,
  Loader,
  Modal,
  Progress,
  Stack,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlugConnected, IconPlugConnectedX } from "@tabler/icons-react";
import { useSettings } from "hooks/use-settings/use-settings";
import { ITaskDetails, ITaskResult } from "types/task-result";

function TasksModal() {
  // List of tasks and their statuses
  const [tasks, setTasks] = useState<ITaskResult[]>([]);
  const { t } = useTranslation();
  const [opened, { open, close }] = useDisclosure(false);
  const { data: settings } = useSettings();
  const getWebsocketUrl = () => {
    if (settings) {
      // If using https, replace ws with wss
      const wsUrl = `ws://${settings.backendHostname}/ws/tasks/`;
      // Replace ws with wss for https
      if (document.location.protocol === "https:") {
        wsUrl.replace("ws://", "wss://");
      }
      return wsUrl;
    }
    return null;
  };

  const { lastJsonMessage, readyState } = useWebSocket(getWebsocketUrl(), {
    share: false,
    shouldReconnect: () => true,
  });

  const clearCompletedTasksList = () => {
    setTasks((prevTasks: ITaskResult[]) => {
      const updatedTasks = prevTasks.filter(
        (task: ITaskResult) =>
          task.status !== "COMPLETED" && task.status !== "FAILED",
      );

      return updatedTasks;
    });
  };

  const updateTaskProgress = (
    task_id: string,
    task_name: string,
    progress: number,
    status: string,
    details: ITaskDetails,
  ) => {
    setTasks((prevTasks: ITaskResult[]) => {
      const updatedTasks = prevTasks.map((task: ITaskResult) => {
        if (task.task_id === task_id) {
          return { ...task, task_name, details, progress, status };
        }
        return task;
      });

      // If the task_id was not found, add a new task
      if (!updatedTasks.some((task: ITaskResult) => task.task_id === task_id)) {
        updatedTasks.push({ task_id, task_name, details, progress, status });
      }

      return updatedTasks;
    });
  };

  const getProgressStatus = (status: string) => {
    if (status === "FAILED") {
      return "exception";
    }
    if (status === "COMPLETED") {
      return "success";
    }
    return "active";
  };

  useEffect(() => {
    if (lastJsonMessage) {
      const jsonMessage: any = lastJsonMessage;
      updateTaskProgress(
        jsonMessage.status.task_id,
        jsonMessage.status.task_name,
        jsonMessage.status.progress,
        jsonMessage.status.status,
        jsonMessage.status.details,
      );
    }
  }, [lastJsonMessage]);

  if (readyState === ReadyState.OPEN) {
    return (
      <>
        <ActionIcon style={{ marginLeft: 10 }} variant="default" onClick={open}>
          {tasks.filter(
            (task: ITaskResult) =>
              task.status !== "COMPLETED" && task.status !== "FAILED",
          ).length > 0 ? (
            <Loader />
          ) : (
            <IconPlugConnected style={{ width: "70%", height: "70%" }} />
          )}
        </ActionIcon>
        <Modal title={t("Tasks")} opened={opened} onClose={close}>
          <Stack>
            {tasks.length === 0 && <Text>{t("No tasks")}</Text>}
            {tasks.length > 0 &&
              tasks.map((task: ITaskResult) => (
                <div key={task.task_id}>
                  <Text>
                    {t(task.task_name)} ({task.details.year}):
                  </Text>
                  <Progress value={task.progress} />
                  <Text>
                    {t("Status")}: {t(getProgressStatus(task.status))}
                  </Text>
                  <Text variant="secondary">
                    {t(task.details.task_description)} {task.details.company}
                  </Text>
                </div>
              ))}
            <Button key="clear" onClick={clearCompletedTasksList}>
              {t("Clear completed tasks")}
            </Button>
          </Stack>
        </Modal>
      </>
    );
  }

  return (
    <ActionIcon
      variant="default"
      aria-label={t<string>("Websocket disconnected")}
      style={{ marginLeft: 10 }}
    >
      <IconPlugConnectedX style={{ width: "70%", height: "70%" }} />
    </ActionIcon>
  );
}

export default TasksModal;
