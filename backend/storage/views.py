import os
import uuid
from urllib.parse import quote
from django.conf import settings
from django.http import FileResponse, Http404
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.shortcuts import get_object_or_404
from django.utils.encoding import smart_str
from urllib.parse import quote
from django.utils.encoding import iri_to_uri
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import permissions
from .models import UserFile
from .serializers import (
    FileUploadSerializer,
    FileDetailSerializer,
    FileRenameSerializer,
    FileCommentUpdateSerializer,
)
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_current_user(request):
    user = request.user
    return Response({
        "username": user.username,
        "email": user.email,
        "is_admin": user.is_superuser
    })

import logging
logger = logging.getLogger(__name__)


User = get_user_model()


class FileViewSet(viewsets.ModelViewSet):
    queryset = UserFile.objects.all()
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action == 'access_download':
            return [permissions.AllowAny()]
        return super().get_permissions()

    def get_queryset(self):
    	user = self.request.user
    	if user.is_superuser:
            return UserFile.objects.all().order_by('-upload_time')
    	return UserFile.objects.filter(user=user).order_by('-upload_time')





    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return FileDetailSerializer
        if self.action == 'create':
            return FileUploadSerializer
        return FileDetailSerializer

    def perform_create(self, serializer):
        uploaded_file = self.request.FILES.get('file_data')
        if not uploaded_file:
            raise ValueError("Файл не был передан")

        file_size = uploaded_file.size
        file_name = uploaded_file.name
        comment = self.request.data.get('description', '')

        unique_name = f"{uuid.uuid4().hex}_{file_name}"
        relative_path = f"user_{self.request.user.id}/{unique_name}"
        absolute_path = os.path.join(settings.MEDIA_ROOT, relative_path)

        os.makedirs(os.path.dirname(absolute_path), exist_ok=True)

        with open(absolute_path, 'wb+') as dest:
            for chunk in uploaded_file.chunks():
                dest.write(chunk)

        serializer.save(
            user=self.request.user,
            display_name=file_name,
            file_content=relative_path,
            comment=comment,
            file_size=file_size,
            shared_link=uuid.uuid4().hex,
        )

        logger.info(f"Пользователь {self.request.user.username} загрузил файл: {file_name}, размер: {file_size} байт")


    def perform_destroy(self, instance):
        absolute_path = os.path.join(settings.MEDIA_ROOT, str(instance.file_content))
        if os.path.exists(absolute_path):
            os.remove(absolute_path)
        instance.delete()

        logger.info(f"Пользователь {self.request.user.username} удалил файл: {instance.display_name}")


    @action(detail=True, methods=['post'])
    def rename(self, request, pk=None):
        file = self.get_object()
        serializer = FileRenameSerializer(data=request.data)
        if serializer.is_valid():
            new_name = serializer.validated_data['new_name']
            original_extension = os.path.splitext(file.display_name)[1]
            new_name_without_ext = os.path.splitext(new_name)[0]
            safe_new_name = new_name_without_ext + original_extension

            file.display_name = safe_new_name
            logger.info(f"Пользователь {request.user.username} переименовал файл {file.display_name} в {serializer.validated_data['new_name']}")
            file.save()
            return Response({'status': 'renamed'})
        return Response(serializer.errors, status=400)

    @action(detail=True, methods=['post'])
    def update_description(self, request, pk=None):
        file = self.get_object()
        serializer = FileCommentUpdateSerializer(data=request.data)
        if serializer.is_valid():
            file.comment = serializer.validated_data['new_description']
            logger.info(f"Пользователь {request.user.username} обновил комментарий к файлу {file.display_name}")
            file.save()
            return Response({'status': 'description updated'})
        return Response(serializer.errors, status=400)

    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        file = self.get_object()
        file.last_downloaded = timezone.now()
        file.save()

        absolute_path = os.path.join(settings.MEDIA_ROOT, str(file.file_content))
        if os.path.exists(absolute_path):
            response = FileResponse(open(absolute_path, 'rb'))

            filename_utf8 = iri_to_uri(file.display_name)
            response['Content-Disposition'] = f"attachment; filename*=UTF-8''{filename_utf8}"
            logger.info(f"Пользователь {request.user.username} скачал файл: {file.display_name}")
            return response

        raise Http404("Файл не найден")

    @action(detail=True, methods=['get'])
    def preview(self, request, pk=None):
        file = self.get_object()
        file.last_downloaded = timezone.now()
        file.save()

        absolute_path = os.path.join(settings.MEDIA_ROOT, str(file.file_content))
        if os.path.exists(absolute_path):
            response = FileResponse(open(absolute_path, 'rb'))
            filename_utf8 = iri_to_uri(file.display_name)
            response['Content-Disposition'] = f"inline; filename*=UTF-8''{filename_utf8}"
            logger.info(f"Пользователь {request.user.username} открыл файл {file.display_name} для предпросмотра")
            return response

        raise Http404("Файл не найден")


    @action(detail=False, methods=['get'], url_path='access/(?P<access_url>[^/.]+)')
    def access_download(self, request, access_url=None):
        file = get_object_or_404(UserFile, shared_link=access_url)
        file.last_downloaded = timezone.now()
        file.save()

        absolute_path = os.path.join(settings.MEDIA_ROOT, str(file.file_content))
        if os.path.exists(absolute_path):
            response = FileResponse(open(absolute_path, 'rb'))

            filename_utf8 = iri_to_uri(file.display_name)
            response['Content-Disposition'] = f"inline; filename*=UTF-8''{filename_utf8}"
            logger.info(f"Файл {file.display_name} был открыт по публичной ссылке: {access_url}")
            return response

        raise Http404("Файл не найден")


    @action(detail=False, methods=['get'], url_path='user/(?P<user_id>[^/.]+)')
    def list_user_files(self, request, user_id=None):
        if not request.user.is_superuser:
            return Response({'detail': 'Только администратор может просматривать файлы других пользователей.'}, status=403)

        user = get_object_or_404(User, id=user_id)
        files = UserFile.objects.filter(user=user)
        serializer = FileDetailSerializer(files, many=True)
        logger.info(f"Админ {request.user.username} запросил список файлов пользователя {user.username}")
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='user/(?P<user_id>[^/.]+)/stats')
    def user_file_stats(self, request, user_id=None):
        if not request.user.is_superuser:
            return Response({'detail': 'Доступ запрещен'}, status=403)

        user = get_object_or_404(User, id=user_id)
        logger.info(f"Админ {request.user.username} запросил статистику пользователя {user.username}")
        files = UserFile.objects.filter(user=user)
        total_size = sum(f.file_size for f in files)
        file_count = files.count()

        return Response({
            'user_id': user.id,
            'username': user.username,
            'file_count': file_count,
            'total_size': total_size
        })

    @action(detail=True, methods=['get'], url_path='view')
    def view(self, request, pk=None):
        file = get_object_or_404(UserFile, pk=pk)

        if not request.user.is_superuser and file.user != request.user:
    	    return Response({'detail': 'Доступ запрещён'}, status=403)


        absolute_path = os.path.join(settings.MEDIA_ROOT, str(file.file_content))

        if os.path.exists(absolute_path):
            response = FileResponse(open(absolute_path, 'rb'))
            response['Content-Disposition'] = f"inline; filename*=UTF-8''{iri_to_uri(file.display_name)}"
            logger.info(f"Предпросмотр файла {file.display_name} админом {request.user.username}")
            return response

        raise Http404("Файл не найден")



    @action(detail=False, methods=['get'], url_path='all-stats')
    def all_user_stats(self, request):
        if not request.user.is_superuser:
            return Response({'detail': 'Доступ запрещен'}, status=403)

        users = get_user_model().objects.all().order_by('-is_superuser', 'username')
        data = []
        for user in users:
            files = UserFile.objects.filter(user=user)
            data.append({
                'user_id': user.id,
                'username': user.username,
                'file_count': files.count(),
                'total_size': sum(f.file_size for f in files),
            })
        logger.info(f"Админ {request.user.username} запросил общую статистику по пользователям")
        return Response(data)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_user_info(request):
    logger.info(f"Пользователь {request.user.username} запросил информацию о себе")
    return Response({
        "username": request.user.username,
        "is_admin": request.user.is_superuser,
    })




