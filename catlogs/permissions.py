from rest_framework import permissions

class Owner(permissions.BasePermission):
    """
    Object-level permission to only allow owner of a cat
    """
    def has_permission(self, request, view):
        return True 

    def has_object_permission(self, request, view, obj):
        return request.user.id == obj.owner.id


class HasCatPasskey(permissions.BasePermission):
    """
    only people with the passkey can view it
    """
    def has_permission(self, request, view):
        return True 

    def has_object_permission(self, request, view, obj):
        """those passkeys are shared amoung people, they are not very secret.."""
        return obj.cat_passkey == request.META.get('HTTP_CAT_PASSKEY')

class IsRequestUser(permissions.BasePermission):
    """
    simply checks if whoever made the request is the user they want to change
    """
    def has_permission(self, request, view):
        return True 

    def has_object_permission(self, request, view, obj):
        return obj == request.user

