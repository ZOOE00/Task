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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Demo logic: just redirect based on a dummy check
    if (email === "admin@example.com" && password === "admin") {
      router.push("/admin");
    } else if (email && password) {
      router.push("/user");
    } else {
      setError("Invalid credentials");
    }
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
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
