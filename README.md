# 📡 TraceRouteX - Incident & Service Status Management System

A comprehensive incident management and service status tracking system built with modern web technologies. Monitor services, manage incidents, track updates, and maintain complete audit logs with role-based access control.

![Tech Stack](https://img.shields.io/badge/Node.js-Express-green)
![Tech Stack](https://img.shields.io/badge/TypeORM-PostgreSQL-blue)
![Tech Stack](https://img.shields.io/badge/Next.js-14-black)
![Tech Stack](https://img.shields.io/badge/TypeScript-5.x-blue)

## 🌟 Features

### Core Features
- ✅ **Service Status Monitoring** - Track and manage multiple services with real-time status updates
- 🚨 **Incident Management** - Create, track, and resolve incidents with severity levels
- 📝 **Timeline Updates** - Add chronological updates to incidents for complete transparency
- 👥 **Role-Based Access Control** - Three user roles (VIEWER, ENGINEER, ADMIN) with granular permissions
- 🔐 **Secure Authentication** - JWT-based authentication with bcrypt password hashing
- 📊 **Audit Logging** - Automatic logging of all CREATE/UPDATE/DELETE operations
- 🌐 **Public Status Page** - Beautiful public-facing status page (no authentication required)
- 🎨 **Modern UI/UX** - Professional, responsive design with dark mode support

### Advanced Features
- 🔍 **Advanced Filtering** - Filter incidents by severity, status, and date
- 🎯 **Custom Components** - StatusBadge, ServiceCard, IncidentTimeline components
- ⚡ **Skeleton Loaders** - Smooth loading states for better UX
- 🔔 **Public/Private Toggle** - Control incident visibility
- 🎭 **Confirmation Dialogs** - Safe destructive actions with beautiful modals

## 🚀 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT + bcrypt
- **Language**: TypeScript

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Language**: TypeScript

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd TraceRouteX
```

### 2. Install Dependencies

```bash
# Install dependencies for both backend and frontend
npm run install:all
```

### 3. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE traceroute_db;
```

### 4. Environment Configuration

#### Backend (.env)

Create `backend/.env` file:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=traceroute_db
JWT_SECRET=your_secure_secret_key_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

#### Frontend (.env.local)

Create `frontend/.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 5. Database Migration

TypeORM will automatically create tables on first run. Alternatively, you can run migrations manually.

### 6. Seed Database (Optional but Recommended)

Populate the database with sample data:

```bash
cd backend
npm run seed
```

**This will create:**
- **4 Users**: 1 Admin, 2 Engineers, 1 Viewer
- **7 Services**: Various services with different statuses
- **5 Incidents**: Mix of open, investigating, resolved, and closed incidents
- **7 Updates**: Sample incident updates

**Test Credentials:**
```
Admin:      admin@traceroutex.com / admin123
Engineer:   engineer1@traceroutex.com / engineer123
Engineer:   engineer2@traceroutex.com / engineer123
Viewer:     viewer@traceroutex.com / viewer123
```

### 7. Start Development Servers

From the root directory:

```bash
npm run dev
```

This starts:
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:3000

## 📁 Project Structure

```
TraceRouteX/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Business logic
│   │   ├── entities/         # TypeORM entities
│   │   ├── middleware/       # Auth, validation, error handling
│   │   ├── routes/           # API routes
│   │   ├── utils/            # Helpers (JWT, password, audit, seeder)
│   │   ├── data-source.ts    # TypeORM configuration
│   │   ├── index.ts          # Express server entry point
│   │   └── seed.ts           # Database seeder
│   ├── .env                  # Environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/              # Next.js app router pages
│   │   │   ├── admin/        # Admin pages
│   │   │   ├── dashboard/    # Dashboard
│   │   │   ├── incidents/    # Incident management
│   │   │   ├── services/     # Service management
│   │   │   ├── public/       # Public status page
│   │   │   ├── login/        # Authentication
│   │   │   └── register/     # User registration
│   │   ├── components/       # Reusable components
│   │   │   ├── ui/          # shadcn/ui components
│   │   │   ├── StatusBadge.tsx
│   │   │   ├── ServiceCard.tsx
│   │   │   ├── IncidentTimeline.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   └── ConfirmDialog.tsx
│   │   └── lib/             # API client, utilities
│   ├── .env.local           # Frontend environment variables
│   └── package.json
│
└── package.json             # Root package.json
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user (Admin only in production)
- `POST /api/auth/login` - User login (returns JWT)
- `GET /api/auth/me` - Get current user info

### Services
- `GET /api/services` - List all services (authenticated)
- `GET /api/services/:id` - Get service by ID
- `POST /api/services` - Create service (Admin only)
- `PATCH /api/services/:id` - Update service (Admin only)
- `PATCH /api/services/:id/status` - Update service status (Engineer+)
- `DELETE /api/services/:id` - Delete service (Admin only)

### Incidents
- `GET /api/incidents` - List all incidents
- `GET /api/incidents/:id` - Get incident by ID
- `POST /api/incidents` - Create incident (Engineer+)
- `PATCH /api/incidents/:id` - Update incident (Engineer+)
- `PATCH /api/incidents/:id/resolve` - Resolve incident (Engineer+)
- `PATCH /api/incidents/:id/publish` - Toggle public visibility (Engineer+)
- `POST /api/incidents/:id/updates` - Add update to incident (Engineer+)
- `GET /api/incidents/:id/updates` - Get incident updates
- `DELETE /api/incidents/:id` - Delete incident (Admin only)

### Users
- `GET /api/users` - List all users (Admin only)
- `PATCH /api/users/:id/role` - Update user role (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)

### Public (No Auth Required)
- `GET /public/services` - Public service status
- `GET /public/incidents` - Public incidents only

### Audit Logs
- `GET /api/audit-logs` - View audit logs (Admin only)

## 👤 User Roles & Permissions

### VIEWER
- View services and incidents
- Access dashboard
- Cannot create, edit, or delete

### ENGINEER
- All VIEWER permissions
- Create and manage incidents
- Add updates to incidents
- Update service status
- Toggle incident public visibility

### ADMIN
- All ENGINEER permissions
- Manage users (create, update role, delete)
- Create and delete services
- Delete incidents
- View audit logs

## 🎨 UI/UX Features

### Color Coding

**Service Status:**
- 🟢 Green: OPERATIONAL
- 🟡 Yellow: DEGRADED
- 🔴 Red: DOWN
- 🔵 Blue: MAINTENANCE

**Incident Severity:**
- 🔵 Blue: LOW
- 🟡 Yellow: MEDIUM
- 🟠 Orange: HIGH
- 🔴 Red: CRITICAL

### Components
- **StatusBadge**: Color-coded status indicators with icons
- **ServiceCard**: Beautiful service display cards
- **IncidentTimeline**: Chronological update timeline
- **Skeleton Loaders**: Smooth loading states
- **ConfirmDialog**: Safe confirmation for destructive actions

## 🔧 Development Scripts

### Root Directory
```bash
npm run dev          # Start both backend and frontend
npm run build        # Build both applications
npm run start        # Start production servers
npm run install:all  # Install all dependencies
```

### Backend Only
```bash
cd backend
npm run dev          # Development server with nodemon
npm run build        # Compile TypeScript
npm run start        # Production server
npm run seed         # Seed database with sample data
```

### Frontend Only
```bash
cd frontend
npm run dev          # Next.js development server
npm run build        # Build for production
npm run start        # Production server
```

## 🗃️ Database Schema

### Users
- id (UUID), email, password (hashed), role, timestamps

### Services
- id (UUID), name, description, status, timestamps

### Incidents
- id (UUID), title, description, severity, status, isPublic, resolvedAt, timestamps

### Updates
- id (UUID), content, createdAt, incidentId (FK), userId (FK)

### AuditLogs
- id (UUID), actorId, action, entityType, entityId, metadata (JSON), createdAt

## 🔒 Security Features

- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ JWT authentication with configurable expiration
- ✅ Role-based access control middleware
- ✅ Input validation on all endpoints
- ✅ SQL injection protection (TypeORM parameterized queries)
- ✅ CORS configured for specific origins
- ✅ Environment-based secrets

## 📱 Pages

### Public
- `/public/status` - Public status page (no login required)

### Authenticated
- `/dashboard` - Main dashboard with statistics
- `/services` - Service management
- `/services/[id]` - Service details
- `/incidents` - Incident list
- `/incidents/[id]` - Incident details with timeline
- `/incidents/new` - Create new incident
- `/admin/users` - User management (Admin only)
- `/audit-logs` - Audit log viewer (Admin only)

## 🎯 Future Enhancements

- [ ] Real-time notifications with WebSockets/SSE
- [ ] RSS feed for status page
- [ ] JSON API endpoint for status
- [ ] Root cause analysis field
- [ ] Advanced filtering UI
- [ ] Email notifications
- [ ] Scheduled maintenance windows
- [ ] Service dependencies mapping
- [ ] Metrics and charts

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Built with ❤️ by the TraceRouteX Team

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [TypeORM](https://typeorm.io/) - ORM for TypeScript
- [Express](https://expressjs.com/) - Web framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
