# TinyLink - URL Shortener

A modern URL shortener application built with Node.js, Express, React, and PostgreSQL. Create short links, track click statistics, and manage your URLs with a clean, responsive interface.

## 🚀 Live Demo

- **Frontend**: [https://tinylink-frontend.vercel.app](https://tinylink-frontend.vercel.app)
- **Backend**: [https://tinylink-backend.onrender.com](https://tinylink-backend.onrender.com)
- **Health Check**: [https://tinylink-backend.onrender.com/healthz](https://tinylink-backend.onrender.com/healthz)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### Core Functionality
- **URL Shortening**: Create short links with optional custom codes
- **Click Tracking**: Real-time click count and timestamp tracking
- **Link Management**: View, delete, and search through all links
- **Statistics**: Detailed analytics for each shortened link
- **Redirect Service**: Fast 302 redirects to original URLs

### User Interface
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Real-time Updates**: Instant feedback and live data updates
- **Search & Filter**: Quickly find links by code or URL
- **Copy to Clipboard**: One-click copying of short URLs
- **Error Handling**: User-friendly error messages and validation

### Technical Features
- **Health Check**: System monitoring endpoint
- **Input Validation**: URL and code format validation
- **Duplicate Prevention**: Automatic detection of duplicate codes
- **RESTful API**: Clean, documented API endpoints
- **Automated Testing**: Comprehensive Jest test suite

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js (JavaScript only)
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma (JavaScript mode)
- **Testing**: Jest + Supertest
- **Deployment**: Render (Railway ready)

### Frontend
- **Library**: React (JavaScript only)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Deployment**: Vercel (Netlify ready)

### Database
- **Provider**: Neon (PostgreSQL free tier)
- **Features**: ACID transactions, automatic backups
- **Scaling**: Connection pooling ready

## 🏗 Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (React)       │◄──►│   (Express)     │◄──►│  (PostgreSQL)   │
│   Port: 3000    │    │   Port: 3001    │    │   Neon/Local    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
    ┌────▼────┐             ┌────▼────┐             ┌────▼────┐
    │  Vercel │             │  Render │             │  Neon   │
    │  Deploy │             │  Deploy │             │  DB     │
    └─────────┘             └─────────┘             └─────────┘
```

### API Flow
1. **Create Link**: Frontend → POST /api/links → Database
2. **List Links**: Frontend → GET /api/links → Database
3. **View Stats**: Frontend → GET /api/links/:code → Database
4. **Delete Link**: Frontend → DELETE /api/links/:code → Database
5. **Redirect**: Browser → GET /:code → Database → 302 Redirect

### Data Flow
```
User Input → Validation → Prisma ORM → PostgreSQL → Response
                    ↓
              Error Handling
```

## 🚀 Installation

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- PostgreSQL database (Neon or local)

### Local Development Setup

#### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd tinylink
```

#### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Update .env with your database URL
# DATABASE_URL=postgresql://username:password@host:port/database_name

# Generate Prisma client
npx prisma generate

# Run migrations
npm run migrate:dev

# Seed database (optional)
npm run seed

# Start development server
npm run dev
```

#### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

#### 4. Access the Application
- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- Health Check: http://localhost:3001/healthz

## 🔧 Environment Variables

### Backend (.env)
```bash
# Database connection (Neon or local PostgreSQL)
DATABASE_URL=postgresql://username:password@host:port/database_name

# Server configuration
PORT=3001
NODE_ENV=development
```

### Frontend (Optional)
```bash
# API Base URL (optional, defaults to relative paths)
VITE_API_URL=http://localhost:3001
```

## 🗄 Database Setup

### Using Neon (Recommended - Free Tier)
1. Go to [Neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Add to your `.env` file

### Local PostgreSQL
1. Install PostgreSQL locally
2. Create a database:
```bash
createdb tinylink
```
3. Update your `.env` with local connection string

### Migrations
```bash
# Create new migration
npx prisma migrate dev --name init

# Deploy migrations (production)
npm run migrate

# Reset database (development only)
npx prisma migrate reset
```

### Database Schema
```sql
CREATE TABLE links (
    id SERIAL PRIMARY KEY,
    code VARCHAR(8) UNIQUE NOT NULL,
    url TEXT NOT NULL,
    clicks INTEGER DEFAULT 0,
    lastClicked TIMESTAMP,
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX idx_links_code ON links(code);
CREATE INDEX idx_links_createdAt ON links(createdAt);
```

## 📚 API Documentation

### Base URL
```
Development: http://localhost:3001
Production: https://tinylink-backend.onrender.com
```

### Endpoints

#### Health Check
```http
GET /healthz
```

**Response:**
```json
{
  "ok": true,
  "version": "1.0"
}
```

#### Create Link
```http
POST /api/links
Content-Type: application/json

{
  "url": "https://example.com",
  "code": "custom123"  // Optional
}
```

**Response (201):**
```json
{
  "id": 1,
  "code": "custom123",
  "url": "https://example.com",
  "clicks": 0,
  "lastClicked": null,
  "createdAt": "2025-01-20T10:00:00Z",
  "updatedAt": "2025-01-20T10:00:00Z"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid URL or code format
- `409 Conflict`: Code already exists

#### List All Links
```http
GET /api/links
```

**Response (200):**
```json
[
  {
    "id": 1,
    "code": "example1",
    "url": "https://example.com",
    "clicks": 42,
    "lastClicked": "2025-01-19T15:30:00Z",
    "createdAt": "2025-01-18T10:00:00Z",
    "updatedAt": "2025-01-19T15:30:00Z"
  }
]
```

#### Get Link Statistics
```http
GET /api/links/:code
```

**Response (200):**
```json
{
  "id": 1,
  "code": "example1",
  "url": "https://example.com",
  "clicks": 42,
  "lastClicked": "2025-01-19T15:30:00Z",
  "createdAt": "2025-01-18T10:00:00Z",
  "updatedAt": "2025-01-19T15:30:00Z"
}
```

**Error Response:**
- `404 Not Found`: Code doesn't exist

#### Delete Link
```http
DELETE /api/links/:code
```

**Response:**
- `204 No Content`: Successfully deleted
- `404 Not Found`: Code doesn't exist

#### Redirect
```http
GET /:code
```

**Response:**
- `302 Found`: Redirects to original URL
- `404 Not Found`: Code doesn't exist

## 🚀 Deployment

### Backend Deployment (Render)

#### Option 1: Render (Recommended)
1. Push code to GitHub
2. Connect your GitHub repo to Render
3. Create a new Web Service
4. Configure build settings:
   - **Build Command**: `cd backend && npm install && npx prisma generate`
   - **Start Command**: `cd backend && npm start`
5. Add environment variables in Render dashboard
6. Deploy!

#### Option 2: Railway
1. Install Railway CLI: `npm install -g @railway/cli`
2. Login: `railway login`
3. Initialize: `railway init`
4. Add PostgreSQL: `railway add postgresql`
5. Deploy: `railway up`

### Frontend Deployment (Vercel)

#### Option 1: Vercel (Recommended)
1. Push code to GitHub
2. Connect your GitHub repo to Vercel
3. Set build settings:
   - **Framework Preset**: Vite
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Output Directory**: `frontend/dist`
4. Add environment variables if needed
5. Deploy!

#### Option 2: Netlify
1. Push code to GitHub
2. Connect your GitHub repo to Netlify
3. Configure build settings:
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`
4. Deploy!

### Database Setup (Neon)
1. Create account at [Neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string
4. Add to your deployment environment variables

## 🧪 Testing

### Run Backend Tests
```bash
cd backend

# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

### Test Coverage
The test suite includes:
- ✅ Health check endpoint
- ✅ Link creation (valid and invalid URLs)
- ✅ Duplicate code handling (409 status)
- ✅ Link listing and retrieval
- ✅ Link deletion
- ✅ Redirect functionality (302 status)
- ✅ Click count incrementation
- ✅ 404 responses for deleted/non-existent links

### Test Structure
```
backend/tests/
├── links.test.js          # Main API tests
├── setup.js              # Test configuration
└── fixtures/             # Test data
```

### Manual Testing Examples

#### Create a Link
```bash
curl -X POST https://tinylink-backend.onrender.com/api/links \
  -H "Content-Type: application/json" \
  -d '{"url": "https://github.com"}'
```

#### Check Health
```bash
curl https://tinylink-backend.onrender.com/healthz
```

#### Redirect Test
Visit `https://your-domain.com/example123` (after creating the link)

## 📁 Project Structure

```
tinylink/
├── backend/                          # Backend application
│   ├── controllers/                  # Request handlers
│   │   └── linkController.js         # Link operations
│   ├── routes/                       # API routes
│   │   ├── links.js                  # Link endpoints
│   │   └── health.js                 # Health check
│   ├── models/                       # Database models
│   ├── migrations/                   # Database migrations
│   ├── scripts/                      # Utility scripts
│   │   └── seed.js                   # Database seeding
│   ├── tests/                        # Test files
│   │   └── links.test.js             # API tests
│   ├── prisma/                       # Prisma configuration
│   │   └── schema.prisma             # Database schema
│   ├── .env.example                  # Environment template
│   ├── .gitignore                    # Git ignore rules
│   ├── jest.config.js                # Jest configuration
│   ├── package.json                  # Backend dependencies
│   └── server.js                     # Main server file
│
├── frontend/                         # Frontend application
│   ├── public/                       # Static assets
│   ├── src/                          # Source code
│   │   ├── components/               # React components
│   │   │   ├── CreateLinkForm.jsx    # Link creation form
│   │   │   └── LinkTable.jsx         # Links display table
│   │   ├── pages/                    # Page components
│   │   │   ├── Dashboard.jsx         # Main dashboard
│   │   │   └── Stats.jsx             # Statistics page
│   │   ├── hooks/                    # Custom React hooks
│   │   ├── utils/                    # Utility functions
│   │   ├── App.jsx                   # Main app component
│   │   ├── main.jsx                  # App entry point
│   │   └── index.css                 # Global styles
│   ├── .gitignore                    # Git ignore rules
│   ├── index.html                    # HTML template
│   ├── package.json                  # Frontend dependencies
│   ├── postcss.config.js             # PostCSS configuration
│   ├── tailwind.config.js            # Tailwind CSS config
│   └── vite.config.js                # Vite configuration
│
├── README.md                         # This file
└── .git/                             # Git repository
```

## 🛡 Security Features

- **URL Validation**: Prevents malicious URL injection
- **Input Sanitization**: XSS prevention through React's built-in escaping
- **Error Handling**: No sensitive information leaked in error responses
- **Rate Limiting**: Ready for implementation (commented in code)
- **Environment Variables**: Sensitive data stored securely
- **HTTPS**: Enforced in production deployments

## 🔮 Future Improvements

### Short Term
- [ ] User authentication and multi-user support
- [ ] Link expiration dates
- [ ] QR code generation for links
- [ ] Link categories and tags
- [ ] Bulk link import/export

### Long Term
- [ ] Advanced analytics dashboard
- [ ] Link A/B testing
- [ ] Custom domains
- [ ] API rate limiting
- [ ] Link password protection
- [ ] Click tracking by geography
- [ ] Integration with social media platforms

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Neon** for providing free PostgreSQL hosting
- **Vercel** and **Render** for free deployment platforms
- **Tailwind CSS** for the utility-first CSS framework
- **React** and **Node.js** communities for excellent documentation

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-username/tinylink/issues) page
2. Create a new issue with detailed information
3. Include error messages and steps to reproduce

---

**Built with ❤️ using Node.js, React, and PostgreSQL**

Last updated: January 20, 2025
