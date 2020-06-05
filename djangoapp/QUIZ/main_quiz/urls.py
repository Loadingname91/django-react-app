from django.urls import path, re_path
from .views import SpecificQuizListApi, QuizDetailAPI, IncludeQuizListApi, RegisterQuizApi, MyQuizListAPI, \
    SaveUsersAnswer, SubmitQuizAPI , All_Quiz_Events_API , Download_Quiz_Events_API


urlpatterns = [
    # path("quizes/",ListQuiz.as_view()),
    path("info_quiz/<slug:slug>", SpecificQuizListApi.as_view()),
    path("all_quizzes/", IncludeQuizListApi.as_view()),
    path("quizzes/<slug:slug>", QuizDetailAPI.as_view()),
    path("register_quizzes/<slug:slug>", RegisterQuizApi.as_view()),
    re_path(r"quizzes/(?P<slug>[\w\-]+)/submit/$", SubmitQuizAPI.as_view()),
    re_path("save_answer/(?P<slug>[\w\-]+)/", SaveUsersAnswer.as_view()),
    path("my_quizzes/", MyQuizListAPI.as_view()),
    path("results_quiz/", All_Quiz_Events_API.as_view()),
    re_path("download_quiz/(?P<slug>[\w\-]+)/",Download_Quiz_Events_API.as_view())
]
