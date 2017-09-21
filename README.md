Laboratory Management System
=====

Laboratory Management System is used for school, which want to manage the student and resouce in the laboratory. It used Python3 + Django + MySQL.

Install Requirement:
- Python: <https://www.python.org/>
- Django: <https://www.djangoproject.com/>
- MySQL: <https://www.mysql.com/>


### How to create database:
- Run the deploy/init_database.sql in mysql.
- cd src/lms/lms, and update the username and password of database in settings.py
- cd src/lms
- Run command `python manage.py makemigrations`
- Run command `python manage.py migrate`

### How to run this software:
```
cd src/lms
python manage.py runserver
```

And then you should create first user in the system:
```
python manage.py createsuperuser
```

Lastly, login the system as above created username.

### Functions

- Add/Delete/Update/list Staff
- Add/Delete/Update/list Seat
