from .models import User
from django.contrib.auth import authenticate
from rest_framework import serializers

"""
class RegisterSerializer

Used to validate the user fields for the activateuserapi  view 

"""


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'name', 'email', 'username',"usn","branch",'year',"is_staff")
        read_only_fields = ["events_taken"]


"""
class loginSerializer

Used to login using the following fields as mentioned below 

"""


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user:
            return user
        raise serializers.ValidationError("No users found with provided credentials , incorrect Password or username")


"""
class RegisterSerializer

Used to register using the following fields as mentioned below 

"""


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'name', 'email', 'username', 'password',"usn","branch",'year',"is_staff")
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            name=validated_data["name"],
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            branch = validated_data["branch"],
            year = validated_data["year"],
            usn = validated_data["usn"]
        )
        return user
