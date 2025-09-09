# operations/consumers.py (Bu dosyayı biz oluşturuyoruz)
import json
from channels.generic.websocket import AsyncWebsocketConsumer

class TaskConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.task_id = self.scope['url_route']['kwargs']['task_id']
        self.task_group_name = f'task_{self.task_id}'

        # Kullanıcıyı göreve özel "oda"ya (grup) dahil et
        await self.channel_layer.group_add(
            self.task_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        # Kullanıcıyı odadan çıkar
        await self.channel_layer.group_discard(
            self.task_group_name,
            self.channel_name
        )

    # Gruptan bir mesaj alındığında bu metod çalışır
    async def task_update(self, event):
        # Mesajı WebSocket üzerinden istemciye (Flutter'a) gönder
        await self.send(text_data=json.dumps({
            'type': 'task.update',
            'message': event['message'],
        }))