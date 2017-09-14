from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
def index(request):
    """
    Get all student information
    """
    return HttpResponse("Student Index")