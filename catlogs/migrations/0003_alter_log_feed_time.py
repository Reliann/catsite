# Generated by Django 4.0 on 2021-12-27 21:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('catlogs', '0002_rename_creation_date_log_feed_time'),
    ]

    operations = [
        migrations.AlterField(
            model_name='log',
            name='feed_time',
            field=models.DateTimeField(),
        ),
    ]
