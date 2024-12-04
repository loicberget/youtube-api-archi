import React, { useRef, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { IEvaluatedComment } from "../services/evaluate_channel";
import { Box, Typography } from "@mui/material";
import CommentList from "./CommentList";

interface CommentAnalysisProps {
  comments: IEvaluatedComment[];
}

const CommentAnalysis: React.FC<CommentAnalysisProps> = ({ comments }) => {
  const neutralComments = comments.filter(
    (comment) => comment.sentiment.label === "neutral"
  );
  const positiveComments = comments.filter(
    (comment) => comment.sentiment.label === "positive"
  );
  const negativeComments = comments.filter(
    (comment) => comment.sentiment.label === "negative"
  );

  const sortedComments = [positiveComments, negativeComments, neutralComments];

  const handlePieClick = (index: number) => {
    renderedCommentsIndex.current = index;
    setRenderedComments(sortedComments[index]);
  };

  const [renderedComments, setRenderedComments] =
    useState<IEvaluatedComment[]>(positiveComments);

  const renderedCommentsIndex = useRef(0);

  const data = [
    { name: "Positive", value: positiveComments.length },
    { name: "Negative", value: negativeComments.length },
    { name: "Neutral", value: neutralComments.length },
  ];

  const COLORS = ["#d4edda", "#f8d7da", "#fff3cd"];

  const renderBlackLegendText = (value: string, entry: any) => {
    return <span style={{ color: "#000000" }}>{value}</span>;
  };

  return (
    <Box display={"flex"}>
      <PieChart width={400} height={400}>
        <Pie
          data={data}
          labelLine={false}
          outerRadius={150}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
              onClick={() => handlePieClick(index)}
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend formatter={renderBlackLegendText} />
      </PieChart>
      <Box width={"50%"}>
        <Typography>
          {renderedCommentsIndex.current == 0
            ? "Positive comments"
            : renderedCommentsIndex.current == 1
            ? "Negative comments"
            : "Neutral comments"}
        </Typography>
        <CommentList comments={renderedComments} />
      </Box>
    </Box>
  );
};

export default CommentAnalysis;
