# Generated by Django 4.0.3 on 2023-02-14 07:59

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0009_rename_comments_comment_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='mistakereport',
            name='test',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=100), blank=True, null=True, size=None),
        ),
    ]
