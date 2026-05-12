# 🚀 Quick Start Guide

## Application is READY!

The Tzu Chi Malawi Office Digitalization System is fully built and ready to use!

## 📍 Current Status

✅ **Application**: Running on `http://localhost:3000`  
✅ **Database**: SQLite initialized with all tables  
✅ **Build**: Production build successful  
✅ **API Routes**: All 10+ endpoints ready  
✅ **Authentication**: JWT-based security implemented  
✅ **UI Components**: Complete dashboard, forms, and interfaces  

## 🎯 What's Included

### Features Ready to Use
- ✅ User authentication (Register & Login)
- ✅ Dashboard with real-time statistics
- ✅ Daily reports with tracking
- ✅ Attendance management system
- ✅ Task scheduling and assignment
- ✅ Inventory/Materials management
- ✅ News & Announcements
- ✅ Department management interface
- ✅ User role-based access (Admin, Staff, Volunteer)

### Database & Backend
- Complete Prisma schema with 13+ models
- SQLite for development (easily switch to PostgreSQL for production)
- JWT authentication with bcryptjs password hashing
- 10+ API endpoints ready to use

### Frontend
- Responsive design with Tailwind CSS
- Mobile-friendly navigation
- Form validation and error handling
- Real-time statistics on dashboard
- Clean, intuitive user interface

## 🎮 First-Time Usage

### 1. Access the Application

**Local Development:**
```
http://localhost:3000
```

The home page will automatically redirect you to:
- `/login` if you're not logged in
- `/dashboard` if you're already logged in

### 2. Create Your First Account

```
Go to: http://localhost:3000/register

Fill in:
- Full Name: Your Name
- Email: your@email.com
- Password: your-password (min 8 chars recommended)
- Confirm Password

Click: Register
```

You'll be automatically logged in and redirected to the dashboard.

### 3. Explore the Dashboard

The dashboard shows:
- **Today's Statistics**: Reports, attendance, tasks, inventory status
- **Quick Action Buttons**: Add report, mark attendance, create task, update inventory
- **Department Cards**: Education, Agriculture, Charity, Media

### 4. Try the Features

#### 📝 Add a Daily Report
1. Click "Add Report" or go to `/reports/new`
2. Fill in:
   - Date
   - Department
   - Work done today
   - People involved
   - Location
   - Challenges & solutions
   - Status (Not started / In progress / Completed)
3. Click "Save Report"

#### ✅ Mark Attendance
1. Click "Mark Attendance" or go to `/attendance/new`
2. Fill in:
   - Name
   - Department
   - Check-in time
   - Check-out time (optional)
   - Status (Present / Absent / Late)
   - Remarks
3. Click "Save Attendance"

#### 📋 Create a Task
1. Go to `/tasks/new`
2. Fill in:
   - Task title
   - Assign to (person name)
   - Department
   - Start and end dates
   - Priority (Low / Medium / High)
   - Notes
3. Click "Create Task"

#### 📦 Update Inventory
1. Go to `/materials/new`
2. Fill in:
   - Item name
   - Category (Relief / Office use)
   - Quantity
   - Date added
   - Used by
   - Purpose
   - Remaining stock
3. Click "Add Material"

#### 📢 Post Announcement
1. Go to `/announcements` or `/announcements/new`
2. Fill in:
   - Title
   - Description
   - Date
   - Category
3. Click "Post News"

## 🔧 Development

### Available Commands

```bash
# Start development server (npm run dev)
npm run dev
# Access at http://localhost:3000

# Build for production
npm run build

# Start production server
npm start

# Open database GUI (Prisma Studio)
npx prisma studio

# Check database schema
npx prisma db push

# Format code
npx prettier --write .

# Run linter
npm run lint
```

### Project Structure

