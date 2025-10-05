# Supabase Setup Guide

This guide will help you set up Supabase for the Smart City Management System.

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up for a free account (or sign in if you already have one)
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: `smartcity-management-system`
   - **Database Password**: Choose a strong password
   - **Region**: Choose the closest region to your users
6. Click "Create new project"
7. Wait for the project to be ready (usually takes 1-2 minutes)

## 2. Set Up Database Schema

1. In your Supabase dashboard, go to the **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `database_schema.sql` from this project
4. Paste it into the SQL Editor
5. Click "Run" to execute the schema
6. You should see success messages for all the table creations

## 3. Get API Credentials

1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **anon public** key (starts with `eyJ...`)
   - **service_role** key (starts with `eyJ...`)

## 4. Configure Environment Variables

1. Copy `env.example` to `.env`:
   ```bash
   cp env.example .env
   ```

2. Update `.env` with your Supabase credentials:
   ```env
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRES_IN=24h
   PORT=5000
   NODE_ENV=development
   UPLOAD_DIR=uploads
   MAX_FILE_SIZE=10485760
   FRONTEND_URL=http://localhost:3000
   ```

## 5. Test the Connection

1. Start your backend server:
   ```bash
   npm run dev
   ```

2. You should see a message: "Connected to Supabase database"

## 6. Optional: Set Up Row Level Security (RLS)

For enhanced security, you can enable Row Level Security on your tables:

1. Go to **Authentication** → **Policies**
2. Enable RLS on tables like `grievances`, `announcements`, etc.
3. Create policies to restrict access based on user roles

Example policy for grievances table:
```sql
-- Allow citizens to see only their own grievances
CREATE POLICY "Citizens can view own grievances" ON grievances
FOR SELECT USING (
  citizen_id IN (
    SELECT citizen_id FROM citizens WHERE user_id = auth.uid()
  )
);

-- Allow admins to see all grievances
CREATE POLICY "Admins can view all grievances" ON grievances
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users WHERE user_id = auth.uid() AND role = 'admin'
  )
);
```

## 7. Optional: Set Up Storage for File Uploads

1. Go to **Storage** in your Supabase dashboard
2. Create a new bucket called `uploads`
3. Set it to public if you want direct access to uploaded files
4. Configure CORS if needed

## 8. Database Features Available

With Supabase, you get additional features:

- **Real-time subscriptions**: Listen to database changes in real-time
- **Built-in authentication**: Can be used instead of custom JWT
- **Storage**: File uploads and management
- **Edge Functions**: Serverless functions
- **Dashboard**: Visual database management

## Troubleshooting

### Connection Issues
- Verify your Supabase URL and keys are correct
- Check that your project is not paused (free tier projects pause after inactivity)
- Ensure your database password is correct

### Schema Issues
- Make sure you ran the entire `database_schema.sql` file
- Check the SQL Editor for any error messages
- Verify all tables were created in the Table Editor

### API Issues
- Check that you're using the correct API keys
- Verify your environment variables are loaded correctly
- Check the Supabase logs in the dashboard for any errors

## Next Steps

Once Supabase is set up:

1. Start your backend server: `npm run dev`
2. Start your frontend: `cd frontend && npm run dev`
3. Test the application by registering a user
4. Submit a test grievance
5. Check the Supabase dashboard to see the data

## Support

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Community](https://github.com/supabase/supabase/discussions)
- [Supabase Discord](https://discord.supabase.com)
