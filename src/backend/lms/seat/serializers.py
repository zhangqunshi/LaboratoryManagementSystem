from rest_framework import serializers

from seat.models import Seat


class SeatSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Seat
        fields = '__all__'
