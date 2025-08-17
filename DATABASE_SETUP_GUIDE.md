# 🗄️ Database Setup Guide - NGFW Dashboard

## 📋 Overview

NGFW Dashboard dapat berjalan dalam 3 mode:
1. **Mock Data Mode** (Default) - Menggunakan data realistis tanpa database
2. **Local MongoDB** - Database lokal untuk development
3. **MongoDB Atlas** - Cloud database untuk production

## 🚀 Quick Start (Recommended)

### **Option 1: MongoDB Atlas (Cloud) - RECOMMENDED**

**Keuntungan:**
- ✅ Setup mudah dan cepat (5-10 menit)
- ✅ Tidak perlu install software
- ✅ Free tier tersedia (512MB storage)
- ✅ Automatic backups dan security
- ✅ Cocok untuk production

**Langkah-langkah:**

1. **Buat Account MongoDB Atlas**
   - Kunjungi: https://cloud.mongodb.com/v2/register
   - Daftar dengan email atau Google account
   - Verifikasi email

2. **Create Project**
   - Klik "New Project"
   - Nama: "NGFW Dashboard"
   - Klik "Create Project"

3. **Build Database**
   - Klik "Build a Database"
   - Pilih "M0 Sandbox" (FREE)
   - Pilih cloud provider (AWS/Google/Azure)
   - Pilih region terdekat
   - Cluster Name: "Cluster0" (default)
   - Klik "Create"

4. **Create Database User**
   - Username: `ngfw_admin`
   - Password: Generate atau buat password kuat
   - **SIMPAN USERNAME DAN PASSWORD INI!**

5. **Network Access**
   - Klik "Network Access" di sidebar
   - Klik "Add IP Address"
   - Pilih "Allow Access from Anywhere" (0.0.0.0/0)
   - Atau masukkan IP spesifik untuk security

6. **Get Connection String**
   - Kembali ke "Database"
   - Klik "Connect" pada cluster
   - Pilih "Connect your application"
   - Driver: Node.js
   - Copy connection string

7. **Configure Application**
   - Buka: http://localhost:3000/database-setup
   - Pilih "MongoDB Atlas"
   - Klik "Configure Atlas Connection"
   - Isi form:
     - Username: `ngfw_admin`
     - Password: [password yang dibuat]
     - Cluster: `cluster0.xxxxx` (dari connection string)
     - Database: `ngfw_dashboard_cloud`
   - Klik "Test Connection"
   - Jika berhasil, klik "Setup Database"

### **Option 2: Local MongoDB**

**Keuntungan:**
- ✅ Full control
- ✅ Tidak perlu internet
- ✅ Cocok untuk development

**Kelemahan:**
- ❌ Perlu install dan konfigurasi
- ❌ Perlu maintenance manual

#### **Windows Installation:**

```bash
# Method 1: Download Installer
# 1. Download dari: https://www.mongodb.com/try/download/community
# 2. Run installer
# 3. Pilih "Complete" installation
# 4. Install sebagai Windows Service

# Method 2: Chocolatey
choco install mongodb

# Start MongoDB
net start MongoDB

# Atau manual start
mongod --dbpath "C:\data\db"
```

#### **macOS Installation:**

```bash
# Install via Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb/brew/mongodb-community

# Verify installation
mongosh
```

#### **Linux (Ubuntu/Debian):**

```bash
# Update package list
sudo apt-get update

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify
mongosh
```

#### **Docker (All Platforms):**

```bash
# Simple MongoDB container
docker run --name mongodb -d -p 27017:27017 mongo:latest

# With persistent storage
docker run --name mongodb -d -p 27017:27017 -v mongodb_data:/data/db mongo:latest

# Check if running
docker ps
```

### **Option 3: Continue with Mock Data**

**Keuntungan:**
- ✅ Tidak perlu setup apapun
- ✅ Data realistis dan konsisten
- ✅ Perfect untuk demo dan testing

**Cara:**
- Tidak perlu lakukan apapun
- Aplikasi sudah berjalan dengan mock data
- Semua fitur tetap berfungsi normal

## 🔧 Configuration

### **Environment Variables**

Buat file `.env.local` di root project:

```env
# MongoDB Atlas
MONGODB_TYPE=atlas
MONGODB_ATLAS_URI=mongodb+srv://ngfw_admin:password@cluster0.xxxxx.mongodb.net/ngfw_dashboard_cloud?retryWrites=true&w=majority
MONGODB_ATLAS_DB_NAME=ngfw_dashboard_cloud

# Local MongoDB
MONGODB_TYPE=local
MONGODB_LOCAL_URI=mongodb://localhost:27017
MONGODB_LOCAL_DB_NAME=ngfw_dashboard_local
```

### **Using Database Setup UI**

1. Navigate to: http://localhost:3000/database-setup
2. Choose database type
3. Fill configuration
4. Test connection
5. Setup database

## 🔍 Troubleshooting

### **Common Issues:**

#### **"MongoDB is not running locally"**
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb/brew/mongodb-community

# Linux
sudo systemctl start mongod

# Docker
docker start mongodb
```

#### **"Connection timeout"**
- Check if MongoDB service is running
- Verify port 27017 is not blocked
- For Atlas: Check network access settings

#### **"Authentication failed"**
- Verify username/password
- Check database user permissions
- For Atlas: Ensure user has read/write access

#### **"Database not found"**
- Database will be created automatically
- Ensure proper permissions

## 📊 Data Migration

Jika ingin migrate dari mock data ke real database:

```bash
# Export mock data (future feature)
npm run export-mock-data

# Import to database (future feature)
npm run import-data
```

## 🎯 Recommendations

### **For Development:**
- Use **Mock Data** for quick start
- Use **Local MongoDB** if need persistence
- Use **Docker MongoDB** for easy setup/cleanup

### **For Production:**
- Use **MongoDB Atlas** (recommended)
- Configure proper security (IP whitelist, strong passwords)
- Enable backups
- Monitor performance

### **For Demo/Testing:**
- **Mock Data** is perfect
- No setup required
- Realistic data for presentations

## 🚀 Next Steps

1. **Choose your preferred option** from above
2. **Follow the setup guide** for your choice
3. **Test the connection** using the UI
4. **Explore the application** with real or mock data
5. **Configure additional settings** as needed

## 💡 Pro Tips

- Start with **Mock Data** to explore features
- Use **MongoDB Atlas free tier** for production-like testing
- Keep **Local MongoDB** for offline development
- **Docker** is great for consistent environments
- Always **backup your data** in production

---

**Need help?** The application works perfectly with mock data, so you can explore all features without any database setup!
