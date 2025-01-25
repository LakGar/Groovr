import {
  Box,
  Typography,
  IconButton,
  ListItem,
  Tooltip,
  Button,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import DragIndicatorRoundedIcon from "@mui/icons-material/DragIndicatorRounded";
import PlaylistAddRoundedIcon from "@mui/icons-material/PlaylistAddRounded";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { createPlaylist } from "../../services/spotifyApi";

const SelectedTracksPanel = ({
  tracks = [],
  onTrackRemove,
  onTracksReorder,
}) => {
  return (
    <Box
      sx={{
        height: "100%",
        background: alpha("#fff", 0.03),
        backdropFilter: "blur(10px)",
        borderRadius: 3,
        p: 3,
        border: `1px solid ${alpha("#fff", 0.1)}`,
        display: "flex",
        flexDirection: "column",
        mt: 4,
        overflowY: "auto",
        overflowX: "hidden",
        minWidth: "300px",
        "&::-Webkit-scrollbar": {
          display: "none",
        },
        msOverflowStyle: "none",
        scrollbarWidth: "none",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography
            variant="h6"
            sx={{
              color: "#fff",
              fontWeight: 600,
            }}
          >
            Selected Tracks
          </Typography>
          <Typography
            sx={{
              color: alpha("#fff", 0.7),
              fontSize: "0.875rem",
            }}
          >
            {tracks.length} tracks
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<PlaylistAddRoundedIcon />}
          disabled={tracks.length === 0}
          onClick={() => onCreatePlaylist(tracks)}
          sx={{
            background: "#6366F1",
            "&:hover": {
              background: "#4F46E5",
            },
            "&.Mui-disabled": {
              background: alpha("#6366F1", 0.3),
              color: alpha("#fff", 0.5),
            },
          }}
        >
          Create Playlist
        </Button>
      </Box>

      {tracks.length === 0 ? (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography sx={{ color: alpha("#fff", 0.5) }}>
            Swipe right on tracks you like to add them to your playlist
          </Typography>
        </Box>
      ) : (
        <Reorder.Group
          as="ul"
          axis="y"
          values={tracks}
          onReorder={onTracksReorder}
          style={{
            flex: 1,
            overflowY: "scroll",
            paddingRight: "8px",
            listStyle: "none",
            margin: 0,
            padding: 0,
            overflowX: "hidden",
            "&::-webkit-scrollbar": {
              display: "none",
            },
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          <AnimatePresence>
            {tracks.map((track) => (
              <Reorder.Item
                key={track.id}
                value={track}
                as="li"
                whileDrag={{
                  scale: 1.05,
                  boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
                }}
                style={{
                  listStyle: "none",
                  margin: "0 0 8px 0",
                  padding: 0,
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  layout
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      p: 1,
                      borderRadius: 2,
                      background: alpha("#fff", 0.03),
                      border: `1px solid ${alpha("#fff", 0.05)}`,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        background: alpha("#fff", 0.05),
                        transform: "translateX(4px)",
                        "& .track-actions": {
                          opacity: 1,
                        },
                      },
                    }}
                  >
                    <DragIndicatorRoundedIcon
                      sx={{
                        color: alpha("#fff", 0.3),
                        cursor: "grab",
                        "&:active": { cursor: "grabbing" },
                      }}
                    />

                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 1,
                        overflow: "hidden",
                        flexShrink: 0,
                        position: "relative",
                        "&:hover .play-overlay": {
                          opacity: 1,
                        },
                      }}
                    >
                      <img
                        src={track.albumArt}
                        alt={track.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <Box
                        className="play-overlay"
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: alpha("#000", 0.5),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          opacity: 0,
                          transition: "opacity 0.2s ease",
                          cursor: "pointer",
                        }}
                      >
                        <PlayArrowRoundedIcon
                          sx={{ color: "#fff", fontSize: 20 }}
                        />
                      </Box>
                    </Box>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        noWrap
                        sx={{
                          color: "#fff",
                          fontWeight: 500,
                        }}
                      >
                        {track.name}
                      </Typography>
                      <Typography
                        noWrap
                        sx={{
                          color: alpha("#fff", 0.7),
                          fontSize: "0.875rem",
                        }}
                      >
                        {track.artist}
                      </Typography>
                    </Box>

                    <Box
                      className="track-actions"
                      sx={{
                        opacity: 0,
                        transition: "opacity 0.2s ease",
                      }}
                    >
                      <Tooltip title="Remove track">
                        <IconButton
                          size="small"
                          onClick={() => onTrackRemove(track.id)}
                          sx={{
                            color: alpha("#fff", 0.7),
                            "&:hover": {
                              color: "#ef4444",
                              background: alpha("#ef4444", 0.1),
                            },
                          }}
                        >
                          <DeleteRoundedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </motion.div>
              </Reorder.Item>
            ))}
          </AnimatePresence>
        </Reorder.Group>
      )}
    </Box>
  );
};

const onCreatePlaylist = async (tracks) => {
  try {
    const trackUris = tracks.map((track) => track.uri);
    const playlistName = "My Groovr Playlist"; // You could make this configurable
    const response = await createPlaylist(playlistName, trackUris);
    // You might want to show a success message or redirect to the playlist
    console.log("Playlist created:", response);
  } catch (error) {
    console.error("Error creating playlist:", error);
    // Handle error (show error message to user)
  }
};

export default SelectedTracksPanel;
