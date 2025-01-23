import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { getUserProfile } from "../services/spotifyApi";
import Header from "../components/Header";

function Discover() {
  const { isAuthenticated } = useAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userData = await getUserProfile();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    if (isAuthenticated) {
      fetchUserProfile();
    }
  }, [isAuthenticated]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(145deg, #0A0A0A 0%, #1A1A1A 100%)",
        color: "white",
      }}
    >
      <Header user={user} />
    </Box>
  );
}

export default Discover;
