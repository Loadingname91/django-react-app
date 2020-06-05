from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import generics  # allow to quiclkly build api views tht map closely to db model
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from rest_framework import permissions
from django.core import exceptions
from .models import Quiz, Answer, Question, QuizTaker, UsersAnswer
from site_users.models import User
from .serializers import *
import random
from django.db.models import Q  # encapsulates sql expression in a python object for db related operations
from django.shortcuts import get_object_or_404
from rest_framework import status
from django.core.mail import send_mail
import csv, json
from django.http import HttpResponse
import pandas as pd
from io import BytesIO as IO
from django.contrib.auth.mixins import UserPassesTestMixin
from QUIZ.settings import EMAIL_HOST_USER
from django.utils import timezone
from datetime import datetime




class SpecificQuizListApi(generics.ListCreateAPIView):
    serializer_class = QuizListSerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_queryset(self, *args, **kwagrs):
        slug = self.kwargs["slug"]
        queryset = Quiz.objects.filter(roll_out=True, slug=slug)
        remove_id = []
        for i in queryset:
            if (i.approx_questions > i.question_set.count()):
                remove_id.append(i.id)
        queryset = queryset.exclude(id__in=remove_id)
        print('In include')
        # queryset = Quiz.objects.filter(roll_out = True).exclude(quiztaker__user = self.request.user)
        query = self.request.GET.get("q")  # a dictionary with key "q" i.e., will return q
        # print(queryset)
        if query:
            queryset = queryset.filter(Q(name__icontains=query) |  # search some data in db (i = case-insensitive)
                                       Q(description__icontains=query)).distinct()
        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = QuizListSerializer(queryset, many=True)
        # print(len(serializer.data))
        if len(serializer.data) == 0:
            return Response(
                {
                    "detail": "quiz data not available"
                }
            )
        else:
            print(serializer.data)
            res = []
            serializer.data[0]['quiz_registered'] = None
            for user in serializer.data[0]['registered_list']:
                print("REQUESTING USER IS", self.request.user)
                print("registerd user is", user.user)
                if user.user == self.request.user:
                    print("here")
                    serializer.data[0]['quiz_registered'] = 'Yes'
                    if user.date_finished:
                        serializer.data[0]["quiz_taken"] = "Yes"
                    else:
                        serializer.data[0]["quiz_taken"] = "No"
                    #print(serializer.data)
            print(serializer.data[0]['quiz_registered'])
            if serializer.data[0]['quiz_registered'] is None:
                serializer.data[0]['quiz_registered'] = "No"
                serializer.data[0]['quiz_taken'] = "No"

            del serializer.data[0]['registered_list']
            content = serializer.data
            print(content)
            return Response(content)


class IncludeQuizListApi(generics.ListCreateAPIView):
    serializer_class = QuizListSerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_queryset(self, *args, **kwagrs):
        queryset = Quiz.objects.filter(roll_out=True)
        remove_id = []
        for i in queryset:
            if (i.approx_questions > i.question_set.count()):
                remove_id.append(i.id)
        queryset = queryset.exclude(id__in=remove_id)
        print('In include')
        # queryset = Quiz.objects.filter(roll_out = True).exclude(quiztaker__user = self.request.user)
        query = self.request.GET.get("q")  # a dictionary with key "q" i.e., will return q
        print(queryset)
        if query:
            queryset = queryset.filter(Q(name__icontains=query) |  # search some data in db (i = case-insensitive)
                                       Q(description__icontains=query)).distinct()
        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = QuizListSerializer(queryset, many=True)
        print(len(serializer.data))
        if len(serializer.data) == 0:
            return Response(
                {
                    "detail": "No upcomming quizzes yet stay tuned :)"
                }
            )
        else:
            print(serializer.data)
            for i in range(len(serializer.data)):
                del serializer.data[i]['registered_list']
            content = serializer.data
            print(content)
            return Response(content)


class QuizDetailAPI(generics.RetrieveAPIView):
    serializer_class = QuizDetailSerializer

    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get(self, *args, **kwargs):
        slug = self.kwargs["slug"]
        quiz = get_object_or_404(Quiz, slug=slug)
        last_question = None
        try:
            obj = QuizTaker.objects.get(user=self.request.user, quiz=quiz)
            print("obj already present")
            questions = UsersAnswer.objects.filter(quiz_taker=obj, answer__isnull=False)
            print(questions)
            if questions.count() > 0:
                last_question = questions.last().question.id
            else:
                last_question = None

            content = self.get_serializer(quiz, context={'request': self.request}).data
            user_questions = UsersAnswer.objects.filter(quiz_taker=obj)
            questions_set = []
            for i in user_questions:
                question_set = {}
                question = Question.objects.filter(id=i.question_id)
                answer_set = list(Answer.objects.filter(question_id=question[0].id). \
                                  values('id', 'question_id', 'label'))
                question_set['label'] = question[0].label
                question_set['answer_set'] = answer_set
                question_set['id'] = question[0].id
                questions_set.append(question_set)

            content["question_set"] = questions_set

            return Response({'quiz': content,
                             'last_question_id': last_question})
        except exceptions.ObjectDoesNotExist:
            return Response(
                {
                    "detail": " You have not yet registered for quiz "
                }
            )


