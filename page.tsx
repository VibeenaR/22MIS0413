"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Container, Stack, CircularProgress, Typography, Box, TextField, Alert } from "@mui/material";
// Paths updated to clear out of the single-depth app/ folder level cleanly
import { downloadNotificationPayload } from "../services/notificationService";
import { getReadHistoryIds, saveToReadHistory } from "../utils/viewedTracker";
import { CampusNotice } from "../types/notification";
import FilterBar from "../components/FilterBar";
import NotificationCard from "../components/NotificationCard";
import { emitClientLog } from "../logger/clientLogger";

export default function Dashboard() {
  const [list, setList] = useState<CampusNotice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>("all");
  const [history, setHistory] = useState<string[]>([]);
  const [tokenInput, setTokenInput] = useState<string>("");

  const refreshFeedData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await downloadNotificationPayload();
      setList(data);
    } catch (err) {
      console.error("Dashboard connection error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const activeToken = localStorage.getItem("auth_token") || "";
      setTokenInput(activeToken);
    }
    setHistory(getReadHistoryIds());
    refreshFeedData();
    emitClientLog("info", "page", "Main dashboard initialized successfully.");
  }, [refreshFeedData]);

  const handleTokenSave = (val: string) => {
    setTokenInput(val);
    localStorage.setItem("auth_token", val);
    refreshFeedData();
  };

  const handleReadClick = (uid: string) => {
    const updated = saveToReadHistory(uid);
    setHistory(updated);
  };

  const processedList = list.filter(item => {
    if (filter === "all") return true;
    return item.Type.toLowerCase() === filter.toLowerCase();
  });

  return (
    <Container maxWidth="md" sx={{ pb: 6 }}>
      {/* Authorization Token Entry Box */}
      <Box mb={4} p={2.5} sx={{ backgroundColor: "#fff", borderRadius: 3, border: "1px solid #eef0f3" }}>
        <Typography variant="subtitle2" color="text.secondary" mb={1.5} fontWeight="bold">
          Authorization Token (JWT Key Manager):
        </Typography>
        <TextField
          fullWidth
          size="small"
          label="Paste Live Access Token String Here"
          value={tokenInput}
          onChange={(e) => handleTokenSave(e.target.value)}
          placeholder="eyJhbGciOi..."
        />
      </Box>

      <FilterBar current={filter} onSelect={setFilter} />
      
      {loading ? (
        <Box display="flex" justifyContent="center" my={6}><CircularProgress /></Box>
      ) : (
        <Stack gap={1.5}>
          {processedList.map(item => (
            <NotificationCard 
              key={item.ID} 
              data={item} 
              isRead={history.includes(item.ID)} 
              onView={() => handleReadClick(item.ID)} 
            />
          ))}
          {processedList.length === 0 && (
            <Typography color="text.secondary" align="center" my={6}>
              No notifications matching your parameters found. Please verify your Access Token string.
            </Typography>
          )}
        </Stack>
      )}
    </Container>
  );
}