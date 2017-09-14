from django.shortcuts import render
from django.http import HttpResponse

from student.models import Student

# Create your views here.
def index(request):
    """
    Get all student information
    """
    student_list = Student.objects.order_by('-create_time')
    context = {'student_list': student_list}
    return render(request, 'student/index.html', context)
