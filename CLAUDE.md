# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Helper Near Me is a Next.js 16 application (App Router) that connects users with local service workers (plumbers, electricians, carpenters, etc.). The application uses MongoDB with Mongoose for data persistence and is designed for deployment on Vercel.

## Project Structure

The application lives in the **[my-app](my-app/)** directory with the following key components:

- **[my-app/app/](my-app/app/)** - Next.js App Router pages and API routes
- **[my-app/components/](my-app/components/)** - React components (HomePage, UserCard, Header, Footer, etc.)
- **[my-app/models/](my-app/models/)** - Mongoose schema definitions
- **[my-app/lib/](my-app/lib/)** - Utilities (MongoDB connection, constants)
- **[my-app/types/](my-app/types/)** - TypeScript type definitions

## Development Commands

All commands should be run from the **my-app** directory:

```bash
cd my-app

# Install dependencies
npm install

# Run development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Run linter
npm run lint
```

## Database Architecture

### MongoDB Connection ([my-app/lib/mongodb.ts](my-app/lib/mongodb.ts))
- Uses Mongoose with connection caching for serverless optimization
- Connection is reused across requests to prevent connection pool exhaustion
- Global singleton pattern for Next.js hot reload compatibility

### User Model ([my-app/models/User.ts](my-app/models/User.ts))

**Schema Fields:**
- `name` (string, required) - User's full name
- `email` (string, optional, lowercase) - Contact email
- `phone` (string, required) - Contact phone number
- `gender` (string, optional, enum: Male/Female/Other)
- `work` (string[], required) - Array of work types/skills (e.g., ["Plumber", "Electrician"])
- `address` (string, optional) - Street address
- `village` (string, optional) - Village name
- `city` (string, optional) - City name
- `state` (string, optional) - State name
- `companyName` (string, optional) - Company name
- `experience` (string, optional) - Years of experience
- `description` (string, optional) - Bio/description
- `avatar` (string, auto-generated) - Profile picture URL (defaults to UI Avatars)
- `createdAt`, `updatedAt` (Date, auto-managed) - Timestamps

**Important Notes:**
- Email is NOT unique and NOT required
- `work` field must be a non-empty array
- Avatar auto-generates using UI Avatars API when not provided
- Model deletes and re-registers on hot reload to prevent Mongoose schema conflicts

**Indexes:**
- Text index on: name, description, work, city, village, state
- Individual indexes on: name, phone, city, state, village, work

## API Endpoints

### User CRUD

**GET /api/users** - List users with search and filtering
- Query params:
  - `search` - Text search across name, city, village, state, description, work, email, phone
  - `work` or `skills` - Filter by work types (comma-separated for multiple)
  - `page` - Page number (default: 1)
  - `limit` - Results per page (default: 100)
- Returns: `{ success, users, total, page, limit, pages }`

**GET /api/users/[id]** - Get single user by ID

**POST /api/users** - Create new user
- Required fields: name, phone, work (array)
- Optional fields: email, gender, address, village, city, state, companyName, experience, description, avatar
- Email uniqueness check is DISABLED (see line 158-167 in [my-app/app/api/users/route.ts](my-app/app/api/users/route.ts))

**PUT /api/users/[id]** - Update existing user

**DELETE /api/users/[id]** - Delete user

### Bulk Upload

**POST /api/users/bulk-upload** - Bulk upload users from CSV
- Accepts CSV file via multipart/form-data
- Uses PapaParse for CSV parsing
- Converts comma-separated `work` string to array
- Row-level error tracking with detailed messages
- Email duplicate checking enabled during bulk upload (unlike single user creation)
- Returns: `{ success, message, count, inserted, errors, error_details }`

**GET /api/users/template/download** - Download CSV template for bulk upload

### Utilities

**GET /api/skills** - Get all unique work types across all users

## Frontend Architecture

### Pages

**[my-app/app/page.tsx](my-app/app/page.tsx)** - Home page (renders HomePage component)

**[my-app/app/admin/page.tsx](my-app/app/admin/page.tsx)** - Admin dashboard for user management
- PIN protected (PIN: "1234" from [my-app/lib/constants.ts](my-app/lib/constants.ts))
- CRUD operations for users

**[my-app/app/admin/add-user/page.tsx](my-app/app/admin/add-user/page.tsx)** - User creation and bulk upload interface

**[my-app/app/admin/edit-user/[id]/page.tsx](my-app/app/admin/edit-user/[id]/page.tsx)** - Edit individual user

### Key Components

**[my-app/components/HomePage.tsx](my-app/components/HomePage.tsx)** - Main landing page with search, filters, user cards

**[my-app/components/UserCard.tsx](my-app/components/UserCard.tsx)** - Worker profile card with contact options

**[my-app/components/Header.tsx](my-app/components/Header.tsx)** - Navigation header

**[my-app/components/Footer.tsx](my-app/components/Footer.tsx)** - Site footer with social links

**[my-app/components/Testimonials.tsx](my-app/components/Testimonials.tsx)** - Customer testimonials carousel (uses Swiper.js)

**[my-app/components/FAQSection.tsx](my-app/components/FAQSection.tsx)** - FAQ accordion

**[my-app/components/CTASection.tsx](my-app/components/CTASection.tsx)** - Call-to-action section

### Layout

**[my-app/app/layout.tsx](my-app/app/layout.tsx)** - Root layout with:
- Header and Footer components
- Google Analytics integration (G-M3C1VX9M59)
- Swiper.js CSS/JS loaded via CDN
- Inter font from Google Fonts

## Important Implementation Details

### Search & Filtering
- Multi-field text search uses MongoDB `$regex` with case-insensitive matching
- Work type filtering supports multiple comma-separated values
- Complex query building with `$and`/`$or` operators for combining search + filters
- Pagination with skip/limit pattern

### Data Serialization
- MongoDB `_id` (ObjectId) converted to string `id` in API responses
- All API responses use consistent format: `{ success: boolean, ... }`
- Lean queries (`.lean()`) for performance when modification not needed

### CSV Bulk Upload Processing
1. File parsed with PapaParse
2. Data cleaned (null/undefined/"NaN" → empty strings)
3. `work` field converted from comma-separated string to array
4. Row-level validation with error collection
5. Email duplicate check per row
6. Individual user creation with error handling

### Avatar Generation
- Auto-generates using `https://ui-avatars.com/api/` with user's name
- Background color: `#667eea`, text color: white, size: 200px
- Triggered when avatar field is undefined, null, or "NaN"

## Environment Variables

Set in environment or `.env.local`:

- `MONGODB_URI` - MongoDB connection string (currently hardcoded in [my-app/lib/mongodb.ts](my-app/lib/mongodb.ts))

## Deployment

Designed for Vercel deployment with Next.js framework detection. The root directory should be set to **my-app** in Vercel project settings.

## Dependencies

**Key packages:**
- `next@16.0.7` - Framework (App Router)
- `react@19.2.0` - UI library
- `mongoose@^8.0.0` - MongoDB ODM
- `papaparse@^5.4.1` - CSV parsing
- `swiper@^11.0.0` - Touch slider for testimonials
- `tailwindcss@^4` - Styling framework
