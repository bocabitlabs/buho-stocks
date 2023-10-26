import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
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
  const [connected, setConnected] = useState(false);
  const { t } = useTranslation();
  const ws = useRef<any>(null);

  const [isTasksModalOpen, setIsTasksModalOpen] = useState(false);
  const { data: settings } = useSettings();

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

  const reconnectSocket = () => {
    if (!settings) return;
    // If using https, replace ws with wss
    const wsUrl = `ws://${settings.backendHostname}/ws/tasks/`;
    // Replace ws with wss for https
    if (document.location.protocol === "https:") {
      wsUrl.replace("ws://", "wss://");
    }
    console.log(`Connecting to websocket`);
    console.log(wsUrl);
    try {
      ws.current = new WebSocket(wsUrl);
    } catch (e) {
      console.log(e);
      setConnected(false);
    }
  };

  useEffect(() => {
    if (settings) {
      // If using https, replace ws with wss
      const wsUrl = `ws://${settings.backendHostname}/ws/tasks/`;
      // Replace ws with wss for https
      if (document.location.protocol === "https:") {
        wsUrl.replace("ws://", "wss://");
      }
      console.log(`Connecting to websocket`);
      console.log(wsUrl);
      try {
        ws.current = new WebSocket(wsUrl);
      } catch (e) {
        console.log(e);
        setConnected(false);
      }
    }

    const wsCurrent = ws.current;

    return () => {
      if (!settings) return;
      console.log("Disconnecting websocket");
      wsCurrent.close();
    };
  }, [settings]);

  useEffect(() => {
    if (!ws.current) return;

    ws.current.onopen = (event: any) => {
      console.log("Connected", event);
      setConnected(true);
    };

    ws.current.onclose = (event: any) => {
      console.log("Closed", event);
      setConnected(false);
    };

    ws.current.onmessage = (event: any) => {
      const messageData = JSON.parse(event.data);
      console.log(messageData);
      updateTaskProgress(
        messageData.status.task_id,
        messageData.status.task_name,
        messageData.status.progress,
        messageData.status.status,
        messageData.status.details,
      );
    };
  }, []);

  if (connected) {
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
            {tasks.length === 0 && <Typography.Text>No tasks</Typography.Text>}
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
    <Button
      onClick={reconnectSocket}
      title="Reconnect to get the tasks updates"
    >
      <ApiOutlined />
    </Button>
  );
}

export default TasksModal;
