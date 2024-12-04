import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";

interface ProgressBarsProps {
  fetchProgress: number;
  analyzeProgress: number;
}

export const ProgressBars: React.FC<ProgressBarsProps> = ({
  fetchProgress,
  analyzeProgress,
}) => (
  <Grid size={12}>
    <Box sx={{ width: "50%", margin: "0 auto", mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid size={12}>
          <Typography align="center">Fetching comments...</Typography>
          <LinearProgress
            variant="determinate"
            value={fetchProgress}
            sx={{ height: 10, borderRadius: 5, mt: 1, mb: 1 }}
          />
          <Typography variant="body2" color="text.secondary" align="center">
            {Math.round(fetchProgress)}%
          </Typography>
        </Grid>
        <Grid size={12}>
          <Typography align="center">Analyzing sentiment...</Typography>
          <LinearProgress
            variant="determinate"
            value={analyzeProgress}
            sx={{ height: 10, borderRadius: 5, mt: 1, mb: 1 }}
          />
          <Typography variant="body2" color="text.secondary" align="center">
            {Math.round(analyzeProgress)}%
          </Typography>
        </Grid>
      </Grid>
    </Box>
  </Grid>
);
