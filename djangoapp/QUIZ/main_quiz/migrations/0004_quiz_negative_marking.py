# Generated by Django 3.0.5 on 2020-05-03 08:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main_quiz', '0003_quiz_approx_questions'),
    ]

    operations = [
        migrations.AddField(
            model_name='quiz',
            name='negative_marking',
            field=models.BooleanField(default=False),
        ),
    ]