import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { LoadingOutlined, RightSquareOutlined } from "@ant-design/icons";
import { Button, Modal, Progress, Space, Typography } from "antd";
import { ITaskResult } from "types/task-result";

function TasksModal() {
  // List of tasks and their statuses
  const [tasks, setTasks] = useState<ITaskResult[]>([]);
  const { t } = useTranslation();

  const [isTasksModalOpen, setIsTasksModalOpen] = useState(false);

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
    console.log(`Connecting to websocket: ${`ws://127.0.0.1:8001/ws/tasks/`}`);
    const ws = new WebSocket(`ws://127.0.0.1:8001/ws/tasks/`);

    ws.onmessage = (event) => {
      const messageData = JSON.parse(event.data);
      console.log(messageData.status);
      updateTaskProgress(
        messageData.status.task_id,
        messageData.status.task_name,
        messageData.status.progress,
        messageData.status.status,
        messageData.status.details,
      );
    };

    ws.onclose = (event) => {
      console.log("Closed", event);
    };

    return () => {
      console.log("Disconnecting websocket");
      ws.close();
    };
  }, []);

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

export default TasksModal;
