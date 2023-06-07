import json
from django.shortcuts import get_object_or_404
from django.utils import timezone
from backend.models import Species, Comment, UserLink, MistakeReport
from django.contrib.auth.models import User
from rest_framework import viewsets, permissions, generics, filters, status
from rest_framework.response import Response
from rest_framework.views import APIView
from knox.models import AuthToken
from secrets import token_urlsafe
from django.conf import settings
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from os import path, remove
from shutil import rmtree
from .serializers import (
    AdminSpeciesSerializer,
    MistakeReportsSerializer,
    UserSerializer,
    CompleteUserSerializer,
    RegisterSerializer,
    LoginSerializer,
    ChangePasswordSerializer,
    SpeciesSerializer,
    MiniSpeciesSerializer,
    CommentsSerializer,
    UserCommentsSerializer,
)
from .paginators import SearchResultsPaginator, CategoryPaginator, UserCommentsPaginator
from .permissions import FullStaffPostUserOrReadOnly, PostUserOrStaffOnly
from .postman import send_mail


# Register
class RegisterAPI(generics.GenericAPIView):
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        user.is_active = False
        user.save()
        link = token_urlsafe(32)
        user_link = UserLink(user=user, activation=link)
        user_link.save()
        message = 'Aktywuj konto klikając w <a href="http://127.0.0.1:8000/#/activateAccount/{}">link</a>.'.format(
            link
        )
        send_mail("reefbasepl@gmail.com", user.email, "Witamy na ReefBase.pl!", message)
        return Response({"detail": "Nowe konto zostało utworzone."})


