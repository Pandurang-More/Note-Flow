# Note-Flow - A Note-Taking Application

A full-stack web application with core functionality, allowing users to create, organize, and manage notes with a beautiful, intuitive interface.


## 🌟 Features

### Core Functionality
- ✅ **User Authentication** - Secure JWT-based login and registration
- ✅ **Page Management** - Create, edit, delete, and organize pages
- ✅ **Block-Based Editor** - Notion-style block editor for content
- ✅ **Favorites** - Star important pages for quick access
- ✅ **Trash System** - Soft delete with restore functionality
- ✅ **Auto-Save** - Automatic content saving
- ✅ **Responsive Design** - Works on desktop and mobile devices

### User Experience
- 🎨 Beautiful gradient ocean theme
- 🔄 Real-time UI updates
- ⌨️ Keyboard shortcuts (Enter for new block, Backspace to delete)
- 🔒 Secure password hashing with bcrypt
- 💾 Persistent storage with MongoDB

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Flexbox, gradients, and animations
- **Vanilla JavaScript (ES6+)** - DOM manipulation and API integration

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB

### Authentication & Security
- **JWT (jsonwebtoken)** - Token-based authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas) (Free tier)
- [Git](https://git-scm.com/)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/notionlite.git
cd notionlite
```

### 2. Install Dependencies
```bash
cd backend
npm install
```

### 3. Environment Configuration

Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=your_super_secret_key_here
```

**To get MongoDB connection string:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Go to Database Access → Add Database User
4. Go to Network Access → Add IP Address (Allow from anywhere for development)
5. Go to Database → Connect → Drivers → Copy connection string
6. Replace `<password>` with your actual password

### 4. Start the Application
```bash
npm run dev
```

The server will start at `http://localhost:5000`

### 5. Access the Application

Open your browser and navigate to:
```
http://localhost:5000
```

## 📁 Project Structure
```
notionlite/
├── backend/
│   ├── models/
│   │   ├── User.js          # User schema
│   │   ├── Page.js          # Page schema
│   │   └── Block.js         # Block schema
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   ├── pages.js         # Page CRUD routes
│   │   └── blocks.js        # Block CRUD routes
│   ├── middleware/
│   │   └── auth.js          # JWT verification middleware
│   ├── public/
│   │   ├── index.html       # Main application
│   │   ├── login.html       # Login/Register page
│   │   ├── style.css        # Styles
│   │   └── script.js        # Frontend logic
│   ├── .env                 # Environment variables
│   ├── server.js            # Express server
│   └── package.json         # Dependencies
└── README.md
```

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register    - Register new user
POST   /api/auth/login       - Login user
```

### Pages
```
GET    /api/pages            - Get all pages (with filters)
GET    /api/pages/:id        - Get single page
POST   /api/pages            - Create new page
PUT    /api/pages/:id        - Update page
DELETE /api/pages/:id        - Delete page
PATCH  /api/pages/:id/favorite   - Toggle favorite
PATCH  /api/pages/:id/trash      - Move to trash
PATCH  /api/pages/:id/restore    - Restore from trash
DELETE /api/pages/:id/permanent  - Permanently delete
```

### Blocks
```
GET    /api/blocks/:pageId   - Get all blocks for a page
POST   /api/blocks           - Create new block
PUT    /api/blocks/:id       - Update block
DELETE /api/blocks/:id       - Delete block
```

## 🎯 Usage Guide

### Getting Started
1. **Register** - Create a new account
2. **Login** - Access your workspace
3. **Create Page** - Click "+ New Page" in sidebar
4. **Add Content** - Click "+ Click to add a new block"
5. **Save** - Click "Save" button or data saves automatically

### Keyboard Shortcuts
- `Enter` - Create new block below
- `Backspace` (on empty block) - Delete block and move to previous

### Navigation
- **All Pages** - View all active pages
- **Favorites** - View starred pages
- **Trash** - View deleted pages

### Page Actions
- **Star** - Mark page as favorite
- **Trash** - Move page to trash
- **Restore** - Restore from trash
- **Delete Forever** - Permanently delete (cannot be undone)

## 🔒 Security Features

- **Password Hashing** - Passwords encrypted with bcrypt (10 salt rounds)
- **JWT Authentication** - Stateless token-based auth (7-day expiry)
- **Input Validation** - Server-side validation
- **CORS Protection** - Controlled cross-origin requests
- **Authorization Checks** - Users can only access their own data

## 🌐 Deployment

`note-flow-y576.onrender.com`


