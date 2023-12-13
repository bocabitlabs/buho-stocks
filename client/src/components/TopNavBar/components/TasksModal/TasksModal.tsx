import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useWebSocket, { ReadyState } from "react-use-websocket";
import {
  ApiOutlined,
  LoadingOutlined,
  RightSquareOutlined,
} from "@ant-design/icons";
import { Button, Modal, Progress, Space, Typography } from "antd";
import { useSettings } from "hooks/use-settings/use-settings";
import { ITaskResult } from "types/task-result";

function TasksModal() {
  // List of tasks and their statuses
  const [tasks, setTasks] = useState<ITaskResult[]>([]);
  const { t } = useTranslation();
  const [isTasksModalOpen, setIsTasksModalOpen] = useState(false);
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

  const showTasksModal = () => {
    setIsTasksModalOpen(true);
  };

  const handleTasksOk = () => {
    setIsTasksModalOpen(false);
  };

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
    details: string,
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
        <Button
          style={{ marginLeft: 10 }}
          type="default"
          icon={
            tasks.filter(
              (task: ITaskResult) =>
                task.status !== "COMPLETED" && task.status !== "FAILED",
            ).length > 0 ? (
              <LoadingOutlined />
            ) : (
              <RightSquareOutlined />
            )
          }
          onClick={showTasksModal}
        />
        <Modal
          title={t("Tasks")}
          open={isTasksModalOpen}
          onCancel={handleTasksOk}
          footer={[
            <Button key="clear" onClick={clearCompletedTasksList}>
              {t("Clear completed tasks")}
            </Button>,
            <Button key="submit" type="primary" onClick={handleTasksOk}>
              {t("Close")}
            </Button>,
          ]}
        >
          <Space direction="vertical" style={{ display: "flex" }}>
            {tasks.length === 0 && (
              <Typography.Text>{t("No tasks")}</Typography.Text>
            )}
            {tasks.length > 0 &&
              tasks.map((task: ITaskResult) => (
                <div key={task.task_id}>
                  <Typography.Text>{task.task_name}:</Typography.Text>
                  <Progress
                    percent={task.progress}
                    status={getProgressStatus(task.status)}
                  />
                  <Typography.Text type="secondary">
                    {task.details}
                  </Typography.Text>
                </div>
              ))}
          </Space>
        </Modal>
      </>
    );
  }

  return (
    <Button title={t<string>("Websocket disconnected")}>
      <ApiOutlined />
    </Button>
  );
}

export default TasksModal;
