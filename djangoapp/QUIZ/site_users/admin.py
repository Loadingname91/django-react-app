from .models import User
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User
from django.contrib.auth.forms import UserCreationForm, UserChangeForm


"""
Class UserCreationForm 

This class is extending the build in form class in authentication forms 
It is used to create users using the admin interface

"""

class UserCreationForm(UserCreationForm):
    class Meta(UserCreationForm):
        model = User
        fields = ('username',)

"""
Class UserChangeForm  

This class is extending the build in form class in authentication forms 
It is used to change users information using the admin interface

"""


class UserChangeForm(UserChangeForm):
    class meta:
        model = User
        fields = ('email', 'username','password',"usn","branch",'year')


"""
Class UserAdmin  

This class extends UserAdmin and it creates add and change from derived from the respective imports
It also holds list and list filter display for sorting through the list of users

"""


class UserAdmin(UserAdmin):
    add_form = UserCreationForm
    form = UserChangeForm
    model = User
    list_display = ('username', 'name', 'email', 'is_active',"usn","branch",'year')
    list_filter = ('username', 'name', 'email', 'is_active',"usn","branch",'year')
    fieldsets = (
        (None, {'fields': ('name', 'username', 'email', 'password',"usn","branch",'year')}),
        ('Permissions', {'fields': ('is_staff', 'is_active')})
    )
    search_fields = ('username',"usn","branch",'year')


admin.site.register(User,UserAdmin)