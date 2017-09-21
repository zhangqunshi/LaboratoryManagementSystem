from django.db import models

# Create your models here.
from rest_framework import serializers


class Staff(models.Model):
    name = models.CharField(max_length=30)
    staff_number = models.CharField(max_length=50, unique=True)
    grade = models.CharField(max_length=50, null=True, blank=True)
    level = models.CharField(max_length=50, null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True)
    email = models.CharField(max_length=100, null=True, blank=True)
    category = models.CharField(max_length=10, null=True, blank=True)
    create_time = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 't_staff'

    def __str__(self):
        return 'num=%s, name=%s' % (self.staff_number, self.name)


class StaffSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Staff
        fields = '__all__'
