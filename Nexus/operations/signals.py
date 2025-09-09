# operations/signals.py (Yeni dosya)
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Task
from communications.models import Notification
import re
from django.contrib.auth import get_user_model

User = get_user_model()

@receiver(post_save, sender=Task)
def task_post_save(sender, instance, created, **kwargs):
    # Yeni bir görev oluşturulduğunda VE birine atandığında
    if created and instance.assignee:
        Notification.objects.create(
            recipient=instance.assignee,
            actor=instance.creator,
            verb='size yeni bir görev atadı:',
            content_object=instance
        )

@receiver(post_save, sender=TaskComment)
def comment_post_save(sender, instance, created, **kwargs):
    if created:
        # --- Önceki WebSocket sinyali kodumuz burada kalabilir ---

        # @mention mantığı
        mentioned_usernames = re.findall(r'@(\w+)', instance.content)
        for username in mentioned_usernames:
            try:
                # Django'da username default olarak User modelinde yoktur, email var.
                # Bu yüzden biz email'in @'den önceki kısmını arayalım.
                recipient = User.objects.get(email__startswith=username)
                if recipient != instance.author: # Kişi kendini mention'ladıysa bildirim gitmesin
                    Notification.objects.create(
                        recipient=recipient,
                        actor=instance.author,
                        verb='yorumunda sizden bahsetti:',
                        content_object=instance.task # Bildirim göreve yönlendirsin
                    )
            except User.DoesNotExist:
                continue # Kullanıcı bulunamadıysa devam et