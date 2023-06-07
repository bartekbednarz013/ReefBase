from django.db import models
from django.contrib.auth.models import User
from imagekit.models import ImageSpecField
from imagekit.processors import ResizeToFit
from django.contrib.postgres.fields import ArrayField

# User model
User._meta.get_field("email")._unique = True


class Species(models.Model):
    slug = models.SlugField(max_length=100, unique=True)
    regnum = models.CharField(max_length=50, verbose_name="Królestwo")
    phylum = models.CharField(max_length=50, verbose_name="Typ")
    classis = models.CharField(max_length=50, verbose_name="Gromada")
    ordo = models.CharField(max_length=50, verbose_name="Rząd")
    familia = models.CharField(max_length=50, verbose_name="Rodzina")
    genus = models.CharField(max_length=50, verbose_name="Rodzaj")
    species = models.CharField(max_length=100, verbose_name="Gatunek", unique=True)
    category = models.CharField(max_length=30, verbose_name="Kategoria")
    size = models.FloatField(verbose_name="Wielkość", default=0)
    min_tank = models.IntegerField(verbose_name="Minimalna pojemność akwarium", default=0)
    distribution = ArrayField(models.CharField(max_length=100), verbose_name="Występowanie")
    food = ArrayField(models.CharField(max_length=100), verbose_name="Pożywienie")
    picky_eater = models.BooleanField(verbose_name="Specjalista pokarmowy", blank=True, null=True)
    reefsafe = models.BooleanField(verbose_name="Bezpieczny dla rafy", blank=True, null=True)
    image = models.ImageField(upload_to="species")
    image_thumbnail = ImageSpecField(source="image", processors=[ResizeToFit(20)], format="PNG")
    date = models.DateTimeField(auto_now_add=True)
    added_by = models.ForeignKey(User, related_name="added_species", on_delete=models.SET_NULL, null=True)
    accepted = models.BooleanField(default=False)
    accepted_by = models.ForeignKey(
        User, related_name="accepted_species", on_delete=models.SET_NULL, null=True, blank=True
    )

    def __str__(self):
        return self.species


class Comment(models.Model):
    species = models.ForeignKey(Species, related_name="comments", on_delete=models.CASCADE)
    author = models.ForeignKey(User, related_name="added_comments", on_delete=models.SET_NULL, null=True)
    text = models.TextField(max_length=2500)
    date = models.DateTimeField(auto_now_add=True)
    parent = models.IntegerField(null=True)
    reply_to = models.IntegerField(null=True)


class UserLink(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    activation = models.CharField(max_length=50, null=True)
    set_new_password = models.CharField(max_length=50, null=True)


class MistakeReport(models.Model):
    type = models.CharField(max_length=20)
    subject = models.CharField(max_length=100)
    text = models.TextField(max_length=500)
    date = models.DateTimeField(auto_now_add=True)
    added_by = models.ForeignKey(User, related_name="reported_mistakes", on_delete=models.SET_NULL, null=True)
    served = models.BooleanField(default=False)
    served_by = models.ForeignKey(User, related_name="served_reports", on_delete=models.SET_NULL, null=True)
    comment = models.TextField(blank=True)
