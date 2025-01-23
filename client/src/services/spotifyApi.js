import axios from "axios";

const API_URL = "http://localhost:5001";

const spotifyApi = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for handling cookies/sessions
});

export const loginWithSpotify = async () => {
  try {
    const response = await spotifyApi.get("/api/auth/login");
    window.location.href = response.data.url;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const handleCallback = async (code) => {
  try {
    const response = await spotifyApi.get("/api/auth/callback", {
      params: { code },
    });
    return response.data.access_token;
  } catch (error) {
    console.error("Callback error:", error);
    throw error;
  }
};

export const refreshToken = async () => {
  try {
    const response = await spotifyApi.post("/api/auth/refresh");
    return response.data.access_token;
  } catch (error) {
    console.error("Token refresh error:", error);
    throw error;
  }
};

// Add interceptor to handle token expiration
spotifyApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const newToken = await refreshToken();
        error.config.headers["Authorization"] = `Bearer ${newToken}`;
        return spotifyApi(error.config);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const getUserTopGenres = async () => {
  try {
    const response = await spotifyApi.get("/api/user/top-genres");
    return response.data;
  } catch (error) {
    console.error("Error fetching top genres:", error);
    throw error;
  }
};

export const getRecentlyPlayed = async () => {
  try {
    const response = await spotifyApi.get("/api/user/recently-played");
    return response.data;
  } catch (error) {
    console.error("Error fetching recently played:", error);
    throw error;
  }
};

export const searchTracks = async (query) => {
  try {
    const response = await spotifyApi.get(
      `/api/search?q=${encodeURIComponent(query)}`
    );
    return response.data;
  } catch (error) {
    console.error("Error searching tracks:", error);
    throw error;
  }
};

export const getRecommendations = async (previewUrl) => {
  const response = await spotifyApi.post("/api/recommendations", {
    previewUrl,
  });
  return response.data;
};

export const createPlaylist = async (name, trackUris) => {
  const response = await spotifyApi.post("/api/playlist", { name, trackUris });
  return response.data;
};

export const getUserProfile = async () => {
  try {
    const response = await spotifyApi.get("/api/user/profile");
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export default spotifyApi;
