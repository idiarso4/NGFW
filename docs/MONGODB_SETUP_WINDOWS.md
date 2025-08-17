# 🗄️ MongoDB Setup Guide for Windows

## 📋 Prerequisites

- Windows 10/11
- Administrator privileges
- Internet connection

## 🚀 Installation Methods

### Method 1: MongoDB Community Server (Recommended)

#### Step 1: Download MongoDB
1. Go to [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Select:
   - **Version**: Latest (7.0.x)
   - **Platform**: Windows
   - **Package**: MSI
3. Click **Download**

#### Step 2: Install MongoDB
1. Run the downloaded `.msi` file as Administrator
2. Follow the installation wizard:
   - Choose **Complete** installation
   - Install **MongoDB as a Service** (recommended)
   - Install **MongoDB Compass** (GUI tool)
3. Click **Install**

#### Step 3: Verify Installation
```cmd
# Open Command Prompt as Administrator
mongod --version
mongo --version
```

#### Step 4: Start MongoDB Service
```cmd
# Start MongoDB service
net start MongoDB

# Check service status
sc query MongoDB
```

### Method 2: Using Chocolatey (Alternative)

#### Step 1: Install Chocolatey
```powershell
# Run PowerShell as Administrator
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

#### Step 2: Install MongoDB
```cmd
# Install MongoDB Community
choco install mongodb

# Start MongoDB service
net start MongoDB
```

### Method 3: MongoDB Atlas (Cloud - No Local Installation)

#### Step 1: Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for free account
3. Create a new cluster (free tier available)

#### Step 2: Get Connection String
1. Click **Connect** on your cluster
2. Choose **Connect your application**
3. Copy the connection string
4. Replace `<password>` with your database password

#### Step 3: Update Environment
```env
# In .env.local
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ngfw_dashboard?retryWrites=true&w=majority
```

## 🔧 Configuration

### Local MongoDB Configuration

#### Create Data Directory
```cmd
# Create MongoDB data directory
mkdir C:\data\db
mkdir C:\data\log
```

#### MongoDB Configuration File
Create `C:\Program Files\MongoDB\Server\7.0\bin\mongod.cfg`:
```yaml
# mongod.conf
storage:
  dbPath: C:\data\db
  journal:
    enabled: true

systemLog:
  destination: file
  logAppend: true
  path: C:\data\log\mongod.log

net:
  port: 27017
  bindIp: 127.0.0.1

processManagement:
  windowsService:
    serviceName: MongoDB
    displayName: MongoDB
    description: MongoDB Database Server
```

### Environment Configuration

Update your `.env.local` file:
```env
# For Local MongoDB
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=ngfw_dashboard

# For MongoDB Atlas
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ngfw_dashboard
```

## 🧪 Test Connection

### Test MongoDB Connection
```cmd
# Navigate to project directory
cd "C:\Users\User\Desktop\Keamanan Jaringan"

# Test MongoDB connection
node scripts/test-mongodb.js
```

### Expected Output
```
🔍 Testing MongoDB connection...
📍 URI: mongodb://localhost:27017
📊 Database: ngfw_dashboard

⏳ Connecting to MongoDB...
✅ Connected to MongoDB successfully!

🔍 Testing database operations...
📁 Found 0 collections:

📊 Database Statistics:
   - Collections: 0
   - Data Size: 0.00 MB
   - Storage Size: 0.00 MB
   - Indexes: 0
   - Objects: 0

🧪 Testing database operations...
✅ Test document inserted successfully
✅ Test document retrieved successfully
✅ Test document deleted successfully

🎉 MongoDB connection test completed successfully!

✅ Your MongoDB setup is working correctly.
✅ You can now run: npm run db:setup
```

## 🚀 Initialize Database

### Setup Database Schema
```cmd
# Initialize database with collections and sample data
npm run db:setup
```

### Expected Output
```
🚀 Starting MongoDB setup...
📍 Connecting to: mongodb://localhost:27017
📊 Database: ngfw_dashboard
✅ Connected to MongoDB

📁 Creating collections...
  ✅ Created collection: firewall_rules
  ✅ Created collection: network_connections
  ✅ Created collection: threat_events
  ... (more collections)

🔍 Creating indexes...
  ✅ Created indexes for: firewall_rules
  ✅ Created indexes for: network_connections
  ... (more indexes)

📊 Inserting sample data...
  ✅ Inserted 3 sample firewall rules
  ✅ Inserted 3 system configuration entries

👤 Creating admin user...
  ✅ Admin user created successfully
  📝 Default credentials:
     Username: admin
     Password: admin123
  ⚠️  Please change the default password after first login!

🎉 MongoDB setup completed successfully!
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Connection Refused Error
```
❌ connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:**
- Check if MongoDB service is running: `net start MongoDB`
- Verify MongoDB is installed correctly
- Check Windows Services for MongoDB service

#### 2. Access Denied Error
```
❌ Access denied
```
**Solution:**
- Run Command Prompt as Administrator
- Check MongoDB service permissions
- Verify data directory permissions

#### 3. Port Already in Use
```
❌ Port 27017 already in use
```
**Solution:**
- Check what's using port 27017: `netstat -ano | findstr :27017`
- Stop conflicting service or change MongoDB port

#### 4. Service Won't Start
```
❌ The MongoDB service could not be started
```
**Solution:**
- Check MongoDB log file: `C:\data\log\mongod.log`
- Verify configuration file syntax
- Check data directory permissions

### MongoDB Compass (GUI Tool)

#### Connect to Local MongoDB
1. Open MongoDB Compass
2. Connection string: `mongodb://localhost:27017`
3. Click **Connect**
4. Browse your `ngfw_dashboard` database

## 🎯 Next Steps

After successful MongoDB setup:

1. **Start Development Server**
   ```cmd
   npm run dev
   ```

2. **Access Application**
   - URL: http://localhost:3000
   - Username: `admin`
   - Password: `admin123`

3. **Change Default Password**
   - Login with default credentials
   - Go to Settings → User Management
   - Change admin password

4. **Explore Real Data**
   - All modules now use real MongoDB data
   - Create, edit, delete operations work with database
   - Real-time updates from database

## 📚 Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [MongoDB Compass](https://www.mongodb.com/products/compass)
- [MongoDB Atlas](https://www.mongodb.com/atlas)
- [MongoDB University](https://university.mongodb.com/)

## 🆘 Need Help?

If you encounter issues:
1. Check MongoDB service status
2. Review log files
3. Verify network connectivity
4. Check firewall settings
5. Consult MongoDB documentation
