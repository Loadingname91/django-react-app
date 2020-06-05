from django.shortcuts import render
from .models import User
from .serializers import LoginSerializer, RegisterSerializer, UserSerializer
# used for creating authentication tokens
from knox.models import AuthToken
from knox.views import LogoutView
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import status
from knox.auth import TokenAuthentication
from knox.models import AuthToken
from knox.settings import knox_settings
from django.contrib.auth.signals import user_logged_in, user_logged_out
from django.conf import settings
from django.utils import timezone
from main_quiz.models import Quiz, QuizTaker

"""
class LoginApi 

Input : Used to login using  the username and password credentials provided in the header 

returns : token and user information

"""


class LoginApi(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        val = serializer.is_valid()
        # print(val)
        # print(request.data)
        if val:
            user = serializer.validated_data
            # print(user)
            token_limit = settings.REST_KNOX["TOKEN_LIMIT_PER_USER"]
            # print(token_limit)
            now = timezone.now()
            token = user.auth_token_set.filter(expiry__gt=now)
            print("not allowed")
            if token.count() >= token_limit:
                return Response(
                    {"error": "Maximum amount of tokens allowed per user exceeded. Login after some time"},
                    status=status.HTTP_403_FORBIDDEN
                )
            return Response({
                'user': UserSerializer(user).data,
                'token': AuthToken.objects.create(user)[1]
            })

        else:
            print(serializer.errors)
            return Response({
                'detail': 'No users found with provided credentials , incorrect Password or username',

            })


"""
class LogoutApi 

Input : Null
Ouput : string 

"""


class LogOutApi(LogoutView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, format=None):
        request._auth.delete()
        user_logged_out.send(sender=request.user.__class__,
                             request=request, user=request.user)
        return Response(
            {
                "detail": "logged out successfully"
            }
        )


"""
class ActivateUser 

Shows the details about the user information using get request 


"""


class ActivateUser(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get(self, request):
        user_data = self.get_serializer(request.user).data
        quiz_taker = QuizTaker.objects.filter(user_id=user_data["id"])
        res_data = []
        for each_event in quiz_taker:
            data = {}
            quiz_event = Quiz.objects.filter(id=each_event.quiz_id)
            print(quiz_event)
            data["event_name"] = quiz_event[0].name
            data["slug"] =  quiz_event[0].slug
            data["event_description"] = quiz_event[0].description
            data["completed"] = each_event.completed
            if each_event.completed:
                data["score"] = each_event.score
            else:
                data["score"] = "Not yet attempted"
            res_data.append(data)
        if len(res_data) == 0:
            return Response(
                {
                    "user data": user_data,
                    "events": "No events enrolled yet"
                }
            )
        else:
            return Response(
                {
                    "user data": user_data,
                    "events": res_data
                }
            )


"""
class RegisterApi 

Used to register any user using a post request 

Input : User Data containing the required fields 

Output : User Data and corresponding Token 

"""


class RegisterApi(generics.GenericAPIView):
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        print(request.data)
        serializer = self.get_serializer(data=request.data)
        a = serializer.is_valid()
        print(a)
        if (a):
            user = serializer.save()
            return Response({
                'user': UserSerializer(user).data,
                'token': AuthToken.objects.create(user)[1]
            })
        else :
            print(serializer.errors)
            if (len(serializer.errors)>1):
                return Response({
                    "detail" : "User with that username already exists"
                })
            else :
                return Response({
                    "detail" : "User with that email already exists"
                })