from rest_framework import serializers
from .models import UserFile


class FileUploadSerializer(serializers.ModelSerializer):
    file_data = serializers.FileField(write_only=True)
    description = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = UserFile
        fields = (
            'id', 'display_name', 'file_content',
            'comment', 'file_size', 'upload_time',
            'file_data', 'description',
            'shared_link',
        )
        read_only_fields = (
            'id', 'file_size', 'upload_time',
            'display_name', 'file_content',
            'comment', 'shared_link',
        )

    def create(self, validated_data):
        validated_data.pop('file_data', None)
        validated_data.pop('description', None)
        return super().create(validated_data)


class FileDetailSerializer(serializers.ModelSerializer):
    upload_time = serializers.DateTimeField(format=None)
    last_downloaded = serializers.DateTimeField(format=None, allow_null=True)

    class Meta:
        model = UserFile
        fields = (
            'id',
            'display_name',
            'file_content',
            'comment',
            'file_size',
            'upload_time',
            'last_downloaded',
            'shared_link',
        )



class FileRenameSerializer(serializers.Serializer):
    new_name = serializers.CharField(max_length=255)


class FileCommentUpdateSerializer(serializers.Serializer):
    new_description = serializers.CharField(max_length=500)


class FileDownloadSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserFile
        fields = ('file_content',)
