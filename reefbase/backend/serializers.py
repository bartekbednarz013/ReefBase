from dataclasses import fields
from importlib.metadata import distribution
from rest_framework import serializers
from backend.models import Species, Comment, MistakeReport
from django.contrib.auth.models import User
from django.contrib.auth import authenticate


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email", "is_staff")


class CompleteUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [field.name for field in model._meta.fields]
        fields.remove("password")


class MiniUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username")


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email", "password")
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            validated_data["username"], validated_data["email"], validated_data["password"]
        )
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user:
            return user
        raise serializers.ValidationError("Niewłaściwy login lub hasło")


class ChangePasswordSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["password"]

    def update(self, instance, validated_data):
        instance.set_password(validated_data["password"])
        instance.save()
        return instance


class SpeciesCommentsSerializer(serializers.ModelSerializer):
    author = MiniUserSerializer()

    class Meta:
        model = Comment
        fields = "__all__"
        # depth = 1


class SpeciesSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False)
    image_thumbnail = serializers.ImageField(read_only=True)
    added_by = MiniUserSerializer(read_only=True)
    accepted_by = MiniUserSerializer(read_only=True)
    comments = SpeciesCommentsSerializer(many=True, read_only=True)

    class Meta:
        model = Species
        fields = [field.name for field in model._meta.fields]
        fields.append("comments")
        fields.append("image_thumbnail")
        depth = 1
        extra_kwargs = {"url": {"lookup_field": "slug"}}


class MiniSpeciesSerializer(serializers.ModelSerializer):
    image_thumbnail = serializers.ImageField(read_only=True)

    class Meta:
        model = Species
        fields = ["id", "slug", "species", "image", "image_thumbnail"]


class UserCommentsSpeciesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Species
        fields = ["slug", "species"]


class UserCommentsSerializer(serializers.ModelSerializer):
    author = MiniUserSerializer(read_only=True)
    species = UserCommentsSpeciesSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = "__all__"


class CommentsSerializer(serializers.ModelSerializer):
    author = MiniUserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = "__all__"


class AdminSpeciesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Species
        fields = "__all__"


class MistakeReportsSerializer(serializers.ModelSerializer):
    class Meta:
        model = MistakeReport
        fields = "__all__"


# class TestMistakeReportsSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = MistakeReport
#         fields =
