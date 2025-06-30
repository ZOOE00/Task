// File: src/app/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  // Simulate API delay
  await new Promise((res) => setTimeout(res, 500));

  if (username === "admin" && password === "admin") {
    router.push("/admin");
  } else if (username === "bob@example.com" && password === "user") {
    router.push("/user");
  } else {
  }

  setLoading(false);
};

  return (
    <Container
      maxWidth="xs"
      sx={{ mt: 8, display: "flex", flexDirection: "column", gap: 2 }}
    >
      <Typography variant="h5" component="h1" align="center">
        Login
      </Typography>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 16 }}
      >
        <TextField
          label="Username"
          type="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}

        <Button type="submit" variant="contained">
          Sign In
        </Button>
      </form>
    </Container>
  );
}
