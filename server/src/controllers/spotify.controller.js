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

  getRecentlyPlayed: async (req, res) => {
    try {
      const accessToken = req.user.access_token;

      const response = await axios.get(
        "https://api.spotify.com/v1/me/player/recently-played",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          params: {
            limit: 20,
          },
        }
      );

      const tracks = response.data.items.map((item) => ({
        id: item.track.id,
        name: item.track.name,
        artist: item.track.artists[0].name,
        albumArt: item.track.album.images[0]?.url,
        played_at: item.played_at,
        duration_ms: item.track.duration_ms,
      }));

      return res.json({ tracks });
    } catch (error) {
      console.error(
        "Error in getRecentlyPlayed:",
        error.response?.data || error.message
      );
      return res.status(500).json({
        error: "Failed to fetch recently played tracks",
        details: error.response?.data || error.message,
      });
    }
  },

  getTopArtists: async (req, res) => {
    try {
      const accessToken = req.user.access_token;

      const response = await axios.get(
        "https://api.spotify.com/v1/me/top/artists",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          params: {
            limit: 20,
            time_range: "medium_term",
          },
        }
      );

      const artists = response.data.items.map((artist) => ({
        id: artist.id,
        name: artist.name,
        genres: artist.genres,
        images: artist.images,
        popularity: artist.popularity,
      }));

      return res.json({ artists });
    } catch (error) {
      console.error(
        "Error in getTopArtists:",
        error.response?.data || error.message
      );
      return res.status(500).json({
        error: "Failed to fetch top artists",
        details: error.response?.data || error.message,
      });
    }
  },

  getTopGenres: async (req, res) => {
    try {
      const accessToken = req.user.access_token;

      const response = await axios.get(
        "https://api.spotify.com/v1/me/top/artists",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          params: {
            limit: 50,
            time_range: "medium_term",
          },
        }
      );

      // Extract and count genres
      const genreCounts = response.data.items.reduce((acc, artist) => {
        artist.genres.forEach((genre) => {
          acc[genre] = (acc[genre] || 0) + 1;
        });
        return acc;
      }, {});

      // Sort genres by count
      const sortedGenres = Object.entries(genreCounts)
        .sort(([, a], [, b]) => b - a)
        .map(([genre]) => genre);

      return res.json({ genres: sortedGenres });
    } catch (error) {
      console.error(
        "Error in getTopGenres:",
        error.response?.data || error.message
      );
      return res.status(500).json({
        error: "Failed to fetch top genres",
        details: error.response?.data || error.message,
      });
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

  getRecommendations: async (req, res) => {
    const { trackId } = req.params;

    try {
      const accessToken = req.user.access_token;

      // Step 1: Get track info and associated genres
      const trackResponse = await axios.get(
        `https://api.spotify.com/v1/tracks/${trackId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const artistId = trackResponse.data.artists[0].id;
      const artistResponse = await axios.get(
        `https://api.spotify.com/v1/artists/${artistId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const genres = artistResponse.data.genres;
      if (genres.length === 0) {
        return res
          .status(404)
          .json({ message: "No genres found for the track." });
      }

      // Step 2: Search for tracks using the first genre
      const genre = genres[0];
      const searchResponse = await axios.get(
        "https://api.spotify.com/v1/search",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: { q: `genre:"${genre}"`, type: "track", limit: 20 },
        }
      );

      const recommendedTracks = searchResponse.data.tracks.items.map(
        (track) => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          albumArt: track.album.images[0]?.url,
          previewUrl: track.preview_url,
          uri: track.uri,
        })
      );

      return res.status(200).json({
        message: `Recommendations based on the genre: ${genre}`,
        tracks: recommendedTracks,
      });
    } catch (error) {
      console.error(
        "Error in getRecommendations:",
        error.response?.data || error.message
      );
      res.status(500).json({
        error: "Failed to fetch recommendations",
        details: error.response?.data || error.message,
      });
    }
  },
};

module.exports = spotifyController;
