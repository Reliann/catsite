# Generated by Django 4.0 on 2021-12-30 03:10

import catlogs.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('catlogs', '0003_alter_log_feed_time'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cat',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to=catlogs.models.upload_to),
        ),
        migrations.AlterField(
            model_name='log',
            name='amount',
            field=models.CharField(blank=True, choices=[('s', 'small'), ('m', 'medium'), ('l', 'large')], default='s', max_length=60, null=True),
        ),
    ]
