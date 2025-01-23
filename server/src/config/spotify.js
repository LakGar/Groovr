const axios = require("axios");

const SPOTIFY_CONFIG = {
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri:
    process.env.SPOTIFY_REDIRECT_URI || "http://localhost:5173/callback",
  tokenEndpoint: "https://accounts.spotify.com/api/token",
  authEndpoint: "https://accounts.spotify.com/authorize",
  apiBaseUrl: "https://api.spotify.com/v1",
};

const spotifyApi = axios.create({
  baseURL: SPOTIFY_CONFIG.apiBaseUrl,
});

module.exports = {
  SPOTIFY_CONFIG,
  spotifyApi,
};
