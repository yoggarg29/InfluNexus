require("dotenv").config();

const express = require("express");
const session = require("express-session");
const path = require("path");

const { errorHandler } = require("./middleware/errorHandler");
const authRoutes = require("./routes/authRoutes");
const influencerRoutes = require("./routes/influencerRoutes");
const brandRoutes = require("./routes/brandRoutes");
const adminRoutes = require("./routes/adminRoutes");
const pageRoutes = require("./routes/pageRoutes");

const app = express();

// Core middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 4,
    },
  })
);

// Routes
app.use("/", pageRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/influencer", influencerRoutes);
app.use("/api/brand", brandRoutes);
app.use("/api/admin", adminRoutes);

// Keep error handling last.
app.use(errorHandler);

const PORT = process.env.PORT || 2001;
app.listen(PORT, () => {
  console.log(`InfluNexus server running on http://localhost:${PORT}`);
});
