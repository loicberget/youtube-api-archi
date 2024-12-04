import { Box, Link, Pagination, Typography } from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import DOMPurify from "dompurify";
import he from "he";
import { useState } from "react";
import { IEvaluatedComment } from "../services/evaluate_channel";

interface ICommentListProps {
  comments: IEvaluatedComment[];
}

const CommentList = ({ comments }: ICommentListProps) => {
  const [page, setPage] = useState(1);
  const commentsPerPage = 100;

  const processCommentText = (text: string) => {
    const decodedText = he.decode(text);
    return DOMPurify.sanitize(decodedText, {
      ALLOWED_TAGS: ["a"],
      ALLOWED_ATTR: ["href", "target", "rel"],
    });
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "#d4edda";
      case "negative":
        return "#f8d7da";
      case "neutral":
        return "#fff3cd";
      default:
        return "#ffffff";
    }
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const startIndex = (page - 1) * commentsPerPage;
  const paginatedComments = comments.slice(
    startIndex,
    startIndex + commentsPerPage
  );
  const pageCount = Math.ceil(comments.length / commentsPerPage);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "70vh" }}>
      <Box sx={{ flex: 1, overflowY: "auto", padding: 2 }}>
        {paginatedComments.map((comment) => (
          <Box
            key={comment.id}
            sx={{
              marginBottom: 2,
              padding: 2,
              border: "1px solid #ccc",
              borderRadius: "8px",
              backgroundColor: getSentimentColor(comment.sentiment.label),
            }}
          >
            <Link
              href={`https://www.youtube.com/${comment.author}`}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: "inherit",
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              <Typography variant="h6">{comment.author}</Typography>
            </Link>
            <Typography variant="body2" color="textSecondary">
              {formatDistanceToNow(new Date(comment.publishedAt))} ago
            </Typography>
            <Typography
              dangerouslySetInnerHTML={{
                __html: processCommentText(comment.text),
              }}
              variant="body1"
              sx={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}
            />
          </Box>
        ))}
      </Box>
      <Box sx={{ padding: 2, display: "flex", justifyContent: "center" }}>
        <Pagination
          count={pageCount}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default CommentList;