class RegisterQuizApi(generics.RetrieveAPIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get(self, *args, **kwargs):
        slug = self.kwargs["slug"]
        quiz = get_object_or_404(Quiz, slug=slug)
        questions = Question.objects.filter(quiz=quiz)
        if questions.count() < quiz.approx_questions:
            return Response(
                {
                    "detail": "Quiz is still being formatted please come back later"
                }
            )
        else:
            obj, created = QuizTaker.objects.get_or_create(user=self.request.user, quiz=quiz)
            if created:
                print("quiz taker obj created")
                random_shuffle = random.sample(list(questions), quiz.approx_questions)
                for question in random_shuffle:
                    UsersAnswer.objects.create(quiz_taker=obj, question=question)
                return Response(
                    {
                        "detail": "Successfully Registered for the quiz"
                    }
                )
            else:
                return Response(
                    {
                        "detail": "You have Already Registered"
                    }
                )


'''
this class lists the questions that user has not yet taken
only autheticated users are get the remaining quizz 
'''


class MyQuizListAPI(generics.ListAPIView):
    permission_class = [
        permissions.IsAuthenticated
    ]

    serializer_class = MyQuizListSerializer

    def get_queryset(self, *args, **kwargs):
        queryset = Quiz.objects.filter(quiztaker__user=self.request.user)
        query = self.request.GET.get("q")  # a dictionary with key "q" i.e., will return q

        if query:
            queryset = queryset.filter(
                Q(name__icontains=query) |  # search some data in db (i = case-insensitive)
                Q(description__icontains=query)
            ).distict()
        return queryset


'''
get the id of user, ques and ans
if quiz is completed popup message so that user does not fake quiz
'''


class SaveUsersAnswer(generics.UpdateAPIView):
    serializer_class = UsersAnswerSerializer
    permission_class = [
        permissions.IsAuthenticated
    ]

    def patch(self, request, *args, **kwargs):
        quiztaker_id = request.data['quiztaker']
        question_id = request.data['question']
        answer_id = request.data['answer']
        quiz = Quiz.objects.get(slug=self.kwargs['slug'])
        # print(quiz)
        quiztaker = get_object_or_404(QuizTaker, id=quiztaker_id, quiz=quiz)
        print(quiztaker)
        question = get_object_or_404(Question, id=question_id)
        answer = get_object_or_404(Answer, id=answer_id)

        if quiztaker.completed:
            return Response({
                "message": "This quiz is already complete, you can't answer any more questions"},
                status=status.HTTP_412_PRECONDITION_FAILED
            )

        obj = get_object_or_404(UsersAnswer, quiz_taker=quiztaker, question=question)
        obj.answer = answer
        obj.save()

        return Response(self.get_serializer(obj).data)


class SubmitQuizAPI(generics.GenericAPIView):
    serializer_class = QuizResultSerializer
    permission_class = [
        permissions.IsAuthenticated
    ]

    def post(self, request, *args, **kwargs):
        quiztaker_id = request.data['quiztaker']
        question_id = request.data['question']
        answer_id = request.data['answer']

        quiztaker = get_object_or_404(QuizTaker, id=quiztaker_id)
        question = get_object_or_404(Question, id=question_id)
        # in order to avoid submitting the quiz 2 times
        quiz = Quiz.objects.get(slug=self.kwargs['slug'])
        if quiztaker.completed:
            return Response({
                "message": "This quiz is already complete, you can't submit again"},
                status=status.HTTP_412_PRECONDITION_FAILED
            )
        # if user submits the quiz without attempting any question(final question)
        if answer_id is not None:
            answer = get_object_or_404(Answer, id=answer_id)
            obj = get_object_or_404(UsersAnswer, quiz_taker=quiztaker, question=question)
            obj.answer = answer
            obj.save()

        quiztaker.completed = True
        quiztaker.date_finished = datetime.now()

        correct_answers = 0
        subject = 'Greetings from IEEE '
        message = 'Thank you for Taking the Quiz ' + str(quiz.name)
        from_email = 'kiritokamimachinelearning@gmail.com'
        to_list = [self.request.user.email]
        if quiz.negative_marking:
            print("negative score calculation")
            # get all the answer of the quiz and check is answer is correct
            for users_answer in UsersAnswer.objects.filter(quiz_taker=quiztaker):
                answer = Answer.objects.get(question=users_answer.question, is_correct=True)
                if users_answer.answer == answer:
                    correct_answers += 2
                elif users_answer.answer is None:
                    print(users_answer.question)
                    pass
                else:
                    correct_answers -= 1
            print("total = ", correct_answers)
            if correct_answers < 0:
                print('here')
                correct_answers = 0
            quiztaker.score = float(correct_answers / (quiztaker.quiz.approx_questions * 2)) * 100
            print(quiztaker.score)
            quiztaker.save()
            send_mail(subject, message, from_email, to_list, fail_silently=False)


        else:
            print("positive score calculation")
            # get all the answer of the quiz and check is answer is correct
            for users_answer in UsersAnswer.objects.filter(quiz_taker=quiztaker):
                answer = Answer.objects.get(question=users_answer.question, is_correct=True)
                if users_answer.answer == answer:
                    correct_answers += 1
            quiztaker.score = float(correct_answers / quiztaker.quiz.question_set.count()) * 100
            print(quiztaker.score)
            quiztaker.save()
            send_mail(subject, message, from_email, to_list, fail_silently=False)

        # print(quiztaker)
        # print(type(quiztaker))
        # print(self.request.user)
        # print(type(self.request.user))
        content = self.get_serializer(quiz).data
        content['score'] = quiztaker.score
        print(content)
        return Response(content)


"""


"""


class All_Quiz_Events_API(generics.GenericAPIView):
    permission_class = [
        permissions.IsAuthenticated
    ]

    def get(self, *args, **kwargs):
        if not self.request.user.is_staff:
            print("not")
            print(self.request.user.is_staff)
            return Response(
                {
                    "detail": " No permission "
                }
            )
        res_data = []
        for each in Quiz.objects.filter(roll_out=True):
            data = []
            quiz_taker = QuizTaker.objects.filter(quiz=each, completed=True)
            data.append({"quiz_name": each.name, "slug": each.slug})
            for taker in quiz_taker:
                print(each)
                sub_data = {}
                user = User.objects.filter(id=taker.user_id).all()
                sub_data["score"] = str(taker.score) + "%"
                sub_data["username"] = user[0].name
                sub_data["email"] = user[0].email
                sub_data["negative_marking"] = each.negative_marking
                data.append(sub_data)
            print(len(data))
            if (len(data)) > 1:
                res_data.append(data)
            else:
                data[0]["message"] = "No participants have completed yet"
                res_data.append(data)
        return Response(
            {
                "data": res_data
            }
        )


class Download_Quiz_Events_API(generics.GenericAPIView):
    permission_class = [
        permissions.IsAuthenticated
    ]

    def get(self, *args, **kwargs):
        if not self.request.user.is_staff:
            print("not")
            print(self.request.user.is_staff)
            return Response(
                {
                    "detail": " No permission "
                }
            )
        res_data = []
        quiz = Quiz.objects.filter(roll_out=True, slug=self.kwargs['slug'])
        if len(quiz) == 0:
            return Response(
                {
                    "detail": "quiz is not yet to be rolled out"
                }
            )
        res_data = []
        quiz_taker = QuizTaker.objects.filter(quiz=quiz[0], completed=True)
        for taker in quiz_taker:
            data = {}
            user = User.objects.filter(id=taker.user_id).all()
            data["score"] = str(taker.score) + "%"
            data["username"] = user[0].name
            data["email"] = user[0].email
            data['usn'] = user[0].usn
            data['year'] = user[0].year
            data['branch'] = user[0].branch
            data["negative_marking"] = quiz[0].negative_marking
            data["quiz name"] = quiz[0].name
            if len(data) > 1:
                res_data.append(data)
            else:
                data["message"] = "No participants have completed yet"
                res_data.append(data)
        print(res_data)
        res_data = json.dumps(res_data)
        buffer_file = IO()
        res_df = pd.read_json(res_data)
        xlwriter = pd.ExcelWriter(buffer_file, engine='xlsxwriter')
        pd.read_json(res_data).to_excel(xlwriter, "Summary")
        xlwriter.save()
        xlwriter.close()
        buffer_file.seek(0)
        response = HttpResponse(buffer_file.read(),
                                content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        response['Content-Disposition'] = 'attachment; filename=' + str(quiz[0].name) + '.xlsx'

        return response
