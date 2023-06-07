from django.contrib import admin
from .models import Species, Comment, MistakeReport

# Register your models here.

admin.site.register(Species)
admin.site.register(Comment)
admin.site.register(MistakeReport)
