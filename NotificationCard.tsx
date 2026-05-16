"use client";

import React from "react";
import { Card, CardContent, Typography, Box, Chip } from "@mui/material";
import { CampusNotice } from "../types/notification";
import FiberNewIcon from '@mui/icons-material/FiberNew';

interface Props {
  data: CampusNotice;
  isRead: boolean;
  rankIndex?: number;
  onView: () => void;
}

export default function NotificationCard({ data, isRead, rankIndex, onView }: Props) {
  const isPlacement = data.Type === "Placement";
  const isResult = data.Type === "Result";

  return (
    <Card 
      onClick={onView}
      variant="outlined"
      sx={{ 
        cursor: "pointer",
        transition: "0.2s",
        borderRadius: 2,
        borderLeft: rankIndex ? "6px solid #d32f2f" : isRead ? "4px solid #b2bec3" : "4px solid #0984e3",
        backgroundColor: isRead ? "#fafafa" : "#ffffff",
        "&:hover": { boxShadow: 2, transform: "translateY(-1px)" }
      }}
    >
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Box display="flex" alignItems="center" gap={1}>
            {rankIndex && <Chip label={`Rank ${rankIndex}`} size="small" color="error" sx={{ fontWeight: 'bold' }} />}
            <Chip 
              label={data.Type} 
              size="small" 
              color={isPlacement ? "success" : isResult ? "info" : "default"} 
            />
            {!isRead && <FiberNewIcon color="primary" />}
          </Box>
          <Typography variant="caption" color="text.secondary">{data.Timestamp}</Typography>
        </Box>
        <Typography variant="body1" sx={{ fontWeight: isRead ? 400 : 700 }} color="text.primary">
          {data.Message}
        </Typography>
      </CardContent>
    </Card>
  );
}