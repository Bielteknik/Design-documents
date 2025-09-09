from django.urls import path
from .views import ManageUserView, UserListView

app_name = 'users'

urlpatterns = [
    path('me/', ManageUserView.as_view(), name='me'),
    path('list/', UserListView.as_view(), name='user-list'),
]