# 🚀 Quick Start Guide - DriveGuardian

Get DriveGuardian running on your laptop in **5 minutes** for demo purposes!

---

## 📋 Prerequisites

Make sure you have these installed:

- **Node.js 18+** - [Download](https://nodejs.org/)
- **MongoDB** - Use MongoDB Atlas (free cloud) OR install locally
- **Git** - [Download](https://git-scm.com/)

> 💡 **No MongoDB installed?** Use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) (free tier) - just copy the connection string!

---

## ⚡ Quick Setup (3 Steps)

### Step 1: Clone & Install

```bash
# Clone the repository
git clone <your-repo-url>
cd SafeRide-AI

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2: Configure Environment

```bash
# Go to backend folder
cd backend

# Copy environment example
copy .env.example .env    # Windows
# or
cp .env.example .env      # Mac/Linux

# Edit .env file with your settings
notepad .env    # Windows
# or
nano .env       # Mac/Linux
```

**Minimal `.env` configuration:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/driveguardian
JWT_SECRET=demo_secret_key_12345
FRONTEND_URL=http://localhost:3000
```

> 🔄 **Using MongoDB Atlas?** Replace `MONGODB_URI` with your connection string:
> ```
> MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/driveguardian
> ```

### Step 3: Start the Application

**Terminal 1 - Start Backend:**
```bash
cd backend
npm run dev
```
✅ Backend running at: http://localhost:5000

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev
```
✅ Frontend running at: http://localhost:3000

---

## 🎯 Access the Application

Open your browser and go to:

**👉 http://localhost:3000**

You should see the DriveGuardian login/signup page!

---

## 🧪 Quick Demo Test

### 1. Create a User Account
- Click **"Sign Up"**
- Fill in details (use any email for demo)
- Choose role: **User** (customer) or **Provider** (service provider)

### 2. Try Key Features

**As a User:**
- Submit a help request
- Upload a vehicle photo for AI analysis
- Track provider location on map

**As a Provider:**
- View nearby requests
- Accept jobs
- Update service status

---

## 🛠️ Troubleshooting

### MongoDB Connection Error
```bash
# If using local MongoDB, make sure it's running:
mongod

# Or use MongoDB Atlas (recommended for demos)
```

### Port Already in Use
```bash
# Change port in backend/.env
PORT=5001

# Change frontend port in frontend/vite.config.js
server: { port: 3001 }
```

### Dependencies Installation Fails
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📱 Demo Accounts (Pre-seeded)

If the database has sample data, try these credentials:

| Role | Email | Password |
|------|-------|----------|
| User | demo@user.com | demo123 |
| Provider | demo@provider.com | demo123 |
| Admin | demo@admin.com | demo123 |

---

## 🚀 Quick Commands Reference

```bash
# Start backend only
cd backend && npm run dev

# Start frontend only
cd frontend && npm run dev

# Start both (in separate terminals)
# Terminal 1: cd backend && npm run dev
# Terminal 2: cd frontend && npm run dev

# Build for production
cd frontend && npm run build
cd backend && npm run start
```

---

## 📊 What's Running?

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | http://localhost:3000 | React web app |
| **Backend API** | http://localhost:5000 | Node.js server |
| **Socket.io** | ws://localhost:5000 | Real-time updates |

---

## 🎉 You're Ready!

Your DriveGuardian demo is now running! 

**Next steps:**
1. Create an account
2. Explore the AI features
3. Test real-time tracking
4. Try different user roles

---

## ❓ Need Help?

- **Full Documentation**: See `README.md`
- **Deployment Guide**: See `DEPLOYMENT.md`
- **Issues**: Check the GitHub issues page

---

**Made with ❤️ by DriveGuardian Team**