```
src/
├── app/
│   ├── api/          # Backend API routes
│   ├── dashboard/    # Main dashboard
│   ├── reports/      # Reports interface
│   ├── attendance/   # Attendance tracking
│   ├── tasks/        # Task management
│   ├── materials/    # Inventory
│   ├── login/        # Auth pages
│   └── register/
├── components/       # Reusable React components
├── lib/             # Utility functions
└── prisma/          # Database schema & migrations

```

## 🌐 Deployment (Next Steps)

Ready to go live? Follow these guides:

1. **For GitHub**: Read `GITHUB_SETUP.md`
   - Create GitHub repository
   - Push code to GitHub
   - Set up CI/CD

2. **For Production**: Read `DEPLOYMENT.md`
   - Deploy to Vercel (easiest)
   - Or Heroku
   - Or Docker

3. **Quick Deploy to Vercel**:
   ```bash
   npm i -g vercel
   vercel
   # Follow prompts
   ```

## 📊 Database

### View Database (Development)

```bash
# Open Prisma Studio
npx prisma studio

# This opens a GUI at http://localhost:5555
# You can add, edit, and delete records
```

### Database File Location
```
prisma/dev.db  # SQLite development database
```

## 🔐 Security Notes

- Passwords are hashed with bcryptjs
- Tokens expire after 24 hours
- Use strong passwords in production
- Change JWT_SECRET and NEXTAUTH_SECRET from defaults
- Enable HTTPS in production
- Add rate limiting before going live

## 📱 Using the API Directly

All endpoints require JWT authentication (except login/register):

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'

# Create Report (requires token)
curl -X POST http://localhost:3000/api/reports \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2026-04-07",
    "department": "Education",
    "workDone": "Teaching session",
    "involved": "John, Mary",
    "location": "Office",
    "status": "completed"
  }'
```

## ⚙️ Configuration

### Environment Variables

Currently using `.env` with:
```
DATABASE_URL=file:./prisma/dev.db
JWT_SECRET=your-jwt-secret
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
```

### Change Database to PostgreSQL

1. Create PostgreSQL database
2. Update `.env`:
   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/tzuchidb
   ```
3. Run migrations:
   ```bash
   npx prisma db push
   ```

## 🆘 Troubleshooting

### Application won't start
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run dev
```

### Database errors
```bash
# Reset database (WARNING: Deletes all data)
rm prisma/dev.db
npx prisma db push
```

### Can't login
- Check email/password are correct
- Try registering a new account
- Check `.env` for JWT_SECRET

### Port 3000 in use
```bash
# Use different port
npm run dev -- -p 3001
```

## 📚 Documentation

- **Main README**: `README.md` - Complete documentation
- **GitHub Setup**: `GITHUB_SETUP.md` - How to push to GitHub
- **Deployment**: `DEPLOYMENT.md` - Production deployment guide
- **This Guide**: `QUICKSTART.md` - Quick reference (you are here)

## 🎓 Next Steps

1. **Explore the Application**
   - Add test data
   - Try all features
   - Verify everything works

2. **Customize for Your Needs**
   - Update organization info
   - Add more department modules
   - Customize colors/branding
   - Add custom forms

3. **Prepare for Deployment**
   - Review security settings
   - Set up production database
   - Configure backup strategy
   - Prepare documentation for users

4. **Deploy to Production**
   - Push to GitHub
   - Deploy to Vercel/Heroku
   - Configure custom domain
   - Monitor application

## 📞 Need Help?

- Refer to `README.md` for full documentation
- Check `GITHUB_SETUP.md` for version control
- See `DEPLOYMENT.md` for production setup
- Next.js docs: https://nextjs.org/docs
- Prisma docs: https://prisma.io/docs

## 🎉 You're All Set!

The complete office digitalization system is ready:
- ✅ Backend API built
- ✅ Database configured
- ✅ Frontend GUI created
- ✅ Authentication working
- ✅ Ready for production deployment

**Start using it now!**

---

**Last Updated**: April 7, 2026  
**Application Version**: 1.0.0  
**Status**: ✅ Production Ready
