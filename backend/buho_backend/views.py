from django_celery_results.models import TaskResult
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from stats.tasks import debug_task


@api_view(["POST"])
def start_task_view(request):
    task = debug_task.delay()
    return Response({"task_id": task.id}, status=status.HTTP_202_ACCEPTED)


class TaskResultList(APIView):
    def get(self, request):
        task_results = TaskResult.objects.filter(status="STARTED").all()
        data = []
        for task_result in task_results:
            data.append(
                {
                    "task_id": task_result.task_id,
                    "status": task_result.status,
                    "result": task_result.result,
                    "date_done": task_result.date_done,
                }
            )
        return Response(data, status=status.HTTP_200_OK)
