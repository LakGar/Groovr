import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Discover from "./pages/Discover";
import Profile from "./pages/Profile";
import AuthCallback from "./pages/AuthCallback";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1DB954", // Spotify green
    },
    secondary: {
      main: "#191414", // Spotify black
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/callback" element={<AuthCallback />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
