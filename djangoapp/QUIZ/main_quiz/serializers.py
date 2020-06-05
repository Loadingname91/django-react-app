from .models import Quiz, QuizTaker, Question, Answer, UsersAnswer
from rest_framework import \
    serializers  # using which complex datasets can be easily converted to JSON, XML or any other content types.
from rest_framework.response import Response


class QuizListSerializer(
    serializers.ModelSerializer):  # ModelSerializer allows to create serializer for a model in django
    questions_count = serializers.SerializerMethodField()  # read-only field
    registered_list = serializers.SerializerMethodField()

    class Meta:
        model = Quiz
        fields = ["id", "name", "description", "image", "slug", "questions_count", "registered_list","negative_marking"]  # serializing objects
        read_only_fields = ["questions_count", "registered_list"]  # return number of questions

    def get_questions_count(self, obj):
        return obj.approx_questions

    def get_registered_list(self, obj):
        return obj.quiztaker_set.all()


class ExcludeQuizListSerializer(
    serializers.ModelSerializer):  # ModelSerializer allows to create serializer for a model in django
    questions_count = serializers.SerializerMethodField()  # read-only field

    class Meta:
        model = Quiz
        fields = ["id", "name", "description", "image", "slug", "questions_count"]  # serializing objects
        read_only_fields = ["questions_count"]  # return number of questions

    def get_questions_count(self, obj):
        return obj.question_set.all().count()


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ["id", "question", "label"]


class QuestionSerializer(serializers.ModelSerializer):
    answer_set = AnswerSerializer(many=True)

    class Meta:
        model = Question
        fields = "__all__"


class UsersAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsersAnswer
        fields = "__all__"


class QuizTakerSerializer(serializers.ModelSerializer):
    usersanswer_set = UsersAnswerSerializer(many=True)

    class Meta:
        model = QuizTaker
        fields = "__all__"


class QuizDetailSerializer(serializers.ModelSerializer):
    quiztakers_set = serializers.SerializerMethodField()

    class Meta:
        model = Quiz
        fields = "__all__"

    def get_quiztakers_set(self, obj):
        try:
            quiz_taker = QuizTaker.objects.get(user=self.context['request'].user, quiz=obj)
            serializer = QuizTakerSerializer(quiz_taker)
            return serializer.data
        except QuizTaker.DoesNotExist:
            return None


'''
checks for users individual quiz progress, if completed if true, score is assigned else progress is assigned
'''


class MyQuizListSerializer(serializers.ModelSerializer):
    completed = serializers.SerializerMethodField()
    progress = serializers.SerializerMethodField()
    questions_count = serializers.SerializerMethodField()
    score = serializers.SerializerMethodField()

    class Meta:
        model = Quiz
        fields = ["id", "name", "description", "image", "slug", "questions_count", "completed", "progress", "score"]
        read_only_fields = ["questions_count", "completed", "score", "progress"]

    def get_completed(self, obj):
        try:
            quiztaker = QuizTaker.objects.get(user=self.context['request'].user, quiz=obj)
            return quiztaker.completed
        except QuizTaker.DoesNotExist:
            return None

    def get_progress(self, obj):
        try:
            quiztaker = QuizTaker.objects.get(user=self.context['request'].user, quiz=obj)
            if not quiztaker.completed:
                questions_answered = UsersAnswer.objects.filter(quiz_taker=quiztaker, answer__isnull=False).count()
                total_questions = obj.question_set.all().count()
                return int(questions_answered / total_questions)
            return None  # if quiz taker.completed is true, means user has completed the quiz
        except QuizTaker.DoesNotExist:
            return None

    def get_score(self, obj):
        try:
            quiztaker = QuizTaker.objects.get(user=self.context['request'].user, quiz=obj)
            if quiztaker.completed == True:
                return quiztaker.score  # returns score from model
            return None  # if quiz taker.completed is false, means user has not yet completed the quiz
        except QuizTaker.DoesNotExist:
            return None

    def get_questions_count(self, obj):
        return obj.question_set.all().count()


class QuizResultSerializer(serializers.ModelSerializer):
    quiztaker_set = serializers.SerializerMethodField()
    question_set = QuestionSerializer(many=True)

    class Meta:
        model = Quiz
        fields = "__all__"

    def get_quiztaker_set(self, obj):
        try:
            print(obj)
            print(self.context['request'].user)
            quiztaker = QuizTaker.objects.get(user=self.context['request'].user, quiz=obj)
            serializer = QuizTakerSerializer(quiztaker)
            return serializer.data

        except QuizTaker.DoesNotExist:
            return None


