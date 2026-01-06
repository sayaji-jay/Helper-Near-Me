# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Helper Near Me is a Flask-based web application that connects users with local service workers (plumbers, electricians, carpenters, etc.). The application uses MongoDB for data storage and is deployed on Vercel.

## Architecture

### Backend Structure

**Flask Application** ([app.py](app.py))
- Main application file containing all routes and API endpoints
- Uses MongoDB for data persistence
- Template-based rendering with Jinja2
- RESTful API endpoints for user management

**Database Layer** ([database.py](database.py))
- MongoDB connection management via singleton pattern
- Global `mongodb` instance handles connections
- Automatic index creation for search optimization
- Text indexes on name, location, description, and skills fields
- Unique index on email field

**Data Models** ([models.py](models.py))
- `UserModel` class provides static methods for data validation and serialization
- User schema: name, email, phone, location, skills (array), description, experience, avatar
- Auto-generates UI-Avatars URLs when avatar not provided
- Handles MongoDB ObjectId serialization to string IDs

### Frontend Structure

**Templates** (templates/)
- [base.html](templates/base.html) - Base template with Tailwind CSS
- [home.html](templates/home.html) - Landing page with user search, filtering, testimonials, and FAQs
- [add_user.html](templates/add_user.html) - User creation and bulk upload interface
- [admin.html](templates/admin.html) - Admin panel for user management
- [404.html](templates/404.html), [500.html](templates/500.html) - Error pages

All templates extend base.html and use inline Tailwind CSS styling.

### Key Features

**User Management**
- CRUD operations via REST API endpoints
- Email uniqueness validation
- Skills stored as array for multi-tagging
- Automatic timestamp tracking (created_at, updated_at)

**Search & Filtering**
- Search across name, location, description, skills, email, phone using MongoDB regex
- Multi-skill filtering with comma-separated values
- Pagination support via query parameters (page, limit)
- Returns total count and page metadata

**Bulk Upload**
- Supports CSV and Excel file uploads
- Pandas-based data processing
- Row-level error tracking with detailed error messages
- Automatic skill string-to-array conversion
- Email duplicate checking during bulk operations

## Development Commands

### Environment Setup
```bash
# Create virtual environment
python -m venv .venv

# Activate virtual environment
source .venv/bin/activate  # Linux/Mac
.venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt
```

### Running the Application
```bash
# Run development server (default port 8000)
python app.py

# The app runs on http://0.0.0.0:8000
```

### Testing
```bash
# Run basic test script
python test_app.py
```

### MongoDB Configuration
Set environment variables for MongoDB connection:
- `MONGODB_URI` - MongoDB connection string (default: mongodb://localhost:27017/)
- `DB_NAME` - Database name (default: worker_near_me)

The app uses a "users" collection within the configured database.

## API Endpoints

### User CRUD
- `GET /api/users` - List users with search, filter, and pagination
  - Query params: search, skills, page, limit
- `GET /api/users/<user_id>` - Get single user
- `POST /api/users` - Create user (JSON body)
- `PUT /api/users/<user_id>` - Update user (JSON body)
- `DELETE /api/users/<user_id>` - Delete user

### Utilities
- `POST /api/users/bulk-upload` - Bulk upload users from CSV/Excel
- `GET /api/users/template/download` - Download CSV template
- `GET /api/skills` - Get all unique skills across users

## Deployment

Configured for Vercel deployment via [vercel.json](vercel.json). All routes proxy through app.py.

## Important Notes

- MongoDB connection is lazy-loaded via `@app.before_request` hook
- Skills must always be arrays, conversion happens in bulk upload
- Email addresses are lowercased before storage/comparison
- User IDs in API responses are string representations of ObjectId
- Avatar URLs auto-generate using ui-avatars.com API with name parameter
- NaN/empty avatar values trigger auto-generation
