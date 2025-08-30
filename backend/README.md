# Kardiverse Hologram Backend

Django REST API backend for the Kardiverse hologram demo project.

## Features

- **Scan Tracking**: Records QR/NFC scan events with device and session analytics
- **Sponsor Management**: Configurable sponsor branding with logo and color customization
- **Analytics Dashboard**: Daily analytics aggregation and reporting
- **REST API**: Full CRUD operations for all resources

## Setup

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Database Setup**:
   ```bash
   # Create PostgreSQL database
   createdb kardiverse_db
   
   # Run migrations
   python manage.py makemigrations
   python manage.py migrate
   ```

3. **Environment Configuration**:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Create Superuser**:
   ```bash
   python manage.py createsuperuser
   ```

5. **Run Development Server**:
   ```bash
   python manage.py runserver
   ```

## API Endpoints

### Scan Events
- `POST /api/scans/` - Record a new scan event
- `GET /api/scans/` - List all scan events
- `GET /api/scans/stats/` - Get scan statistics

### Sponsor Configuration
- `GET /api/sponsors/active/` - Get active sponsor config
- `POST /api/sponsors/` - Create sponsor configuration
- `PUT /api/sponsors/{id}/` - Update sponsor configuration

### Analytics
- `GET /api/analytics/` - List daily analytics
- `GET /api/analytics/summary/` - Get analytics summary

## Deployment

1. **Production Settings**:
   - Set `DEBUG=False`
   - Configure `ALLOWED_HOSTS`
   - Set secure `SECRET_KEY`

2. **Database**:
   - Use managed PostgreSQL service (AWS RDS, Google Cloud SQL, etc.)

3. **Static Files**:
   ```bash
   python manage.py collectstatic
   ```

4. **WSGI Server**:
   ```bash
   gunicorn kardiverse_backend.wsgi:application
   ```

## Usage with Frontend

The frontend should make API calls to track scans:

```javascript
// Record a scan event
fetch('http://localhost:8000/api/scans/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    trigger_type: 'qr',
    session_id: 'unique-session-id',
  })
});

// Get active sponsor configuration
fetch('http://localhost:8000/api/sponsors/active/')
  .then(response => response.json())
  .then(sponsor => {
    // Apply sponsor branding
  });
```