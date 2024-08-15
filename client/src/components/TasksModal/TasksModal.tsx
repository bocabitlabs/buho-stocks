import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useWebSocket, { ReadyState } from "react-use-websocket";
import {
  ActionIcon,
  Button,
  Modal,
  Progress,
  Stack,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconClockHour3, IconWifi, IconWifiOff } from "@tabler/icons-react";
import {
  ITaskDetails,
  ITaskResult,
  ITaskResultWrapper,
} from "types/task-result";

function TasksModal() {
  // List of tasks and their statuses
  const [tasks, setTasks] = useState<ITaskResult[]>([]);
  const { t } = useTranslation();
  const [opened, { open, close }] = useDisclosure(false);

  // URL must be set in .env file or if it is empty, get the current URL base
  // Env variables are injected at build time
  const baseUrl = import.meta.env.VITE_API_URL || window.location.origin;
  const websocketUrl = `${baseUrl}/ws/tasks/`;

  const { lastJsonMessage, readyState } = useWebSocket<ITaskResultWrapper>(
    websocketUrl,
    {
      share: false,
      shouldReconnect: () => true,
    },
  );

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
      return t("Error");
    }
    if (status === "COMPLETED") {
      return t("Completed");
    }
    return t("Active");
  };

  useEffect(() => {
    if (lastJsonMessage) {
      updateTaskProgress(
        lastJsonMessage.status.task_id,
        lastJsonMessage.status.task_name,
        lastJsonMessage.status.progress,
        lastJsonMessage.status.status,
        lastJsonMessage.status.details,
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
            <IconClockHour3 style={{ width: "70%", height: "70%" }} />
          ) : (
            <IconWifi style={{ width: "70%", height: "70%" }} />
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
                  <Text size="xs" variant="secondary">
                    {t("Status")}: {t(getProgressStatus(task.status))}
                  </Text>
                  <Text variant="secondary" size="xs">
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
      <IconWifiOff style={{ width: "70%", height: "70%" }} />
    </ActionIcon>
  );
}

export default TasksModal;
