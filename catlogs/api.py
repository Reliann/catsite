from django.db.models.query import QuerySet
from .models import Cat, User, Log
from rest_framework import serializers
from .serializers import CatSerializer, UserSerializer, LogSerializer, BasicCatSerializer
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import NotAuthenticated
from rest_framework import status
from .permissions import Owner ,HasCatPasskey, IsRequestUser
from django.shortcuts import get_object_or_404
from django.db import IntegrityError

class UserViewSet(viewsets.GenericViewSet):
    """
    methods: / - post (AllowAny)
                /pk - put  (IsRequestUser, admin)
                /pk - get  (AllowAny)
    """
    permission_classes = (permissions.AllowAny,)
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def create(self, request,):
        """create a user"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        # save method will execute the create method on serializer with the validated_data
        try:
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except IntegrityError as e:
            error_message = str(e.__cause__).split(".")[1]
            return Response({error_message:["This "+error_message+" already exists in the system",]},status=status.HTTP_409_CONFLICT)
    
    # override of the default 'get' 
    def retrieve(self, request,pk):
        """get a user"""
        user = get_object_or_404(self.queryset, username=pk)
        serializer = self.get_serializer(user)
        return Response(serializer.data)
    
    def update(self,request,pk):
        """update a user"""
        user = get_object_or_404(self.queryset, username=pk)
        serializer = self.get_serializer(user,request.data)
        serializer.is_valid(raise_exception=True)
        try:
            user = serializer.save()
            return Response(serializer.data)
        except IntegrityError as e:
            error_message = str(e.__cause__).split(".")[1]
            return Response({error_message:["This "+error_message+" already exists in the system",]},status=status.HTTP_409_CONFLICT)    
        
    def get_permissions(self):
        if  self.action == 'update':
            permission_classes = [IsRequestUser, permissions.IsAuthenticated]
        else:
            permission_classes = self.permission_classes
        return [permission() for permission in permission_classes]


class CatViewSet(viewsets.GenericViewSet):
    """
    methods: / - post (AllowAny)
            /pk - put (owner or admin)
            /pk - get (owner, HasPasskey, admin)
            /pk - delete (owner, admin)
            /pk/log - post (owner, HasPasskey, admin)
            /pk/passkey - get (owner)
    """
    queryset = Cat.objects.all()
    serializer_class = CatSerializer
    permission_classes = (permissions.AllowAny,)

    # only logged users can create a cat
    # to prevent cat with diffrent owner in list of cats, only user can add his own cat
    def create(self,request):
        """create a cat owned by user"""
        print(request.data)
        serializer = CatSerializer(data= request.data)
        serializer.is_valid(raise_exception=True)   
        try:
            cat = serializer.save(owner = request.user) #creating a cat with user as owner
        except Exception as e:
            return Response({"detail":str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    #update existing cat
    def update(self,request, pk):
        """update existing cat"""
        cat = self.get_object()
        serializer = self.get_serializer(cat,request.data)
        serializer.is_valid(raise_exception=True)
        cat = serializer.save()
        return Response(serializer.data)

    def retrieve(self, request,pk):
        """get a single cat - with logs if they have passkey, or owners."""
        try:
            cat = self.get_object()
        except NotAuthenticated as e:
            if not request.META.get('HTTP_CAT_PASSKEY'):
                base_cat = self.queryset.get(pk=pk)
                base_cat_serializer = BasicCatSerializer(base_cat)
                return Response(base_cat_serializer.data)
            else:
                return Response({},status=status.HTTP_403_FORBIDDEN)
        
        serializer = self.serializer_class(cat)
        return Response(serializer.data)
        
    @action(methods=['GET'], detail=True, url_name="passkey")
    def passkey(self, request, pk):
        """get a cat's passkey"""
        cat = get_object_or_404(self.queryset,pk = pk)
        try:
            passkey=  cat.cat_passkey
        except ValueError:
            return Response()
        return Response({'cat_passkey':passkey})

    # feed a cat (permission to view)
    @action(methods=['POST'], detail=True, url_name="log")
    def log(self,request, pk ):
        """adds a log to a cat"""
        cat = self.get_object()
        log_serializer = LogSerializer(data=request.data)
        log_serializer.is_valid(raise_exception=True)
        log = log_serializer.save()
        cat.add_log(log)
        return Response(log_serializer.data, status=status.HTTP_201_CREATED)

    def destroy(self, request,pk):
        """delete a cat"""
        cat = get_object_or_404(self.queryset, pk=pk)
        try:
            cat.delete()
        except Exception as e:
            return Response({"detail":str(e)},status.HTTP_503_SERVICE_UNAVAILABLE)
        return Response({},status=204)

    def get_permissions(self):
        if self.action == 'retrieve' or self.action == 'log':
            permission_classes = (Owner | HasCatPasskey ,)
        elif self.action == 'update' or self.action == 'destroy' or self.action=='passkey':
            permission_classes = [Owner, ]
        elif self.action == 'create':
            permission_classes = [permissions.IsAuthenticated,]
        else:
            permission_classes = self.permission_classes
        return [permission() for permission in permission_classes]