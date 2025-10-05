# Smart City Management System

A comprehensive web application for managing city services and citizen grievances using the MERN stack with TypeScript and Tailwind CSS.

## Features

### 🏛️ **Three User Roles**

#### **Citizen Portal**
- **Dashboard**: View grievance status and city announcements
- **Submit Grievance**: Report issues with photos and location
- **My Grievances**: Track all submitted grievances
- **Real-time Updates**: Get notified of status changes

#### **Administrator Portal**
- **Analytics Dashboard**: City-wide statistics and charts
- **Grievance Management**: Assign, update, and track all grievances
- **Announcement System**: Broadcast city-wide updates
- **User Management**: Manage service provider accounts
- **Interactive Maps**: Visualize grievance hotspots

#### **Service Provider Portal**
- **Assigned Tasks**: View and manage assigned grievances
- **Status Updates**: Update resolution progress
- **Performance Metrics**: Track resolution statistics
- **Communication**: Add comments and updates

### 🛠️ **Technical Features**

- **Authentication**: JWT-based secure login system
- **Role-based Access Control**: Different interfaces for each user type
- **File Upload**: Photo attachments for grievances
- **Real-time Updates**: Live status changes and notifications
- **Responsive Design**: Works on all devices
- **Interactive Maps**: Location-based grievance visualization
- **Data Analytics**: Charts and statistics for administrators

## Technology Stack

### Backend
- **Node.js** with **Express.js**
- **TypeScript** for type safety
- **Supabase** (PostgreSQL with additional features)
- **JWT** authentication
- **Multer** for file uploads
- **Joi** for validation
- **Helmet** for security

### Frontend
- **React 18** with **TypeScript**
- **Vite** for fast development
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Tailwind CSS** for styling
- **React Hook Form** for forms
- **Recharts** for data visualization
- **Leaflet** for maps
- **React Hot Toast** for notifications

## Prerequisites

- **Node.js** (v16 or higher)
- **Supabase Account** (free tier available)
- **npm** or **yarn**

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd smartcity-backend
```

### 2. Supabase Setup

1. **Create a Supabase Project**:
   - Go to [supabase.com](https://supabase.com)
   - Sign up for a free account
   - Create a new project
   - Wait for the project to be ready

2. **Set up the Database Schema**:
   - Go to the SQL Editor in your Supabase dashboard
   - Copy and paste the contents of `database_schema.sql`
   - Run the SQL to create all tables and relationships

3. **Get your Supabase credentials**:
   - Go to Settings → API
   - Copy your Project URL and API keys

### 3. Backend Setup

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp env.example .env
```

3. Update `.env` with your Supabase credentials:
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=24h
PORT=5000
NODE_ENV=development
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760
FRONTEND_URL=http://localhost:3000
```

4. Create uploads directory:
```bash
mkdir uploads
```

5. Start the backend server:
```bash
npm run dev
```

The backend will be available at `http://localhost:5000`

### 4. Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `GET /api/auth/verify` - Verify JWT token

### Grievances
- `GET /api/grievances` - Get grievances (with filters)
- `GET /api/grievances/:id` - Get single grievance
- `POST /api/grievances` - Create new grievance
- `PUT /api/grievances/:id` - Update grievance
- `POST /api/grievances/:id/comments` - Add comment

### Announcements
- `GET /api/announcements` - Get announcements
- `POST /api/announcements` - Create announcement (admin only)
- `PUT /api/announcements/:id` - Update announcement (admin only)
- `DELETE /api/announcements/:id` - Delete announcement (admin only)

### Dashboard
- `GET /api/dashboard/stats` - Get admin dashboard stats
- `GET /api/dashboard/provider-stats` - Get provider stats
- `GET /api/dashboard/citizen-stats` - Get citizen stats
- `GET /api/dashboard/grievance-hotspots` - Get grievance hotspots

### Services & Zones
- `GET /api/services` - Get all services
- `GET /api/zones` - Get all zones

## Database Schema

The application uses Supabase (PostgreSQL) with the following main tables:

- **users** - User authentication and basic info
- **citizens** - Citizen-specific information
- **service_providers** - Service provider company details
- **grievances** - Main grievances/complaints table
- **grievance_photos** - Photo attachments
- **grievance_comments** - Comments and updates
- **announcements** - City-wide announcements
- **services** - Available city services
- **zones** - City zones/areas

## Usage

### For Citizens
1. Register with your personal information
2. Submit grievances with photos and location
3. Track the status of your submissions
4. Receive updates from administrators and service providers

### For Administrators
1. Login with admin credentials
2. View city-wide analytics and statistics
3. Manage grievances and assign them to service providers
4. Create and manage city announcements
5. Monitor service provider performance

### For Service Providers
1. Register your company information
2. View assigned grievances
3. Update status and add progress comments
4. Track your resolution performance

## Development

### Backend Development
```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Frontend Development
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Built with ❤️ for Smart City Management**