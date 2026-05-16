"use client";

import React from "react";
import { ToggleButtonGroup, ToggleButton, Box, Typography } from "@mui/material";

interface Props {
  current: string;
  onSelect: (val: string) => void;
}

export default function FilterBar({ current, onSelect }: Props) {
  return (
    <Box mb={3} display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
      <Typography variant="body2" color="text.secondary" fontWeight={600}>
        Sort and Filter Pipeline Matrix:
      </Typography>
      <ToggleButtonGroup
        value={current}
        exclusive
        onChange={(_, val) => val && onSelect(val)}
        size="small"
        color="primary"
      >
        <ToggleButton value="all">Everything</ToggleButton>
        {/* Value tokens must match backend API data fields exactly */}
        <ToggleButton value="Placement">Corporate Placements</ToggleButton>
        <ToggleButton value="Result">Academic Results</ToggleButton>
        <ToggleButton value="Event">Campus Events</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}