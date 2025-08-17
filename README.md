# NGFW Dashboard - Next Generation Firewall

Aplikasi dashboard keamanan jaringan yang elegan dan modern, terinspirasi dari Fortinet dengan fitur-fitur lengkap untuk manajemen firewall next generation.

## 🚀 Fitur Utama

### ✅ Sudah Diimplementasi
- **Dashboard Overview** - Statistik keamanan real-time dengan cards yang informatif
- **Layout Responsif** - Sidebar navigation yang elegan dengan dark/light theme
- **Header Navigation** - User profile, notifications, dan search functionality
- **Real-time Charts** - Visualisasi traffic monitoring dan threat trends
- **Quick Actions Panel** - Panel aksi cepat untuk operasi umum
- **Theme System** - Dark/light mode dengan system preference detection

### 🔄 Dalam Pengembangan
- **Firewall Rules Management** - Sistem manajemen aturan firewall
- **Network Monitoring** - Monitor jaringan real-time
- **Threat Detection** - Sistem deteksi dan pencegahan ancaman
- **Application Control** - Kontrol aplikasi dan layanan
- **Web Filtering** - Filter konten web
- **VPN Management** - Manajemen koneksi VPN
- **Reporting & Analytics** - Sistem pelaporan dan analitik
- **User Management** - Manajemen pengguna dan akses

## 🛠️ Teknologi Stack

- **Frontend**: Next.js 14 dengan TypeScript
- **Styling**: Tailwind CSS dengan komponen custom
- **Charts**: Recharts untuk visualisasi data
- **Icons**: Lucide React
- **State Management**: Zustand
- **Theme**: next-themes
- **Forms**: React Hook Form dengan Zod validation
- **Notifications**: React Hot Toast

## 📦 Instalasi

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd ngfw-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Jalankan development server**
   ```bash
   npm run dev
   ```

4. **Buka browser**
   ```
   http://localhost:3000
   ```

## 🎨 Desain & UI/UX

### Tema Warna
- **Primary**: Blue gradient (#0ea5e9 to #3b82f6)
- **Success**: Green (#10b981)
- **Warning**: Yellow (#f59e0b)
- **Danger**: Red (#ef4444)
- **Dark Mode**: Fully supported dengan smooth transitions

### Komponen Utama
- **Sidebar Navigation**: Collapsible dengan icon dan description
- **Header**: Search, notifications, theme toggle, user menu
- **Cards**: Overview cards dengan trend indicators
- **Charts**: Real-time data visualization
- **Quick Actions**: Modal-based actions untuk operasi cepat

## 📁 Struktur Proyek

```
src/
├── app/                    # Next.js 14 app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Dashboard page
│   └── providers.tsx      # Global providers
├── components/            # React components
│   ├── layout/           # Layout components
│   │   ├── sidebar.tsx   # Sidebar navigation
│   │   ├── header.tsx    # Top header
│   │   └── main-layout.tsx
│   ├── dashboard/        # Dashboard components
│   │   ├── overview-cards.tsx
│   │   └── quick-actions.tsx
│   ├── charts/           # Chart components
│   │   └── traffic-chart.tsx
│   └── theme-provider.tsx
├── hooks/                # Custom React hooks
│   ├── useLocalStorage.ts
│   └── useTheme.ts
├── store/                # Zustand stores
│   └── index.ts
├── types/                # TypeScript types
│   └── index.ts
├── utils/                # Utility functions
│   └── index.ts
└── styles/               # Global styles
    └── globals.css
```

## 🔧 Konfigurasi

### Environment Variables
```env
# Tambahkan environment variables sesuai kebutuhan
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Tailwind CSS
Konfigurasi custom theme tersedia di `tailwind.config.js` dengan:
- Custom colors untuk security theme
- Dark mode support
- Custom animations
- Responsive breakpoints

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

## 📊 Fitur Dashboard

### Overview Cards
- **Threats Blocked**: Jumlah ancaman yang diblokir
- **Active Connections**: Koneksi aktif saat ini
- **Critical Alerts**: Alert yang memerlukan perhatian
- **Connected Users**: Pengguna yang terautentikasi

### System Metrics
- **Bandwidth Usage**: Penggunaan bandwidth real-time
- **CPU Usage**: Penggunaan CPU sistem
- **Memory Usage**: Penggunaan memori sistem

### Quick Actions
- Create Firewall Rule
- Block IP Address
- View Threat Logs
- Network Monitor
- Generate Report
- Export Logs
- VPN Status
- Web Filter
- User Management

## 🎯 Roadmap

### Phase 1: Core Features ✅
- [x] Dashboard layout dan navigation
- [x] Overview cards dan metrics
- [x] Theme system
- [x] Basic charts

### Phase 2: Security Modules 🔄
- [ ] Firewall rules management
- [ ] Threat detection system
- [ ] Network monitoring
- [ ] Application control

### Phase 3: Advanced Features 📋
- [ ] VPN management
- [ ] Web filtering
- [ ] Reporting system
- [ ] User management

### Phase 4: Enhancement 🎨
- [ ] Advanced analytics
- [ ] Mobile optimization
- [ ] Performance optimization
- [ ] Testing & documentation

## 🗄️ MongoDB Integration

### Database Setup

**Prerequisites:**
- MongoDB 6.0+ (local or MongoDB Atlas)
- Node.js 18+

**Environment Configuration:**
```bash
# Copy environment template
cp .env.example .env.local

# Configure MongoDB connection
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=ngfw_dashboard
```

**Database Initialization:**
```bash
# Run setup script
node scripts/setup-mongodb.js
```

**Default Admin Credentials:**
- Username: `admin`
- Password: `admin123`
- ⚠️ Change password after first login!

### Real Data Integration

Aplikasi sekarang mendukung data real dari MongoDB:
- ✅ Firewall rules management
- ✅ Network monitoring data
- ✅ Threat events logging
- ✅ Application control policies
- ✅ VPN tunnel management
- ✅ User authentication
- ✅ Audit logging

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Support

Untuk pertanyaan atau dukungan, silakan buat issue di repository ini.

---

**NGFW Dashboard** - Elegant Security Management Interface - By Idiarso - Skansapung
# NGFW
