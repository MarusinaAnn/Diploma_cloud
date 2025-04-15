# Generated by Django 5.1.7 on 2025-03-27 00:05

import django.db.models.deletion
import uuid
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='UserFile',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('display_name', models.CharField(max_length=255)),
                ('file_content', models.FileField(upload_to='uploaded_files/')),
                ('comment', models.TextField(blank=True)),
                ('file_size', models.PositiveBigIntegerField()),
                ('upload_time', models.DateTimeField(auto_now_add=True)),
                ('last_downloaded', models.DateTimeField(blank=True, null=True)),
                ('shared_link', models.CharField(max_length=255, unique=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_files', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
