from django.contrib import admin
from .models import Quiz,Question,Answer,QuizTaker,UsersAnswer
import nested_admin

class Answerinlineadmin(nested_admin.NestedTabularInline):
      model = Answer
      extra = 4
      max_num = 4


class Questioninlineadmin(nested_admin.NestedTabularInline):
      model = Question
      inlines = [Answerinlineadmin,]
      extra = 2

class Quizadmin(nested_admin.NestedModelAdmin):
      inlines = [Questioninlineadmin,]


class UserAnswerinline(admin.TabularInline):
      model = UsersAnswer

class QuizTakeradmin(admin.ModelAdmin):
      inline = [UserAnswerinline,]
      list_filter = ('score',)




# Register your models here.
admin.site.register(Quiz,Quizadmin)
admin.site.register(Question)
admin.site.register(Answer)
admin.site.register(QuizTaker,QuizTakeradmin)
admin.site.register(UsersAnswer)