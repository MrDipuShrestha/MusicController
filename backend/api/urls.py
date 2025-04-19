
from django.urls import path

from .views import RoomView, CreateRoomView, RetrieveRoomView, JoinRoomView, UserInRoomView, LeaveRoomView

urlpatterns = [
    path('room', RoomView.as_view(), name='room'),
    path('create-room', CreateRoomView.as_view(), name='create-room'),
    path('get-room', RetrieveRoomView.as_view(), name='get-room'),
    path('join-room', JoinRoomView.as_view(), name='join-room'),
    path('user-in-room', UserInRoomView.as_view(), name='user-in-room'),
    path('leave-room', LeaveRoomView.as_view(), name='leave-room'),
]   