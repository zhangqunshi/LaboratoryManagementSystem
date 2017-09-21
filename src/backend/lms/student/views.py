from django.shortcuts import render
from django.http import HttpResponse
from django.views import view

from student.models import Student

# Create your views here.

class StudentView(View):
    def get(request):
        """
        Get all student information
        """
        student_list = Student.objects.order_by('-create_time')
        context = {'student_list': student_list}
        return render(request, 'student/index.html', context)
