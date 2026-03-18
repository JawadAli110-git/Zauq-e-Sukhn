<<<<<<< HEAD
# ذوقِ سخن — Zauq-e-Sukhn

<div align="center">

> **"شعر وہ ہے جو دل سے نکلے اور دل میں اُترے"**
> *Poetry is that which emanates from the heart and settles in the heart*

A full-stack Urdu Poetry web application — explore, learn, and discover the art of Urdu Shayari.

</div>

---

## اردو میں تعارف

**ذوقِ سخن** ایک مکمل اردو شاعری ویب ایپلیکیشن ہے جہاں آپ مشہور شعراء کی شاعری پڑھ سکتے ہیں، اردو شاعری کے کورسز کر سکتے ہیں، قافیہ ڈکشنری استعمال کر سکتے ہیں، اور اردو سخن کی دنیا میں غوطہ لگا سکتے ہیں۔

## English Introduction

**Zauq-e-Sukhn** (The Taste of Poetry) is a comprehensive Urdu poetry platform featuring:
- Curated works from classical and modern Urdu poets
- Structured courses on the art of Urdu poetry (Ghazal, Nazm, Beher, Qafiya, and more)
- A searchable Qafiya (rhyme) dictionary
- Admin panel for content management
- Beautiful RTL-first design with dark/light mode

---

## ✨ Features

| Feature | Description |
|---|---|
| 📚 Poetry Collection | 30+ poems by 8+ famous poets |
| 👤 Poet Profiles | Detailed biographies, era, style, and works |
| 🎓 Courses | 10 structured lessons on Urdu prosody |
| 📖 Qafiya Dictionary | 40+ entries with meanings and examples |
| 🔐 Authentication | JWT-based login/register system |
| 🛡️ Admin Panel | Full CRUD for poets, poetry, courses, and qafiya |
| 🌙 Dark/Light Mode | Toggle between modes, persisted in localStorage |
| 📱 Responsive | Mobile, tablet, and desktop friendly |
| 🌐 RTL Support | Proper Urdu right-to-left typography throughout |

---

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS v4
- **Backend**: Node.js + Express.js
- **Database**: SQLite (via `better-sqlite3`) — file-based, zero installation required
- **Authentication**: JWT + bcryptjs
- **State Management**: React Context API
- **Animations**: Framer Motion
- **Icons**: React Icons
- **Fonts**: Noto Nastaliq Urdu, Poppins (Google Fonts)

---

## ⚡ Quick Start (recommended)

This is the fastest way to get the entire app running with a single command.

