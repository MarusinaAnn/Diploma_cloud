import uuid
from django.db import models
from django.conf import settings

class UserFile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="user_files"
    )
    display_name = models.CharField(max_length=255)
    file_content = models.FileField(upload_to="user_files/")
    comment = models.TextField(blank=True)
    file_size = models.PositiveBigIntegerField()
    upload_time = models.DateTimeField(auto_now_add=True)
    last_downloaded = models.DateTimeField(null=True, blank=True)
    shared_link = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.display_name
