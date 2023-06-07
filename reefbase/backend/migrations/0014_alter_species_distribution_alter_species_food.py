# Generated by Django 4.0.3 on 2023-05-25 20:58

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0013_alter_userlink_activation_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='species',
            name='distribution',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=500), size=None, verbose_name='Występowanie'),
        ),
        migrations.AlterField(
            model_name='species',
            name='food',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=500), size=None, verbose_name='Pożywienie'),
        ),
    ]