### Prerequisites
- **Node.js v18+** — [download](https://nodejs.org/)
- No database installation needed — SQLite is a single file bundled with the app ✅

### Step 1 — Clone and install everything

```bash
git clone https://github.com/raza-neduet28/Zauq-e-Sukhn.git
cd Zauq-e-Sukhn

# Install root dev tools (concurrently) + all workspace deps
npm install
npm run install:all
```

### Step 2 — Configure the backend environment

Create a file called `.env` inside the `server/` directory:

```bash
# on macOS / Linux
cp server/.env.example server/.env

# on Windows (PowerShell)
Copy-Item server\.env.example server\.env
```

Open `server/.env` and set your values:

```env
PORT=5000
DB_PATH=./zauq-e-sukhn.db
JWT_SECRET=replace_this_with_a_long_random_secret
NODE_ENV=development
```

> `DB_PATH` is the path to the SQLite database file. The default `./zauq-e-sukhn.db` creates it inside `server/`.

### Step 3 — Seed the database

```bash
npm run seed
```

This populates the SQLite database with:
- Admin & test user accounts
- 8 poets with full Urdu biographies
- 30+ poems and ghazals
- 10 course lessons
- 40+ qafiya entries

### Step 4 — Start both server and client together

```bash
npm run dev
```

That's it! The terminal will show colour-coded output from both processes:
- **[server]** — API running at `http://localhost:5000`
- **[client]** — React app running at `http://localhost:5173`

Open **http://localhost:5173** in your browser to use the app.

---

## 💻 Running in VS Code

The repo ships with a `.vscode/` folder that makes it **one click** to run, debug, and manage the project directly inside VS Code — no manual terminal commands needed.

### First-time setup (do this once)

1. **Open the folder** — in VS Code choose *File → Open Folder* and select the `Zauq-e-Sukhn` folder.
2. **Install recommended extensions** — VS Code will show a pop-up *"This workspace has extension recommendations"*. Click **Install All**. (Or open the Extensions panel, search `@recommended`, and install them.)
3. **Install dependencies** — open the integrated terminal (<kbd>Ctrl</kbd>+<kbd>`</kbd> on Windows/Linux, <kbd>⌃</kbd>+<kbd>`</kbd> on macOS) and run:
   ```bash
   npm run install:all
   ```
4. **Create the `.env` file** — copy the example and fill in your MongoDB URI and a secret key:
   ```bash
   # Windows (PowerShell)
   Copy-Item server\.env.example server\.env

   # Windows (Command Prompt)
   copy server\.env.example server\.env

   # macOS / Linux
   cp server/.env.example server/.env
   ```
   Then open `server/.env` and edit it:
   ```env
   PORT=5000
   DB_PATH=./zauq-e-sukhn.db
   JWT_SECRET=any_long_random_string_here
   NODE_ENV=development
   ```
5. **Seed the database** — press <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd> (or <kbd>⌘</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd> on Mac), type **"Tasks: Run Task"**, then select **"Seed: Database"**.

### Running the app

#### Option A — Run Task (simplest)
1. Press <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd> → **"Tasks: Run Task"**
2. Select **"🚀 Start Full App (Server + Client)"**
3. Two integrated terminal panels open — one for the backend, one for the frontend.
4. Open **http://localhost:5173** in your browser.

#### Option B — Run & Debug panel (with breakpoints)
1. Open the **Run and Debug** panel: click the play icon in the left sidebar or press <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>D</kbd>.
2. From the dropdown at the top choose **"🚀 Full Stack (Server + Client)"**.
3. Click the green **▶ Start Debugging** button (or press <kbd>F5</kbd>).
4. VS Code launches both the backend (Node.js debugger) and opens the frontend in Chrome.
5. You can now set **breakpoints** in any `.js` or `.jsx` file — VS Code will pause execution there.

#### Option C — Integrated Terminal
```bash
# start both with one command
npm run dev
```

### Available VS Code tasks

| Task name | What it does |
|---|---|
| 🚀 Start Full App (Server + Client) | Starts backend + frontend in parallel |
| Start: Backend Server | Starts only the Express API (port 5000) |
| Start: Frontend (Vite) | Starts only the React app (port 5173) |
| Seed: Database | Populates MongoDB with sample data |
| Install: All Dependencies | Runs `npm install` for both server and client |

### Available debug configurations

| Configuration | What it does |
|---|---|
| 🚀 Full Stack (Server + Client) | Debugs both server and client together |
| 🟢 Debug: Backend Server | Attaches Node.js debugger to the Express server |
| 🟣 Debug: Frontend (Chrome) | Opens React app in Chrome with source maps |

---

## 🌐 Accessing the Application

### Frontend pages

| URL | Page |
|---|---|
| `http://localhost:5173/` | 🏠 Home — hero, poetry of the day, featured poets |
| `http://localhost:5173/poets` | 👤 All Poets |
| `http://localhost:5173/poets/:id` | 👤 Poet Detail page |
| `http://localhost:5173/poetry` | 📚 Full Poetry Collection |
| `http://localhost:5173/courses` | 🎓 Course List |
| `http://localhost:5173/courses/:id` | 🎓 Course Detail / Lessons |
| `http://localhost:5173/qafiya` | 📖 Qafiya (Rhyme) Dictionary |
| `http://localhost:5173/login` | 🔐 Login |
| `http://localhost:5173/register` | 🔐 Register |
| `http://localhost:5173/admin` | 🛡️ Admin Dashboard *(admin only)* |
| `http://localhost:5173/admin/poets` | 🛡️ Manage Poets *(admin only)* |
| `http://localhost:5173/admin/poetry` | 🛡️ Manage Poetry *(admin only)* |
| `http://localhost:5173/admin/qafiya` | 🛡️ Manage Qafiya *(admin only)* |
| `http://localhost:5173/admin/courses` | 🛡️ Manage Courses *(admin only)* |

### Backend API endpoints

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/health` | — | Server health check |
| POST | `/auth/register` | — | Register a new user |
| POST | `/auth/login` | — | Login, returns JWT |
| GET | `/auth/me` | ✅ User | Current user info |
| GET | `/poets` | — | List all poets |
| GET | `/poets/:id` | — | Single poet detail |
| GET | `/poets/:id/poetry` | — | All poetry for a poet |
| POST | `/poets` | 🛡️ Admin | Create a poet |
| PUT | `/poets/:id` | 🛡️ Admin | Update a poet |
| DELETE | `/poets/:id` | 🛡️ Admin | Delete a poet |
| GET | `/poetry` | — | List poetry (`?type=ghazal&featured=true&limit=6`) |
| GET | `/poetry/featured` | — | Featured poetry |
| GET | `/poetry/:id` | — | Single poem |
| POST | `/poetry` | 🛡️ Admin | Create a poem |
| PUT | `/poetry/:id` | 🛡️ Admin | Update a poem |
| DELETE | `/poetry/:id` | 🛡️ Admin | Delete a poem |
| POST | `/poetry/:id/favorite` | ✅ User | Toggle favourite |
| GET | `/courses` | — | All published courses |
| GET | `/courses/:id` | — | Single course with lessons |
| POST | `/courses` | 🛡️ Admin | Create a course |
| PUT | `/courses/:id` | 🛡️ Admin | Update a course |
| DELETE | `/courses/:id` | 🛡️ Admin | Delete a course |
| GET | `/qafiya` | — | All qafiya entries (`?search=word`) |
| GET | `/qafiya/search/:query` | — | Search qafiya |
| GET | `/qafiya/:id` | — | Single qafiya entry |
| POST | `/qafiya` | 🛡️ Admin | Create a qafiya entry |
| PUT | `/qafiya/:id` | 🛡️ Admin | Update a qafiya entry |
| DELETE | `/qafiya/:id` | 🛡️ Admin | Delete a qafiya entry |

---

## 🔑 Default Credentials

> ⚠️ **Change these before deploying to production!**

| Role | Email | Password |
|---|---|---|
| Admin | admin@zauqesukhn.com | admin123 |
| Test User | test@zauqesukhn.com | test123 |

Log in as admin at `http://localhost:5173/login`, then visit `http://localhost:5173/admin` to manage all content.

---

## 🔧 Running Server and Client Separately

If you prefer to run each service in its own terminal window:

**Terminal 1 — Backend**
```bash
cd server
npm install          # first time only
npm run dev          # starts with nodemon (auto-restarts on changes)
```

**Terminal 2 — Frontend**
```bash
cd client
npm install          # first time only
npm run dev          # starts Vite dev server
```

### Other useful scripts

| Command (run from repo root) | What it does |
|---|---|
| `npm run dev` | Start server + client together |
| `npm run install:all` | Install deps for both server and client |
| `npm run seed` | Seed the database |
| `npm run build` | Build the React frontend for production |
| `npm run start` | Start the backend in production mode |

---

## 🚀 Setup Instructions (detailed)

### Prerequisites
- Node.js v18+
- npm or yarn
- No separate database server needed — SQLite creates a local file automatically

### 1. Clone the Repository
```bash
git clone https://github.com/raza-neduet28/Zauq-e-Sukhn.git
cd Zauq-e-Sukhn
```

### 2. Setup the Backend (Server)
```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory (copy from the example):
```bash
cp server/.env.example server/.env   # then edit with your values
```

```env
PORT=5000
DB_PATH=./zauq-e-sukhn.db
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

### 3. Seed the Database
```bash
# from the repo root:
npm run seed
# or from inside server/:
cd server && npm run seed
```

### 4. Start the Backend Server
```bash
cd server
npm run dev     # Development (with nodemon)
# or
npm start       # Production
```
The server runs on **http://localhost:5000**

### 5. Setup the Frontend (Client)
```bash
cd client
npm install
```

### 6. Start the Frontend
```bash
cd client
npm run dev
```
The frontend runs at **http://localhost:5173**

---

## 🛠️ Troubleshooting

| Problem | Fix |
|---|---|
| `JWT_SECRET environment variable is not set` | Create `server/.env` and set `JWT_SECRET` |
| Port 5000 already in use | Change `PORT` in `server/.env`, then update `client/vite.config.js` proxy target |
| Port 5173 already in use | Vite will auto-pick the next free port; update the proxy if needed |
| Blank page after login | Make sure the backend is running |
| `npm run seed` fails | Check that `server/.env` exists and `JWT_SECRET` is set; check file write permissions for `DB_PATH` |
| Admin routes redirect to home | Log in with the admin account (`admin@zauqesukhn.com`) after seeding |
| Database file is corrupted | Delete `server/zauq-e-sukhn.db` and run `npm run seed` again — SQLite will recreate it |

---

## 📁 Project Structure

```
Zauq-e-Sukhn/
├── package.json               # Root: concurrently dev script + install:all
├── client/                    # React Frontend (Vite)
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── PoetCard.jsx
│   │   │   ├── SherCard.jsx
│   │   │   ├── CourseCard.jsx
│   │   │   ├── QafiyaCard.jsx
│   │   │   ├── ThemeToggle.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── Loading.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Poets.jsx
│   │   │   ├── PoetDetail.jsx
│   │   │   ├── Poetry.jsx
│   │   │   ├── Courses.jsx
│   │   │   ├── CourseDetail.jsx
│   │   │   ├── Qafiya.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── admin/
│   │   │       ├── Dashboard.jsx
│   │   │       ├── ManagePoets.jsx
│   │   │       ├── ManagePoetry.jsx
│   │   │       ├── ManageQafiya.jsx
│   │   │       └── ManageCourses.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── data/              # Static fallback data (used when API is offline)
│   │   │   ├── poets.js
│   │   │   ├── poetry.js
│   │   │   ├── courses.js
│   │   │   └── qafiya.js
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── server/                    # Express Backend
│   ├── .env.example           # Copy to .env and fill in your values
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── admin.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Poet.js
│   │   ├── Poetry.js
│   │   ├── Course.js
│   │   └── Qafiya.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── poets.js
│   │   ├── poetry.js
│   │   ├── courses.js
│   │   └── qafiya.js
│   ├── seed/
│   │   └── seedData.js
│   ├── server.js
│   └── package.json
└── README.md
```

---

## 📸 Screenshots

> *Coming soon — add your screenshots here!*

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📜 License

This project is open source. Please attribute the original authors of any Urdu poetry content included.

---

<div align="center">

**شاعری کا ذوق، علم کا نور**
*The taste of poetry, the light of knowledge*

Made with ❤️ for lovers of Urdu poetry

</div>
=======
# Zauq-e-Sukhn
Web APP
>>>>>>> 01f80bc3d3b67286719574e76822e76ca5ef2f06
