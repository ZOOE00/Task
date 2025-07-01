"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
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

    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/login/auth`,
        { username, password }
      );

      if (data.token) {
        localStorage.setItem("authToken", data.token);

        const role = data.role || "Хэрэглэгч";
        localStorage.setItem("role", role);

        if (role === "admin") router.push("/admin");
        else if (role === "ХХЕГ") router.push("/ххег");
        else router.push("/user");
      } else {
        setError("Token ирсэнгүй. Серверийг шалгана уу.");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Сервертэй холбогдоход алдаа гарлаа"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{ mt: 8, display: "flex", flexDirection: "column", gap: 2 }}
    >
      <Typography variant="h5" align="center">
        Нэвтрэх хэсэг
      </Typography>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 16 }}
      >
        <TextField
          label="Нэвтрэх нэр"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          disabled={loading}
        />
        <TextField
          label="Нууц үг"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? "Signing in..." : "Нэвтрэх"}
        </Button>
      </form>
    </Container>
  );
}