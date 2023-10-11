import json
import logging

from asgiref.sync import async_to_sync
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer

logger = logging.getLogger("buho_backend")


class TaskConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # self.task_id = self.scope["url_route"]["kwargs"]["task_id"]
        # self.task_group_name = "task_%s" % self.task_id
        self.task_group_name = "tasks"

        # logger.debug(f"TaskConsumer: {self.task_id} - {self.task_group_name}")

        # Join task group
        await self.channel_layer.group_add(self.task_group_name, self.channel_name)

        await self.accept()

    async def disconnect(self, close_code):
        # logger.debug(f"disconnect: {self.task_id} - {close_code}")
        # Leave task group
        await self.channel_layer.group_discard(self.task_group_name, self.channel_name)

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]

        # logger.debug(f"receive: {self.task_id} - {message}")

        # Send message to task group
        await self.channel_layer.group_send(
            self.task_group_name,
            {
                "type": "task_status",
                # "task_id": self.task_id,
                "message": message,
            },
        )

    # Receive message from task group
    async def task_status(self, event):
        message = event["message"]

        # logger.debug(f"task_status: {self.task_id} - {message}")

        # Send message to WebSocket
        await self.send(
            text_data=json.dumps(
                {
                    "status": message,
                }
            )
        )


async def send_task_status(task_id, task_name, details, status, progress):
    channel_layer = get_channel_layer()
    # task_group_name = f"task_{task_id}"
    task_group_name = f"tasks"

    # Send message to task group
    await channel_layer.group_send(
        task_group_name,
        {
            "type": "task_status",
            "task_id": task_id,
            "message": {
                "task_id": task_id,
                "task_name": task_name,
                "details": details,
                "status": status,
                "progress": progress,
            },
        },
    )


async def send_close_websocket(task_id):
    channel_layer = get_channel_layer()
    # Close the WebSocket connection
    async_to_sync(channel_layer.group_send)(
        f"tasks",
        {
            "task_id": task_id,
            "type": "websocket.close",
            "code": 1000,
        },
    )


def update_task_status(task_id, task_name, details, status, progress):
    async_to_sync(send_task_status)(task_id, task_name, details, status, progress)
