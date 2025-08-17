# 🗄️ Database Setup Guide - NGFW Dashboard

## 📋 Quick Start

### Option 1: MongoDB Atlas (Cloud - Recommended)
```bash
# 1. Create MongoDB Atlas account at https://www.mongodb.com/atlas
# 2. Create cluster and get connection string
# 3. Update .env.local with Atlas connection string
# 4. Initialize database
npm run db:init
```

### Option 2: Local MongoDB
```bash
# 1. Install MongoDB locally (see installation guides)
# 2. Start MongoDB service
# 3. Initialize database
npm run db:init
```

## 🚀 Available Scripts

### Database Management Scripts
```bash
# Test MongoDB connection
npm run db:test

# Setup database (create collections, indexes, admin user)
npm run db:setup

# Seed database with sample data
npm run db:seed

# Complete initialization (setup + seed)
npm run db:init

# Reset database (⚠️ deletes all data)
npm run db:reset

# Reset database without confirmation (force mode)
node scripts/reset-database.js --force
```

## 📊 Database Schema

### Collections Overview
```
📁 Collections (20+):
├── firewall_rules          # Firewall rule configurations
├── firewall_stats          # Firewall statistics over time
├── network_connections     # Active/historical network connections
├── network_traffic         # Network traffic metrics
├── network_stats           # Network statistics over time
├── threat_events           # Security threat events
├── threat_stats            # Threat statistics over time
├── applications            # Application inventory
├── application_policies    # Application control policies
├── web_filter_categories   # Web filtering categories
├── blocked_sites           # Blocked websites list
├── web_filter_policies     # Web filtering policies
├── vpn_tunnels            # VPN tunnel configurations
├── vpn_users              # VPN user accounts and sessions
├── vpn_settings           # VPN server settings
├── system_stats           # System performance metrics
├── audit_logs             # System activity audit logs
├── users                  # User accounts
├── sessions               # User login sessions
└── system_config          # System configuration settings
```

### Key Indexes
```javascript
// Performance-optimized indexes
firewall_rules: [
  { enabled: 1 },
  { priority: -1 },
  { hitCount: -1 },
  { name: "text", description: "text" }
]

network_connections: [
  { timestamp: -1 },
  { sourceIp: 1 },
  { destinationIp: 1 },
  { status: 1 }
]

threat_events: [
  { timestamp: -1 },
  { severity: 1 },
  { type: 1 },
  { resolved: 1 }
]
```

## 🔧 Configuration

### Environment Variables
```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=ngfw_dashboard

# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ngfw_dashboard

# Application Configuration
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Security Configuration
JWT_SECRET=your-jwt-secret-here
SESSION_SECRET=your-session-secret-here
```

### Connection Options
```javascript
// MongoDB Client Configuration
{
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4 // Use IPv4
}
```

## 📈 Sample Data

### Generated Data Types
```
🔥 Firewall Rules (50):
   - Web traffic rules
   - SSH access rules
   - Email service rules
   - DNS resolution rules
   - Database access rules

🌐 Network Connections (200):
   - Active connections
   - Historical connections
   - Various protocols (TCP/UDP/ICMP)
   - Different applications
   - Multiple users

🚨 Threat Events (100):
   - Malware detections
   - Intrusion attempts
   - Botnet communications
   - Phishing attempts
   - Vulnerability exploits

📱 Applications (30):
   - Business applications
   - Communication tools
   - Web browsers
   - File transfer tools
   - Database systems
```

### Data Characteristics
- **Realistic IP addresses** and port numbers
- **Time-based data** spanning last 30 days
- **Varied severity levels** for threats
- **Different user accounts** and applications
- **Geographic distribution** for threat sources

## 🔍 Database Operations

### Connection Testing
```bash
# Test basic connection
npm run db:test

# Expected output:
# ✅ Connected to MongoDB successfully!
# 📁 Found X collections
# 📊 Database Statistics: ...
# 🧪 Testing database operations...
# ✅ Test document inserted successfully
```

### Data Verification
```bash
# Connect with MongoDB Compass or CLI
mongo mongodb://localhost:27017/ngfw_dashboard

# Check collections
show collections

# Count documents
db.firewall_rules.countDocuments()
db.network_connections.countDocuments()
db.threat_events.countDocuments()
```

## 🛠️ Troubleshooting

### Common Issues

#### 1. Connection Refused
```
❌ connect ECONNREFUSED 127.0.0.1:27017
```
**Solutions:**
- Check MongoDB service: `net start MongoDB` (Windows)
- Verify MongoDB is installed and running
- Check connection string in `.env.local`

#### 2. Authentication Failed
```
❌ Authentication failed
```
**Solutions:**
- Verify username/password in connection string
- Check database user permissions
- For Atlas: verify network access whitelist

#### 3. Database Not Found
```
❌ Database not found
```
**Solutions:**
- Database is created automatically on first write
- Run `npm run db:setup` to initialize
- Check database name in connection string

#### 4. Collection Errors
```
❌ Collection doesn't exist
```
**Solutions:**
- Run `npm run db:setup` to create collections
- Check collection names in code
- Verify database initialization completed

### Performance Issues

#### Slow Queries
```javascript
// Check query performance
db.firewall_rules.explain("executionStats").find({enabled: true})

// Verify indexes exist
db.firewall_rules.getIndexes()
```

#### Memory Usage
```javascript
// Check database stats
db.stats()

// Monitor collection sizes
db.runCommand({collStats: "network_connections"})
```

## 🔐 Security Best Practices

### Database Security
```env
# Use strong passwords
MONGODB_URI=mongodb+srv://user:STRONG_PASSWORD@cluster.mongodb.net/db

# Enable authentication
# Use SSL/TLS connections
# Restrict network access
```

### Application Security
```javascript
// Input validation
const { body, validationResult } = require('express-validator');

// Sanitize queries
const query = { $text: { $search: sanitize(searchQuery) } };

// Use parameterized queries
const result = await collection.findOne({ _id: new ObjectId(id) });
```

## 📊 Monitoring & Maintenance

### Regular Maintenance
```bash
# Clean up old data (automated)
# - Network connections: 30 days
# - Threat events: 90 days (resolved only)
# - Traffic data: 7 days
# - Statistics: 30 days

# Manual cleanup
node -e "
const { networkRepository } = require('./src/lib/mongodb/repositories/network.repository');
networkRepository.cleanupOldConnections(30);
"
```

### Backup & Recovery
```bash
# Backup database
mongodump --uri="mongodb://localhost:27017/ngfw_dashboard" --out=./backup

# Restore database
mongorestore --uri="mongodb://localhost:27017/ngfw_dashboard" ./backup/ngfw_dashboard
```

## 🎯 Next Steps

After successful database setup:

1. **Start Application**
   ```bash
   npm run dev
   ```

2. **Access Dashboard**
   - URL: http://localhost:3000
   - Username: `admin`
   - Password: `admin123`

3. **Explore Features**
   - View real firewall rules
   - Monitor network connections
   - Analyze threat events
   - Manage applications
   - Configure VPN settings

4. **Customize Data**
   - Add your own firewall rules
   - Configure real network monitoring
   - Set up threat detection rules
   - Customize application policies

## 📚 Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [MongoDB Atlas Guide](https://docs.atlas.mongodb.com/)
- [MongoDB Compass](https://www.mongodb.com/products/compass)
- [Node.js MongoDB Driver](https://mongodb.github.io/node-mongodb-native/)
- [Database Design Best Practices](https://docs.mongodb.com/manual/core/data-modeling-introduction/)
