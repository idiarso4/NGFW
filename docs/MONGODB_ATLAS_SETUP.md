# 🌐 MongoDB Atlas Setup Guide (Cloud Database)

## 🚀 Quick Setup (No Local Installation Required)

MongoDB Atlas adalah cloud database service yang tidak memerlukan instalasi lokal MongoDB.

### Step 1: Create MongoDB Atlas Account

1. **Go to MongoDB Atlas**
   - Visit: https://www.mongodb.com/atlas
   - Click **"Try Free"**

2. **Sign Up**
   - Create account dengan email
   - Verify email address

3. **Create Organization & Project**
   - Organization name: `NGFW Dashboard`
   - Project name: `ngfw-dashboard`

### Step 2: Create Database Cluster

1. **Choose Deployment**
   - Select **"Shared"** (Free tier)
   - Provider: **AWS** (recommended)
   - Region: **Singapore (ap-southeast-1)** atau terdekat

2. **Cluster Configuration**
   - Cluster Name: `ngfw-cluster`
   - MongoDB Version: **7.0** (latest)
   - Click **"Create Cluster"**

3. **Wait for Cluster Creation**
   - Takes 3-5 minutes
   - Status will show "Active" when ready

### Step 3: Configure Database Access

1. **Create Database User**
   - Go to **Database Access**
   - Click **"Add New Database User"**
   - Authentication Method: **Password**
   - Username: `ngfw_admin`
   - Password: Generate secure password (save it!)
   - Database User Privileges: **Read and write to any database**
   - Click **"Add User"**

2. **Configure Network Access**
   - Go to **Network Access**
   - Click **"Add IP Address"**
   - Choose **"Allow Access from Anywhere"** (0.0.0.0/0)
   - Or add your specific IP address
   - Click **"Confirm"**

### Step 4: Get Connection String

1. **Connect to Cluster**
   - Go to **Database** → **Clusters**
   - Click **"Connect"** on your cluster

2. **Choose Connection Method**
   - Select **"Connect your application"**
   - Driver: **Node.js**
   - Version: **4.1 or later**

3. **Copy Connection String**
   ```
   mongodb+srv://ngfw_admin:<password>@ngfw-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 5: Configure Environment

1. **Update .env.local**
   ```env
   # MongoDB Atlas Configuration
   MONGODB_URI=mongodb+srv://ngfw_admin:YOUR_PASSWORD@ngfw-cluster.xxxxx.mongodb.net/ngfw_dashboard?retryWrites=true&w=majority
   MONGODB_DB_NAME=ngfw_dashboard
   
   # Replace YOUR_PASSWORD with actual password
   # Replace xxxxx with your cluster identifier
   ```

2. **Example Complete Configuration**
   ```env
   # MongoDB Atlas
   MONGODB_URI=mongodb+srv://ngfw_admin:SecurePass123@ngfw-cluster.abc12.mongodb.net/ngfw_dashboard?retryWrites=true&w=majority
   MONGODB_DB_NAME=ngfw_dashboard
   
   # Application Configuration
   NODE_ENV=development
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   
   # API Configuration
   API_BASE_URL=http://localhost:3000/api
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
   
   # Authentication
   NEXTAUTH_SECRET=ngfw-dashboard-secret-key-2024
   JWT_SECRET=ngfw-jwt-secret-key-2024
   ```

### Step 6: Test Connection

```cmd
# Test MongoDB Atlas connection
node scripts/test-mongodb.js
```

**Expected Output:**
```
🔍 Testing MongoDB connection...
📍 URI: mongodb+srv://ngfw_admin:***@ngfw-cluster.abc12.mongodb.net/ngfw_dashboard
📊 Database: ngfw_dashboard

⏳ Connecting to MongoDB...
✅ Connected to MongoDB successfully!

🔍 Testing database operations...
📁 Found 0 collections:

🧪 Testing database operations...
✅ Test document inserted successfully
✅ Test document retrieved successfully
✅ Test document deleted successfully

🎉 MongoDB connection test completed successfully!

