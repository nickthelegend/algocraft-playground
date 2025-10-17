# Database Setup Guide

## Overview
This project uses PostgreSQL via Supabase with Prisma ORM for database management.

## Environment Variables
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Database URLs
DATABASE_URL=postgresql://postgres.project:password@host:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.project:password@host:5432/postgres
```

## Database Schema

### Projects Table
```sql
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "slugname" TEXT NOT NULL UNIQUE,
    "link" TEXT,
    "repoUrl" TEXT,
    "template_type" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "json" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install prisma @prisma/client
```

### 2. Generate Prisma Client
```bash
npx prisma generate
```

### 3. Run Migrations
```bash
# Development
npx prisma migrate dev --name init

# Production
npx prisma migrate deploy
```

### 4. Test Connection
```bash
node test/connection-final.test.js
```

## Supabase Storage Setup

### Create Storage Bucket
1. Go to Supabase Dashboard → Storage
2. Create bucket: `project-files`
3. Set public access if needed

### RLS Policies
```sql
-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Users can only see their own projects
CREATE POLICY "Users can view own projects" ON projects
    FOR SELECT USING (auth.uid()::text = user_id);

-- Users can insert their own projects
CREATE POLICY "Users can insert own projects" ON projects
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Users can update their own projects
CREATE POLICY "Users can update own projects" ON projects
    FOR UPDATE USING (auth.uid()::text = user_id);
```

## API Endpoints

### GET /api/projects
Fetch user's projects

### POST /api/add-project
Create new project
```json
{
  "name": "Project Name",
  "description": "Description",
  "templateType": "TealScript",
  "repoUrl": "https://github.com/user/repo"
}
```

### POST /api/deploy
Deploy from external source
```json
{
  "templateType": "TealScript",
  "signedURL": "https://storage.url/file.zip"
}
```

## Troubleshooting

### Connection Issues
- Check if DATABASE_URL and DIRECT_URL are correct
- Ensure Supabase project is active
- Verify network connectivity

### Migration Errors
- Use DIRECT_URL for migrations
- Check database permissions
- Ensure schema is valid

### Storage Issues
- Verify bucket exists and has correct permissions
- Check RLS policies
- Ensure file upload limits are appropriate