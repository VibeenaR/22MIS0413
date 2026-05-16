"use client";

import React from "react";
import { AppBar, Toolbar, Typography, Button, Container, Stack } from "@mui/material";
import Link from "next/link";
import LayersIcon from '@mui/icons-material/Layers';

export default function Navbar() {
  return (
    <AppBar position="sticky" color="default" elevation={1} sx={{ bg: "#fff", mb: 4 }}>
      <Container maxWidth="md">
        <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
          <Stack direction="row" alignItems="center" gap={1}>
            <LayersIcon color="primary" />
            <Typography variant="h6" fontWeight="bold" color="text.primary">
              Campus Connect
            </Typography>
          </Stack>
          <Stack direction="row" gap={2}>
            <Link href="/" passHref style={{ textDecoration: 'none' }}><Button color="inherit">Dashboard</Button></Link>
            <Link href="/priority-inbox" passHref style={{ textDecoration: 'none' }}><Button variant="contained" color="error">Priority Hub</Button></Link>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}