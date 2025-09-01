# Database Inconsistency Debug Guide

## Issue Description
Django connects to "ejder3200hub" database but frontend appears to expect "proajanda" database.

## Debugging Steps

### Step 1: Verify Database Connection
```powershell
cd "c:\Users\kenan\Desktop\Design documents\ejder3200hub\backend_django"
.\vnex\Scripts\Activate.ps1
python manage.py shell -c "from django.conf import settings; print('DB Name:', settings.DATABASES['default']['NAME']); print('DB Host:', settings.DATABASES['default']['HOST'])"
```

### Step 2: Check Current Data
```powershell
# Check if any events exist
python manage.py shell -c "from apps.events.models import Event; print('Event count:', Event.objects.count())"

# Check all tables
python manage.py shell -c "from django.apps import apps; [print(f'{model._meta.db_table}: {model.objects.count()}') for model in apps.get_models()]"
```

### Step 3: Verify Migrations
```powershell
# Check migration status
python manage.py showmigrations

# Apply any pending migrations
python manage.py makemigrations
python manage.py migrate
```

### Step 4: Create Test Data
```powershell
# Create a test event
python manage.py shell -c "
from apps.events.models import Event
from apps.projects.models import Project
try:
    p = Project.objects.create(name='Test Project', description='Test', status='active')
    e = Event.objects.create(title='Test Event', description='Test event', project=p)
    print(f'Created event: {e.title} with ID: {e.id}')
except Exception as ex:
    print(f'Error: {ex}')
"
```

### Step 5: Test API Response
```powershell
# In a new PowerShell window
Invoke-WebRequest -Uri "http://localhost:8000/api/v1/events/"
```

### Step 6: Check Frontend API Calls
1. Open browser Developer Tools (F12)
2. Go to Network tab
3. Try to create an event in the frontend
4. Check what requests are made and their responses

## Possible Solutions

### Solution 1: Fix Database Host
If you added data on `192.168.0.14` but Django connects to `10.65.2.166`:

Update `backend_django/.env`:
```
DB_HOST=192.168.0.14
```

### Solution 2: Recreate Database Schema
If there are schema conflicts:

```powershell
# Drop and recreate tables (CAUTION: This deletes all data)
python manage.py flush
python manage.py migrate
```

### Solution 3: Fix Migration Issues
If Django models don't match database schema:

```powershell
# Create new migrations
python manage.py makemigrations --empty apps.events
python manage.py makemigrations --empty apps.projects
# Edit migration files to match existing schema
python manage.py migrate --fake
```

## Quick Test
After each solution attempt, run this quick test:

1. Restart Django server: `python manage.py runserver 0.0.0.0:8000`
2. Test API: `Invoke-WebRequest -Uri "http://localhost:8000/api/v1/events/"`
3. Test frontend: Open http://localhost:5173 and try creating an event

## Debug Browser Issues
If the issue is browser-related:

1. Clear browser cache and localStorage
2. Open Developer Tools → Application → Storage → Clear all
3. Hard refresh (Ctrl+F5)