export interface ITaskDetails {
  task_description: string;
  company: string;
  year: string;
}

export interface ITaskResult {
  task_id: string;
  status: string;
  progress: number;
  task_name: string;
  details: ITaskDetails;
  notificationId: string;
}

export interface ITaskResultWrapper {
  status: ITaskResult;
}

export interface ITaskResultWrapper {
  status: ITaskResult;
}
