from rest_framework import viewsets

from staff.models import Staff
from staff.serializers import StaffSerializer


class StaffViewSet(viewsets.ModelViewSet):
    queryset = Staff.objects.all().order_by('-create_time')
    serializer_class = StaffSerializer
