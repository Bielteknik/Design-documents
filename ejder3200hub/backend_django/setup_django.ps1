# Django Backend Setup Script
# PowerShell script to set up the Django backend

Write-Host "🚀 Setting up Django Backend for ejder3200hub..." -ForegroundColor Green

# Create virtual environment
Write-Host "Creating Python virtual environment..." -ForegroundColor Yellow
python -m venv venv

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& ".\venv\Scripts\Activate.ps1"

# Install dependencies
Write-Host "Installing Python dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt

# Make migrations
Write-Host "Creating Django migrations..." -ForegroundColor Yellow
python manage.py makemigrations

# Apply migrations
Write-Host "Applying database migrations..." -ForegroundColor Yellow
python manage.py migrate

# Create superuser (optional)
Write-Host "Creating Django superuser..." -ForegroundColor Yellow
Write-Host "You can skip this by pressing Ctrl+C" -ForegroundColor Gray
python manage.py createsuperuser

# Collect static files
Write-Host "Collecting static files..." -ForegroundColor Yellow
python manage.py collectstatic --noinput

Write-Host "✅ Django backend setup complete!" -ForegroundColor Green
Write-Host "To run the server: python manage.py runserver 0.0.0.0:8000" -ForegroundColor Cyan