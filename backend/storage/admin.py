from django.contrib import admin
from .models import UserFile


@admin.register(UserFile)
class UserFileAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'display_name', 'file_size', 'upload_time')
    list_filter = ('upload_time',)
    search_fields = ('display_name', 'comment', 'user__username')
