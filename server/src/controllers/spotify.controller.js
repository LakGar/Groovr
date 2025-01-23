const axios = require("axios");

const spotifyController = {
  getUserProfile: async (req, res) => {
    try {
      const accessToken = req.user.access_token;

      const response = await axios.get("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      return res.json({
        id: response.data.id,
        display_name: response.data.display_name,
        email: response.data.email,
        images: response.data.images,
        country: response.data.country,
        product: response.data.product,
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return res.status(500).json({ error: "Failed to fetch user profile" });
    }
  },

  getTopGenres: async (req, res) => {
    try {
      const accessToken = req.user.access_token;

      const response = await axios.get(
        "https://api.spotify.com/v1/me/top/artists",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: {
            limit: 20,
            time_range: "medium_term",
          },
        }
      );

      // Extract and count genres
      const genreCounts = {};
      response.data.items.forEach((artist) => {
        artist.genres.forEach((genre) => {
          genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        });
      });

      // Sort genres by count and get top 5
      const topGenres = Object.entries(genreCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([genre]) => genre);

      return res.json({ genres: topGenres });
    } catch (error) {
      console.error("Error fetching top genres:", error);
      return res.status(500).json({ error: "Failed to fetch top genres" });
    }
  },

  getRecentlyPlayed: async (req, res) => {
    try {
      const accessToken = req.user.access_token;

      const response = await axios.get(
        "https://api.spotify.com/v1/me/player/recently-played",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: { limit: 20 },
        }
      );

      const tracks = response.data.items.map((item) => ({
        id: item.track.id,
        name: item.track.name,
        artist: item.track.artists[0].name,
        albumArt: item.track.album.images[0]?.url,
        previewUrl: item.track.preview_url,
        uri: item.track.uri,
        played_at: item.played_at,
      }));

      return res.json({ tracks });
    } catch (error) {
      console.error("Error fetching recently played:", error);
      return res
        .status(500)
        .json({ error: "Failed to fetch recently played tracks" });
    }
  },

  searchTracks: async (req, res) => {
    try {
      const { q: query } = req.query;
      if (!query) {
        return res.status(400).json({ error: "Search query is required" });
      }

      const accessToken = req.user.access_token;

      const response = await axios.get("https://api.spotify.com/v1/search", {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: {
          q: query,
          type: "track",
          limit: 20,
        },
      });

      const tracks = response.data.tracks.items.map((track) => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        albumArt: track.album.images[0]?.url,
        previewUrl: track.preview_url,
        uri: track.uri,
        duration_ms: track.duration_ms,

        popularity: track.popularity,
        explicit: track.explicit,
      }));

      return res.json({ tracks });
    } catch (error) {
      console.error("Error searching tracks:", error);
      return res.status(500).json({ error: "Failed to search tracks" });
    }
  },
};

module.exports = spotifyController;
