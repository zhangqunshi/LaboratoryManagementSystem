from django.db import models

# Create your models here.


class Student(models.Model):
    student_num = models.CharField(primary_key=True, max_length=50)
    student_name = models.CharField(max_length=30)
    phone = models.CharField(max_length=20, null=True, blank=True)
    email = models.CharField(max_length=100, null=True, blank=True)

    class Meta:
        db_table = 't_student'

    def __str__(self):
        return 'num=%s, name=%s' % (self.student_num, self.student_name)
