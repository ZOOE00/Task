"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {jwtDecode} from "jwt-decode";

interface DecodedToken {
  user_id: number;
}

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

      const token = data.token;

      if (!token) {
        setError("Token ирсэнгүй. Серверийг шалгана уу.");
        setLoading(false);
        return;
      }

      localStorage.setItem("authToken", token);

      const decoded = jwtDecode<DecodedToken>(token);

      if (!decoded.user_id) {
        setError("Token-д хэрэглэгчийн ID байхгүй байна.");
        setLoading(false);
        return;
      }

      const usersResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/list`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const users = usersResponse.data;

      const currentUser = users.find((u: any) => u.id === decoded.user_id);

      if (!currentUser || !currentUser.role) {
        setError("Хэрэглэгчийн мэдээлэл эсвэл эрх олдсонгүй.");
        setLoading(false);
        return;
      }

      const roleNum = Number(currentUser.role);
      localStorage.setItem("role", String(roleNum));

      if (roleNum === 1) {
        router.push("/admin");
      } else if (roleNum === 2) {
        router.push("/hheg");
      } else if (roleNum === 3) {
        router.push("/user");
      } else {
        setError("Тодорхойгүй хэрэглэгчийн эрх.");
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
          {loading ? "Нэвтэрч байна..." : "Нэвтрэх"}
        </Button>
      </form>
    </Container>
  );
}
