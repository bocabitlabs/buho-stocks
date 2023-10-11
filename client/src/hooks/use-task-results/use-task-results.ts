import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";
import { apiClient } from "api/api-client";
import queryClient from "api/query-client";
import { ITaskResult } from "types/task-result";

export const fetchTasksResults = async () => {
  const { data } = await apiClient.get<ITaskResult[]>("/tasks-results/");
  return data;
};

export function useTasksResults() {
  return useQuery<ITaskResult[], Error>(["tasks-results"], fetchTasksResults);
}

export const useStartTask = () => {
  const { t } = useTranslation();

  return useMutation(() => apiClient.post(`/start-task/`), {
    onSuccess: () => {
      toast.success<string>(t("Task created"));
      queryClient.invalidateQueries(["tasks-results"]);
    },
    onError: () => {
      toast.error<string>(t("Unable to create task"));
    },
  });
};
