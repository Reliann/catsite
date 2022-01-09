from rest_framework import serializers
from .models import Cat, User, Log
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from  django.contrib.auth.hashers import make_password

class LogSerializer(serializers.ModelSerializer):
    feed_time = serializers.DateTimeField(required=True)
    class Meta:
        model = Log
        fields = ['comment', 'amount', 'feed_time']
        

class CatSerializer(serializers.ModelSerializer):
    """this is used to read data."""
    cat_name = serializers.CharField()
    cat_passkey = serializers.CharField(max_length=20, write_only=True)
    owner = serializers.CharField( source="owner.username", read_only=True)
    logs = LogSerializer(many=True, read_only=True,)
    image = serializers.ImageField(max_length=None, use_url=True, allow_null=True, required=False)
    class Meta:
        model = Cat
        fields = ('id', 'cat_name','cat_passkey','owner','logs','image')

class BasicCatSerializer(serializers.ModelSerializer):
    """this is used to read data."""
    cat_name = serializers.CharField()
    owner = serializers.CharField( source="owner.username", read_only=True)
    image = serializers.ImageField(max_length=None, use_url=True, allow_null=True, required=False)
    class Meta:
        model = Cat
        fields = ('id','cat_name','owner','image')


class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(write_only=True, required=True)
    username = serializers.CharField()
    first_name = serializers.CharField(required=False , write_only = True)
    last_name = serializers.CharField(required=False , write_only=True)
    password = serializers.CharField(min_length=8, write_only=True)
    cats = CatSerializer(many=True, read_only=True)
    class Meta:
        model = User
        # those fields are the ones getting serialized
        fields = ('first_name', 'last_name','email', 'username', 'password','cats',)

    def update(self, instance, validated_data):
        instance.email_verified = False
        # gotta make a password out of the password
        validated_data['password'] = make_password(validated_data['password']) 
        return super().update(instance, validated_data)
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
        
    def to_representation(self, instance):
        """remove the logs from each cat"""
        # people shoudn't know what others are doing with thier cats!
        ret = super().to_representation(instance)
        for cat in ret["cats"]:
            cat.pop("logs") 
        return ret

    

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """this is how private data is transfered to user"""
    @classmethod
    def get_token(cls, user):
        token = super(CustomTokenObtainPairSerializer, cls).get_token(user)
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        token['email'] = user.email
        token['username'] = user.username
        return token

    def validate(self, attrs):
        credentials = {
            'username': '',
            'password': attrs.get("password")
        }

        user_obj = User.objects.filter(email=attrs.get("username")).first() or User.objects.filter(username=attrs.get("username")).first()
        if user_obj:
            credentials['username'] = user_obj.username
        return super().validate(credentials)

        
    


