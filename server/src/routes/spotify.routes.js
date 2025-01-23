const express = require("express");
const router = express.Router();
const spotifyController = require("../controllers/spotify.controller");
const { requireAuth } = require("../middleware/auth.middleware");

// User profile and data routes
router.get("/user/profile", requireAuth, spotifyController.getUserProfile);
router.get("/user/top-genres", requireAuth, spotifyController.getTopGenres);
router.get(
  "/user/recently-played",
  requireAuth,
  spotifyController.getRecentlyPlayed
);

// Search route
router.get("/search", requireAuth, spotifyController.searchTracks);

module.exports = router;