# Login
class LoginAPI(generics.UpdateAPIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        user.last_login = timezone.now()
        user.save()
        return Response(
            {
                "user": UserSerializer(user, context=self.get_serializer_context()).data,
                "token": AuthToken.objects.create(user)[1],
            }
        )


# Change password
class ChangePasswordAPI(generics.GenericAPIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    serializer_class = ChangePasswordSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(request.user, data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {
                "user": UserSerializer(user, context=self.get_serializer_context()).data,
                "token": AuthToken.objects.create(user)[1],
            }
        )


# Forgotten password - get link to set new password
class ForgottenPasswordAPI(APIView):
    def post(self, request, *args, **kwargs):
        try:
            email = request.data["email"]
            user = User.objects.get(email=email)
            user_link = UserLink.objects.get(user=user)
            link = token_urlsafe(32)
            user_link.set_new_password = link
            user_link.save()
            message = 'Kliknij w <a href="http://127.0.0.1:8000/#/setNewPassword/{}">link</a>, aby ustawić nowe hasło.'.format(
                link
            )
            send_mail("reefbasepl@gmail.com", email, "ReefBase.pl - zapomniane hasło", message)
        finally:
            return Response({"detail": "Link do zmiany hasła został wysłany."})


# Set new password
class SetNewPasswordAPI(generics.GenericAPIView):
    serializer_class = ChangePasswordSerializer

    def post(self, request, *args, **kwargs):
        try:
            link = request.data["link"]
            user_link = UserLink.objects.get(set_new_password=link)
            user_link.set_new_password = None
            user_link.save()
            user_id = user_link.user.id
            user = User.objects.get(id=user_id)
            serializer = self.get_serializer(user, data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
            return Response({"detail": "Nowe hasło zostało ustawione. Możesz się zalogować."})
        except:
            return Response(
                {"detail": "Niewłaściwy token. Nie udało sie zmienić hasła."}, status=status.HTTP_404_NOT_FOUND
            )


# Delete account
class DeleteAccountAPI(APIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def delete(self, request, *args, **kwargs):
        user = self.request.user
        user.delete()
        return Response({"detail": "Konto zostało usunięte."})


# Activate account
class ActivateAccountAPI(APIView):
    def post(self, request, *args, **kwargs):
        try:
            link = request.data["link"]
            user_link = UserLink.objects.get(activation=link)
            user_link.activation = None
            user_link.save()
            user_id = user_link.user.id
            user = User.objects.get(id=user_id)
            user.is_active = True
            user.save()
            return Response({"detail": "Konto zostało aktywowane."})
        except:
            return Response(
                {"detail": "Niewłaściwy token. Konto nie zostało aktywowane."}, status=status.HTTP_404_NOT_FOUND
            )


# Get basic User data
class UserAPI(generics.RetrieveAPIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


# Get complete User data
class CompleteUserAPI(generics.RetrieveAPIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    serializer_class = CompleteUserSerializer

    def get_object(self):
        return self.request.user


# Get all species added by user
class UserSpeciesAPI(generics.ListAPIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    serializer_class = MiniSpeciesSerializer
    pagination_class = CategoryPaginator

    def get_queryset(self):
        return Species.objects.filter(accepted=True, added_by=self.request.user).order_by("species")


# Get all comments added by user
class UserCommentsAPI(generics.ListAPIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    serializer_class = UserCommentsSerializer
    pagination_class = UserCommentsPaginator

    def get_queryset(self):
        return Comment.objects.filter(author=self.request.user).order_by("date")


# Get all species from category
class CategoryAPI(generics.ListAPIView):
    serializer_class = MiniSpeciesSerializer
    pagination_class = CategoryPaginator

    def get_queryset(self):
        return Species.objects.filter(accepted=True, category=self.kwargs.get("name")).order_by("species")


# Get all species from rank
class RankAPI(generics.ListAPIView):
    serializer_class = MiniSpeciesSerializer
    pagination_class = CategoryPaginator

    def get_queryset(self):
        name = self.kwargs.get("name")
        species = (
            Species.objects.filter(regnum=name)
            | Species.objects.filter(phylum=name)
            | Species.objects.filter(classis=name)
            | Species.objects.filter(ordo=name)
            | Species.objects.filter(familia=name)
            | Species.objects.filter(genus=name)
        )
        return species.filter(accepted=True).order_by("species")


# Get all species, get species by slug, add species, update species (put request /slug/)
class SpeciesViewSet(viewsets.ModelViewSet):
    permission_classes = [FullStaffPostUserOrReadOnly]
    serializer_class = SpeciesSerializer
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    lookup_field = "slug"

    def get_queryset(self):
        return Species.objects.all().order_by("species")

    def retrieve(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        filter = {self.lookup_field: self.kwargs[self.lookup_field]}
        species = get_object_or_404(queryset, **filter)
        if species.accepted:
            return Response(self.get_serializer(species).data)
        else:
            return Response({"detail": "Gatunek oczekuje na akceptacje."}, status=status.HTTP_204_NO_CONTENT)

    def list(self, request, *args, **kwargs):
        queryset = Species.objects.filter(accepted=True).order_by("species")
        page = self.paginate_queryset(queryset)
        if page is not None:
            return self.get_paginated_response(self.get_serializer(page, many=True).data)
        return Response(self.get_serializer(queryset, many=True).data)

    def perform_create(self, serializer):
        serializer.save(added_by=self.request.user)

    def perform_update(self, serializer):
        prev_image = ""  # file
        prev_thumbnail = ""  # dir
        if "image" in self.request.data:
            instance = self.get_object()
            prev_image = settings.MEDIA_ROOT + str(instance.image)
            prev_thumbnail = settings.MEDIA_ROOT + "CACHE/images/" + str(instance.image)[:-4]
        if "accepted_by" in self.request.data:
            serializer.save(accepted_by=self.request.user)
        else:
            serializer.save()
        if path.exists(prev_image):
            remove(prev_image)
        if path.isdir(prev_thumbnail):
            rmtree(prev_thumbnail)

    def destroy(self, request, *args, **kwargs):
        return Response(status=status.HTTP_403_FORBIDDEN)


# Get comments, create comment, delete comment
class CommentsViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    serializer_class = CommentsSerializer

    def get_queryset(self):
        return Comment.objects.all().order_by("date")

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def destroy(self, request, *args, **kwargs):
        comment = self.get_object()
        if request.user == comment.author:
            related = Comment.objects.filter(parent=comment.id)
            for rel in related:
                rel.delete()
            self.perform_destroy(comment)
            return Response({"detail": "Komentarz został usunięty"})
        else:
            return Response(
                {"detail": "Nie można usunąć komentarza innego użytkownika"}, status=status.HTTP_403_FORBIDDEN
            )


# Suggestions for search    /api/search?search="szukana_fraza"
class SearchAPI(generics.ListAPIView):
    serializer_class = MiniSpeciesSerializer
    pagination_class = SearchResultsPaginator
    filter_backends = [filters.SearchFilter]
    search_fields = ["species"]  # , 'genus', 'familia', 'ordo', 'classis', 'phylum', 'regnum'

    def get_queryset(self):
        return Species.objects.filter(accepted=True).order_by("species")


# Filter species    /api/filter?param=value&...
class FilterAPI(generics.ListAPIView):
    serializer_class = MiniSpeciesSerializer
    pagination_class = CategoryPaginator

    def get_queryset(self):
        queryset = Species.objects.filter(accepted=True).order_by("species")
        for param in self.request.query_params:
            if param == "page":
                continue
            if param in ["picky_eater", "reefsafe"]:
                param_value = json.loads(self.request.query_params.get(param))
            else:
                param_value = self.request.query_params.get(param)
            if param == "size":
                queryset = queryset.filter(size__lte=param_value)
            elif param == "tank_size":
                queryset = queryset.filter(min_tank__lte=param_value)
            elif param == "distribution":
                queryset = queryset.filter(distribution__contains=param_value)
            elif param == "food":
                queryset = queryset.filter(food__contains=param_value)
            else:
                queryset = queryset.filter(**{param: param_value})
        return queryset


# Get all unaccepted species
class UnacceptedSpeciesAPI(generics.ListAPIView):
    permission_classes = [permissions.IsAdminUser]
    serializer_class = AdminSpeciesSerializer
    pagination_class = CategoryPaginator

    def get_queryset(self):
        return Species.objects.filter(accepted=False).order_by("species")


# Create mistake report, get all reports, serve
class MistakeReportsViewSet(viewsets.ModelViewSet):
    permission_classes = [PostUserOrStaffOnly]
    serializer_class = MistakeReportsSerializer

    def get_queryset(self):
        return MistakeReport.objects.filter(type="species", served=False).order_by("date")

    def perform_create(self, serializer):
        serializer.save(added_by=self.request.user)

    def perform_update(self, serializer):
        serializer.save(served_by=self.request.user, served=True)
