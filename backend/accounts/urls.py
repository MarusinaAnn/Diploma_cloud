from django.urls import path
from .views import CustomAuthToken
from .views import RegisterView, UserListView, DeleteUserView, toggle_admin_status, get_current_user

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomAuthToken.as_view(), name='token-login'),
    path('users/', UserListView.as_view(), name='user-list'),
    path('users/<int:pk>/', DeleteUserView.as_view(), name='user-delete'),
    path('users/<int:user_id>/toggle-admin/', toggle_admin_status),
    path('me/', get_current_user, name='get_current_user'),
]
