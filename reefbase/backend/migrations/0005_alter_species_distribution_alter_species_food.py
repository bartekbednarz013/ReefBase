# Generated by Django 4.0.3 on 2022-11-29 13:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0004_alter_comments_author'),
    ]

    operations = [
        migrations.AlterField(
            model_name='species',
            name='distribution',
            field=models.CharField(max_length=500, verbose_name='Występowanie'),
        ),
        migrations.AlterField(
            model_name='species',
            name='food',
            field=models.CharField(max_length=500, verbose_name='Pożywienie'),
        ),
    ]
