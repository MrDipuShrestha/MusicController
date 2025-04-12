from rest_framework import generics, status

from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse

from .serializers import RoomSerializer, CreateRoomSerializer
from .models import Room

# Create your views here.


class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer


class CreateRoomView(APIView):

    serializer_class = CreateRoomSerializer

    def post(self, request, format=None):

        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            guest_can_pause = serializer.validated_data.get("guest_can_pause")
            votes_to_skip = serializer.validated_data.get("votes_to_skip")
            host = self.request.session.session_key

            queryset = Room.objects.filter(host=host)

            if queryset.exists():
                room = queryset[0]
                room.guest_can_pause = guest_can_pause
                room.votes_to_skip = votes_to_skip
                room.save(update_fields=["guest_can_pause", "votes_to_skip"])
                self.request.session["room_code"] = room.code
                return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
            else:
                room = Room(
                    host=host,
                    guest_can_pause=guest_can_pause,
                    votes_to_skip=votes_to_skip,
                )
                room.save()
                self.request.session["room_code"] = room.code
                return Response(
                    RoomSerializer(room).data, status=status.HTTP_201_CREATED
                )
        return Response(
            {"error": "Invalid data..."}, status=status.HTTP_400_BAD_REQUEST
        )


class RetrieveRoomView(APIView):
    serializer_class = RoomSerializer
    lookup_url_kwarg = "code"

    def get(self, request, format=None):
        code = request.GET.get(self.lookup_url_kwarg)
        if code is not None:
            room = Room.objects.filter(code=code)
            if room.exists():
                data = RoomSerializer(room[0]).data
                data["is_host"] = self.request.session.session_key == room[0].host
                return Response(data, status=status.HTTP_200_OK)
            return Response(
                {"error": "Room not found."}, status=status.HTTP_404_NOT_FOUND
            )
        return Response(
            {"error": "Code parameter is not found in request"},
            status=status.HTTP_400_BAD_REQUEST,
        )


class JoinRoomView(APIView):

    lookup_url_kwargs = "code"

    def post(self, request, format=None):

        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        code = request.data.get(self.lookup_url_kwargs)

        if code is not None:
            room_result = Room.objects.filter(code=code)

            if len(room_result) > 0:
                room = room_result[0]
                self.request.session["room_code"] = room.code
                

                return Response({"Message": "Room Joined!"}, status=status.HTTP_200_OK)
            return Response(
                {"Bad Request": "Invalid room code!"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {"Bad Request": "Invlaid post data, didn't find the code key"},
            status=status.HTTP_400_BAD_REQUEST,
        )


class UserInRoomView(APIView):
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        room_code = self.request.session.get("room_code")
        if room_code is not None:
            data = {"code": room_code}
            return JsonResponse(data, status=status.HTTP_200_OK)
        else:
            return JsonResponse({"message": "User is not in a room."}, status=status.HTTP_404_NOT_FOUND)


class LeaveRoomView(APIView):
    
    def post(self, request, format=None):

        if "room_code" in self.request.session:
            self.request.session.pop("room_code")
            host_id = self.request.session.session_key
            print("Host:", host_id)
            room_result = Room.objects.filter(host=host_id)

            if len(room_result > 0):
                room = room_result[0]
                room.delete()

            return Response({"message": "Successful!"}, status=status.HTTP_200_OK)
        else:
            return Response("Not found", status=status.HTTP_404_NOT_FOUND)
