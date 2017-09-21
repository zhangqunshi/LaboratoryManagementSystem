# Create your views here.
from rest_framework import viewsets

from seat.models import Seat
from seat.serializers import SeatSerializer


class SeatViewSet(viewsets.ModelViewSet):
    queryset = Seat.objects.all()
    serializer_class = SeatSerializer
