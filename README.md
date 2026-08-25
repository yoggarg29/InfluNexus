# InfluNexus

A platform connecting social media influencers with brands — influencers
build a public profile and post events they're available for, brands
search for influencers by content type/city/name and reach out.

## Tech Stack

- **Frontend:** HTML5, CSS3, Bootstrap 5, JavaScript, jQuery
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Auth:** express-session (cookie-based sessions) + bcrypt for password hashing
- **File uploads:** multer

## Project Structure

```
InfluNexus/
├── server.js              # entry point — wires config, middleware, routes together
├── package.json
├── .env.example            # copy to .env and fill in your own values
│
├── config/
│   └── db.js               # MySQL connection pool
│
├── database/
│   └── schema.sql          # run this to create the database + tables
│
├── middleware/
│   ├── auth.js              # requireLogin / requireRole session guards
│   ├── errorHandler.js      # asyncHandler wrapper + centralized error responses
│   ├── upload.js            # multer config for profile picture uploads
│   └── validators.js        # small validation helper functions
│
├── controllers/            # request handling + business logic
│   ├── authController.js
│   ├── influencerController.js
│   ├── brandController.js
│   └── adminController.js
│
├── routes/                 # maps URL + HTTP verb -> controller function
│   ├── authRoutes.js        # /api/auth/*
│   ├── influencerRoutes.js  # /api/influencer/*
│   ├── brandRoutes.js       # /api/brand/*
│   ├── adminRoutes.js       # /api/admin/*
│   └── pageRoutes.js        # clean URLs for the static HTML pages
│
└── public/                 # everything served to the browser
    ├── css/style.css        # one shared stylesheet
    ├── js/common.js         # shared jQuery helpers (alerts, spinners, session check)
    ├── pics/                # static images used across the site
    ├── uploads/             # user-uploaded profile pictures
    └── *.html               # one HTML file per page
```

> **Note on `views/`:** this project doesn't use a templating engine like
> EJS, so there's no separate `views/` folder — every page is a plain
> static `.html` file served from `public/`.

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create the database**
   ```bash
   mysql -u root -p < database/schema.sql
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your MySQL password and a random session secret.

4. **Run the server**
   ```bash
   npm start        # or: npm run dev  (auto-restarts on file changes)
   ```
   The app runs at `http://localhost:2001` by default.

5. **Create an admin account** — sign up normally through the UI as an
   INFLUENCER or BRAND, or insert a row directly:
   ```sql
   -- password hash for "Admin@123" — generate your own with:
   -- node -e "console.log(require('bcrypt').hashSync('yourpassword', 10))"
   INSERT INTO users (email, password, user_type, status)
   VALUES ('admin@influnexus.com', '<bcrypt_hash>', 'ADMIN', 1);
   ```

## API Overview

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/signup` | Create an account | — |
| POST | `/api/auth/login` | Log in, starts a session | — |
| POST | `/api/auth/logout` | End the session | logged in |
| GET | `/api/auth/me` | Who's currently logged in | logged in |
| POST | `/api/auth/change-password` | Change your own password | logged in |
| GET / POST | `/api/influencer/profile` | Get / create-or-update own profile | INFLUENCER |
| GET | `/api/influencer/search` | Search influencers by contentType/city/name | — |
| GET | `/api/influencer/cities` | Distinct cities (for the search dropdown) | — |
| GET / POST | `/api/influencer/events` | List / post own events | INFLUENCER |
| DELETE | `/api/influencer/events/:id` | Delete own event | INFLUENCER |
| GET / POST | `/api/brand/profile` | Get / create-or-update own profile | BRAND |
| GET | `/api/admin/users` | List all users | ADMIN |
| GET | `/api/admin/influencers` | List all influencer profiles | ADMIN |
| DELETE | `/api/admin/users/:email` | Delete a user | ADMIN |
| PATCH | `/api/admin/users/:email/status` | Block/unblock a user | ADMIN |
