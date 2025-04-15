from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status, views
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from django.contrib.auth import get_user_model
from .serializers import UserRegistrationSerializer, UserSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_current_user(request):
    if not request.user.is_authenticated:
        return Response({"is_authenticated": False}, status=200)

    user = request.user
    return Response({
        "username": user.username,
        "email": user.email,
        "is_admin": user.is_admin,
        "is_authenticated": True,  
    })

User = get_user_model()


@method_decorator(csrf_exempt, name='dispatch')
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]



class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        token = Token.objects.get(key=response.data['token'])
        user = token.user
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'username': user.username,
            'is_admin': user.is_superuser,
        })

class LogoutView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        request.user.auth_token.delete()
        return Response(status=status.HTTP_200_OK)

class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]

class DeleteUserView(generics.DestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]


@api_view(['POST'])
@permission_classes([IsAdminUser])
def toggle_admin_status(request, user_id):
    user = get_object_or_404(User, id=user_id)
    user.is_admin = not user.is_admin
    user.save()
    return Response({'status': f'Админ статус изменён на {user.is_admin}'})