✅ Your MongoDB setup is working correctly.
✅ You can now run: npm run db:setup
```

### Step 7: Initialize Database

```cmd
# Setup database schema and sample data
npm run db:setup
```

### Step 8: Start Application

```cmd
# Start development server
npm run dev
```

**Access Application:**
- URL: http://localhost:3000
- Username: `admin`
- Password: `admin123`

## 🎯 MongoDB Atlas Features

### ✅ **Advantages:**
- **No Local Installation** - Works immediately
- **Automatic Backups** - Data protection
- **Monitoring** - Built-in performance monitoring
- **Scaling** - Easy to scale up/down
- **Security** - Enterprise-grade security
- **Global Clusters** - Multi-region deployment

### 📊 **Free Tier Limits:**
- **Storage**: 512 MB
- **RAM**: Shared
- **Connections**: 500 concurrent
- **Perfect for development and testing**

### 💰 **Pricing:**
- **Free Tier**: $0/month (perfect for development)
- **Dedicated**: Starting $57/month (production)

## 🔧 MongoDB Compass Integration

### Connect with MongoDB Compass

1. **Download MongoDB Compass**
   - Visit: https://www.mongodb.com/products/compass
   - Download and install

2. **Connect to Atlas**
   - Open MongoDB Compass
   - Use connection string from Atlas
   - Browse your `ngfw_dashboard` database

## 🛡️ Security Best Practices

### 1. **Strong Passwords**
```
✅ Use strong database passwords
✅ Enable 2FA on Atlas account
✅ Rotate passwords regularly
```

### 2. **Network Security**
```
✅ Restrict IP access when possible
✅ Use VPN for production access
✅ Monitor connection logs
```

### 3. **Database Security**
```
✅ Use least privilege access
✅ Enable audit logging
✅ Regular security updates
```

## 🚀 Production Deployment

### Environment Variables for Production

```env
# Production MongoDB Atlas
MONGODB_URI=mongodb+srv://prod_user:STRONG_PASSWORD@prod-cluster.xxxxx.mongodb.net/ngfw_dashboard_prod?retryWrites=true&w=majority
MONGODB_DB_NAME=ngfw_dashboard_prod

# Production Security
NODE_ENV=production
NEXTAUTH_SECRET=VERY_STRONG_SECRET_KEY
JWT_SECRET=VERY_STRONG_JWT_SECRET

# Production URLs
NEXT_PUBLIC_APP_URL=https://your-domain.com
API_BASE_URL=https://your-domain.com/api
```

## 📈 Monitoring & Maintenance

### Atlas Monitoring Dashboard
- **Performance Advisor** - Query optimization
- **Real-time Performance Panel** - Live metrics
- **Profiler** - Slow query analysis
- **Alerts** - Custom alert rules

### Backup & Recovery
- **Automatic Backups** - Point-in-time recovery
- **Manual Snapshots** - On-demand backups
- **Cross-region Backups** - Disaster recovery

## 🆘 Troubleshooting

### Common Issues

#### 1. Authentication Failed
```
❌ Authentication failed
```
**Solution:**
- Check username/password in connection string
- Verify database user exists in Atlas
- Check user permissions

#### 2. Network Timeout
```
❌ Connection timeout
```
**Solution:**
- Check network access whitelist
- Verify internet connection
- Check firewall settings

#### 3. Database Not Found
```
❌ Database not found
```
**Solution:**
- Database is created automatically on first write
- Run `npm run db:setup` to initialize
- Check database name in connection string

## 🎉 Success!

Setelah setup berhasil, Anda akan memiliki:

✅ **Cloud MongoDB Database** - Fully managed
✅ **Real Data Integration** - No more mock data
✅ **Production Ready** - Scalable architecture
✅ **Automatic Backups** - Data protection
✅ **Monitoring** - Performance insights

**Next Steps:**
1. Login to application: http://localhost:3000
2. Change default admin password
3. Explore real data features
4. Create firewall rules, monitor threats, etc.

## 📚 Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Connection String Format](https://docs.mongodb.com/manual/reference/connection-string/)
- [Security Best Practices](https://docs.mongodb.com/manual/security/)
- [Performance Best Practices](https://docs.mongodb.com/manual/administration/analyzing-mongodb-performance/)
