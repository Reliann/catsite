from django.contrib import admin
from .models import Cat
from .models import User
from django.contrib.auth.models import Group

# there is no real need to customize admin panel since there are no admins...
# but why not :D
@admin.register(User)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('email','username','date_joined','last_login','email_verified','is_staff')
    search_fields = ('email','username')
    readonly_fields =('id','date_joined','last_login', 'email_verified', 'cats','password')
    
    filter_horizontal = ()
    list_filter=()
    fieldsets = ()

#admin.site.register(User, CustomUserAdmin)
admin.site.unregister(Group)
admin.site.register(Cat)