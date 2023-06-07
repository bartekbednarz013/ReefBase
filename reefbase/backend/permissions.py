from rest_framework import permissions

SAFE_METHODS = [ 'GET', 'HEAD', 'OPTIONS']
USER_METHODS = [ 'POST' ]

class FullStaffPostUserOrReadOnly(permissions.BasePermission):
    """
    The request is authenticated as a user, or is a read-only request.
    PUT, DELETE methods for staff only.
    """

    def has_permission(self, request, view):
        if (request.method in SAFE_METHODS or
            request.user and (request.user.is_authenticated and request.method in USER_METHODS or
            request.user.is_staff)):
            return True
        return False


class PostUserOrStaffOnly(permissions.BasePermission):
    """
    Only POST for users.
    """

    def has_permission(self, request, view):
        if (request.user and (request.user.is_authenticated and request.method in USER_METHODS or
            request.user.is_staff)):
            return True
        return False