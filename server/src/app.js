require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const authRoutes = require("./routes/auth");
const checkRequiredEnvVars = require("./config/checkEnv");
const spotifyRoutes = require("./routes/spotify.routes");

const app = express();
const PORT = process.env.PORT || 5001;

// Check environment variables before starting the server
checkRequiredEnvVars();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", spotifyRoutes);

// Health check route
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
