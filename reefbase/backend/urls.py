from django.urls import path, include
from django.db import router
from rest_framework import routers
from .api import (
    ActivateAccountAPI,
    ChangePasswordAPI,
    ForgottenPasswordAPI,
    DeleteAccountAPI,
    RegisterAPI,
    LoginAPI,
    SetNewPasswordAPI,
    UserAPI,
    CompleteUserAPI,
    SpeciesViewSet,
    UserSpeciesAPI,
    UserCommentsAPI,
    CategoryAPI,
    RankAPI,
    CommentsViewSet,
    SearchAPI,
    FilterAPI,
    UnacceptedSpeciesAPI,
    MistakeReportsViewSet,
)
from knox import views as knox_views

router = routers.DefaultRouter()
router.register("species", SpeciesViewSet, "species")
router.register("comments", CommentsViewSet, "comments")
router.register("mistakeReports", MistakeReportsViewSet, "mistakeReports")

urlpatterns = [
    path("auth", include("knox.urls")),
    path("auth/register", RegisterAPI.as_view()),
    path("auth/login", LoginAPI.as_view()),
    path("auth/user", UserAPI.as_view()),
    path("auth/cpltuser", CompleteUserAPI.as_view()),
    path("auth/logout", knox_views.LogoutView.as_view()),
    path("auth/changePassword", ChangePasswordAPI.as_view()),
    path("auth/deleteAccount", DeleteAccountAPI.as_view()),
    path("auth/activateAccount", ActivateAccountAPI.as_view()),
    path("auth/forgottenPassword", ForgottenPasswordAPI.as_view()),
    path("auth/setNewPassword", SetNewPasswordAPI.as_view()),
    path("auth/userSpecies", UserSpeciesAPI.as_view()),
    path("auth/userComments", UserCommentsAPI.as_view()),
    path("category/<name>", CategoryAPI.as_view()),
    path("rank/<name>", RankAPI.as_view()),
    path("search", SearchAPI.as_view()),
    path("filter", FilterAPI.as_view()),
    path("admin/unacceptedSpecies", UnacceptedSpeciesAPI.as_view()),
]

urlpatterns += router.urls
