from django.db import models

# Create your models here.
from staff.models import Staff


class Seat(models.Model):
    seat_number = models.CharField(max_length=50)
    room = models.CharField(max_length=50)
    desc = models.CharField(max_length=200, null=True, blank=True)
    staff = models.ForeignKey(Staff, on_delete=models.SET_NULL, null=True, blank=True)

