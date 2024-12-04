import {
  Box,
  Typography
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";
import CommentAnalysis from "./components/CommentAnalysis";
import { ProgressBars } from "./components/ProgressBar";
import { SearchInput } from "./components/SearchInput";
import {
  IEvaluatedComment,
  evaluate_channel,
} from "./services/evaluate_channel";

function App() {
  const [comments, setComments] = useState<IEvaluatedComment[]>([]);
  const [fetchProgress, setFetchProgress] = useState(0);
  const [analyzeProgress, setAnalyzeProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const channelName = useRef<HTMLInputElement>(null);
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:5000");

    socketRef.current.on("progress", (data) => {
      const progress = parseFloat(data.data);
      if (data.step === "fetching_comments") {
        setFetchProgress(progress);
      } else if (data.step === "analyzing_sentiment") {
        setAnalyzeProgress(progress);
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const handleClick = async () => {
    setComments([]);
    if (!channelName.current?.value) {
      alert("Please enter a channel name");
      return;
    }
    setIsLoading(true);
    setFetchProgress(0);
    setAnalyzeProgress(0);
    const response_comments = await evaluate_channel(channelName.current.value);
    setComments(response_comments);
    setIsLoading(false);
  };

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        padding: "10% 10%",
      }}
    >
      <Box
        sx={{ display: "flex", justifyContent: "center", flexDirection: "row" }}
      >
        <Grid container rowSpacing={1} columnSpacing={1}>
          <Grid size={12}>
            <Typography variant="h4">Evaluate a Youtube channel</Typography>
          </Grid>
          <SearchInput inputRef={channelName} onSearch={handleClick} />
          {isLoading && (
            <ProgressBars
              fetchProgress={fetchProgress}
              analyzeProgress={analyzeProgress}
            />
          )}
          {comments.length > 0 && <CommentAnalysis comments={comments} />}
        </Grid>
      </Box>
    </Box>
  );
}

export default App;
