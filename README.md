# Tzu Chi Malawi Office Digitalization System

A comprehensive web-based system to digitalize office operations for Tzu Chi Malawi, including daily reporting, attendance tracking, task scheduling, inventory management, and departmental operations.

## ✨ Features

### Core Functionality
- **Dashboard** - Real-time summary of office activities and quick statistics
- **Daily Reports** - Submit, view, and manage daily activity reports with media uploads
- **Attendance System** - Track check-in/check-out and attendance status  
- **Task Management** - Schedule and assign tasks to staff with priority levels
- **Inventory Management** - Track materials and supplies with low-stock alerts
- **News & Announcements** - Post and share updates with the entire organization

### Department-Specific Modules
- **Education Department** - Scholarship tracking, teaching activities, student monitoring
- **Agriculture Department** - Project tracking and beneficiary management
- **Charity Department** - Home visits, relief distribution, survey management
- **Media Department** - File uploads and organized media library

### User Management
- **Role-Based Access Control** - Admin, Staff, and Volunteer roles
- **Secure Authentication** - JWT-based login with password hashing
- **User Profiles** - Manage user information and department assignments

## 🛠 Tech Stack

- **Frontend**: Next.js 14+, React 18+, TypeScript, Tailwind CSS, Lucide Icons
- **Backend**: Next.js API Routes (serverless)
- **Database**: SQLite (dev) / PostgreSQL (production)
- **ORM**: Prisma 5
- **Authentication**: JWT with bcryptjs
- **Deployment**: Vercel, Heroku, or Docker

## 📋 Prerequisites

- Node.js 18+ and npm
- Git account and GitHub repository
- Vercel account (for deployment, optional)

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/tzu-chi-malawi-office.git
cd tzu-chi-malawi-office
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment

```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

### 4. Initialize Database

```bash
npx prisma db push
npx prisma studio  # (Optional) Open database GUI
```

### 5. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/
│   ├── api/              # Backend API routes
│   │   ├── auth/        # Authentication
│   │   ├── reports/     # Daily reports
│   │   ├── attendance/  # Attendance tracking
│   │   ├── tasks/       # Task management
│   │   ├── materials/   # Inventory
│   │   └── announcements/
│   ├── (pages)/
│   │   ├── dashboard/   # Main dashboard
│   │   ├── reports/     # Reports interface
│   │   ├── attendance/  # Attendance interface
│   │   ├── tasks/       # Tasks interface
│   │   ├── materials/   # Inventory interface
│   │   ├── departments/ # Department info
│   │   ├── login/       # Auth pages
│   │   └── register/
│   ├── layout.tsx       # Root layout
│   └── globals.css      # Global styles
├── components/          # Reusable components
├── lib/                 # Utilities & helpers
└── prisma/
    ├── schema.prisma    # Database schema
    └── migrations/      # DB migrations

public/                  # Static files
```

## 🗄 Database Schema

Key entities:
- **User** - Staff members with authentication
- **DailyReport** - Activity reports with media
- **Attendance** - Check-in/out records
- **Task** - Assignments with tracking
- **Material** - Inventory with stock levels
- **Announcement** - News and updates
- Department-specific models for Education, Agriculture, Charity, Media

## 🔌 API Endpoints

### Auth
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login with credentials

### Data Management
- `GET/POST /api/reports` - Daily reports
- `GET/POST /api/attendance` - Attendance records
- `GET/POST /api/tasks` - Task management
- `GET/POST /api/materials` - Inventory
- `GET/POST /api/announcements` - News updates

All endpoints require JWT authentication (except login/register).

## 🌐 Deployment Guide

### Vercel (Easiest)

1. Push code to GitHub
2. Connect repository at [vercel.com](https://vercel.com)
3. Add environment variables:
   ```
   DATABASE_URL
   NEXTAUTH_SECRET
   NEXTAUTH_URL (your Vercel domain)
   JWT_SECRET
   ```
4. Deploy automatically

### Heroku

```bash
heroku login
heroku create your-app-name
heroku addons:create heroku-postgresql
git push heroku main
heroku run npx prisma migrate deploy
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t tzu-chi .
docker run -p 3000:3000 tzu-chi
```

## 📝 Available Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint

# Database commands
npx prisma db push           # Push schema to DB
npx prisma migrate dev       # Create migration
npx prisma studio          # Open DB GUI
npx prisma generate        # Generate client
```

## 🔐 Security

- Passwords hashed with bcryptjs
- JWT tokens expire after 24 hours
- Environment variables for secrets
- HTTPS enforced in production
- Role-based access control
- SQL injection prevention via Prisma

## 📊 Current Features Matrix

| Feature | Status | Notes |
|---------|--------|-------|
| User Authentication | ✅ Complete | JWT + bcryptjs |
| Dashboard | ✅ Complete | Real-time stats |
| Daily Reports | ✅ Complete | With media upload |
| Attendance | ✅ Complete | Check-in/out tracking |
| Tasks | ✅ Complete | Assignment + Priority |
| Inventory | ✅ Complete | Low stock alerts |
| Announcements | ✅ Complete | Organization-wide |
| Departments | ⚙️ Partial | Education dept in progress |
| Mobile App | ⏳ Planned | Q3 2026 |
| Analytics Dashboard | ⏳ Planned | Charts & graphs |
| Email Notifications | ⏳ Planned | Alerts |

## 🐛 Troubleshooting

**Database errors?**
```bash
rm prisma/dev.db
npx prisma db push
```

**Port 3000 already in use?**
```bash
npm run dev -- -p 3001
```

**Token errors?**
- Check JWT_SECRET is set
- Verify token in Authorization header
- Clear browser localStorage

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📞 Support

- Issues: Use GitHub Issues
- Email: support@tzuchi-malawi.org
- Documentation: Check the wiki

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

- Tzu Chi Malawi team
- Open source community
- Next.js, React, and Prisma communities

---

**Version** 1.0.0 | **Updated** April 7, 2026 | **Status** Production Ready

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
