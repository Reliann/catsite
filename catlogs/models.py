from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
import uuid
from django.utils.translation import gettext_lazy as _
# quite cool they added a short uuid django field
from shortuuid.django_fields import ShortUUIDField

import cloudinary
from django.conf import settings

CAT_HUB_IDENTIFIER_LENGTH = 8
MAX_CATS_PER_USER = 5
MAX_LOGS_PER_CAT = 20

class UserManager(BaseUserManager):
    # this is needed because the field is required
    def create_user(self, email, username, password=None, **extra_fields):
        if not email:
            raise ValueError("Email adress is required")
        if not username:
            raise ValueError("Username adress is required")
        
        user = self.model(email=self.normalize_email(email), username=username,**extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, username, password):
        user = self.create_user(email=self.normalize_email(email), username=username, password=password)

        user.is_superuser = True
        user.is_admin = True
        user.is_staff = True

        user.save(using=self._db)
        return user

class User(AbstractUser):
    # AbstractUser because I'm happy about the defaults and just wany to add this line:
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True) # why not unique  
    email = models.EmailField(verbose_name='email address', max_length=255, unique=True,)
    # usernames are unique, and should propbably be in the url ...
    username = models.CharField(max_length=20, unique=True)
    email_verified = models.BooleanField(default=False)
    cats = models.ManyToManyField('Cat', blank = True, related_name="cats", ) 
    
    objects = UserManager()
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']    # so user can also log in using email

    def __str__(self):
        return self.username

    def has_perm(self, perm):
        return self.is_superuser
    
    def has_module_perms(self, app_label):
        return True

def upload_to(instance, filename):
    return "users/{0}/cats/{1}/profile".format(instance.owner.id,instance.id)


class Cat(models.Model):
    """cat  (1 owner)"""
    id = ShortUUIDField(primary_key=True,  length=CAT_HUB_IDENTIFIER_LENGTH, unique=True) # why not unique   
    cat_name = models.CharField(max_length=200)
    creation_date = models.DateTimeField(auto_now_add=True)
    owner = models.ForeignKey('User', related_name="owner",on_delete=models.CASCADE, null=True) 
    #image = models.CharField(blank=True)    # if the image is sent as base 64 
    #image = models.ImageField( blank=True)     #if the image is saved locallu
    #image = CloudinaryField('image', blank=True,null=True)    # if the image is in cloudinary
    image = models.ImageField( blank=True, null=True, upload_to=upload_to)     #cloudinary-storage
    logs = models.ManyToManyField('Log', blank = True, related_name="logs",)
    updated = models.DateTimeField(auto_now=True)
    cat_passkey = models.CharField(max_length=20)

    def __str__(self) -> str:
        return "{0} owned by {1}".format(self.cat_name,self.owner.username)

    def delete(self):
        """I don't want to only delete the image, I want to delete the whole 
        folder. by first deleting the image, then the folder."""
        if self.image:
            self.image.delete()
            try:
                cloudinary.api.delete_folder("{0}users/{1}/cats/{2}".format(settings.MEDIA_URL,self.owner.id,self.id))
            except Exception:
                raise Exception("Cannot delete at this time")
        super().delete()


    def save(self, *args, **kwargs):
        """user can't have 2 cats with the same name, and also """
        if self.cat_name in [cat.cat_name for cat in self.owner.cats.all() if cat.id != self.id]:
            # in other ords: in all other cats but this cat
            raise Exception("User Already has a cat named {0}".format(self.cat_name))

        if self._state.adding:  # only if a new instance is created
            if self.owner.cats.count()>=MAX_CATS_PER_USER:
                raise Exception("A user is allowd to have a maximum amount of "+str(MAX_CATS_PER_USER)+" cats.")
                #return  # user is limited to N cats
            else:
                super().save(*args, **kwargs)  # Call the "real" save() method.
                self.owner.cats.add(self) # Have the my owner add this cat to their cats..
        else:
            # if the image has changed on an update, delete the old one.
            try:
                this = Cat.objects.get(id=self.id)
                if this.image != self.image:
                    this.image.delete(save=False)
            except:
                pass 
            super().save(*args, **kwargs)

    def add_log(self, log_to_add):
        """I limit the amount of logs a cat cat have
        by deleting the oldest log... Do this instead of adding
        a log directly"""
        if self.logs.count() >= MAX_LOGS_PER_CAT:
            all_logs = self.logs.all()
            oldest_log = all_logs[0]
            for log in all_logs:
                if oldest_log.feed_time> log.feed_time:
                    oldest_log = log
            oldest_log.delete()
        self.logs.add(log_to_add)


class Log(models.Model):
    """logs per cat"""
    feed_time = models.DateTimeField()
    comment = models.TextField(max_length=60, blank= True)
    SMALL_AMOUNT = 'small'
    MEDIUM_AMOUNT = 'medium'
    LARGE_AMOUNT = 'large'
    AMOUNT_CHOICES = (
    (SMALL_AMOUNT, 'small'),
    (MEDIUM_AMOUNT, 'medium'),
    (LARGE_AMOUNT, 'large'))

    amount = models.CharField(max_length=60, choices=AMOUNT_CHOICES, default=SMALL_AMOUNT,blank=True, null=True)
    
    def __str__(self) -> str:
        return "The cat ate at " + str(self.feed_time)