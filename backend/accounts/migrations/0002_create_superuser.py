from django.db import migrations

def create_superuser(apps, schema_editor):
    User = apps.get_model('accounts', 'CustomUser')
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='admin12345',
            full_name='Администратор',
            is_admin=True
        )

class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),  # или другой номер, если 0001 уже не актуален
    ]

    operations = [
        migrations.RunPython(create_superuser),
    ]
