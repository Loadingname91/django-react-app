# Generated by Django 3.0.5 on 2020-05-03 13:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main_quiz', '0005_auto_20200503_1423'),
    ]

    operations = [
        migrations.AlterField(
            model_name='quiz',
            name='description',
            field=models.TextField(max_length=1000),
        ),
    ]