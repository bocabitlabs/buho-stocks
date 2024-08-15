import { useTranslation } from "react-i18next";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "api/api-client";
import queryClient from "api/query-client";
import { ITaskResult } from "types/task-result";

export const fetchTasksResults = async () => {
  const { data } = await apiClient.get<ITaskResult[]>("/tasks-results/");
  return data;
};

export function useTasksResults() {
  return useQuery<ITaskResult[], Error>({
    queryKey: ["tasks-results"],
    queryFn: fetchTasksResults,
  });
}

export const useStartTask = () => {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: () => apiClient.post(`/start-task/`),
    onSuccess: () => {
      notifications.show({
        color: "green",
        message: t("Task created"),
      });
      queryClient.invalidateQueries({ queryKey: ["tasks-results"] });
    },
    onError: () => {
      notifications.show({
        color: "red",
        message: t("Unable to create task"),
      });
    },
  });
};
