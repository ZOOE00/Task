"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Container,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Menu,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  position: string;
  rank: string;
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  role: "Админ" | "ХХЕГ" | "Хэрэглэгч";
}

export default function AdminPage() {
  const router = useRouter();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => {
    setAnchorEl(null);
    router.push("/");
  };

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
  });

  const [users, setUsers] = useState<User[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState<Omit<User, 'id'>>({
    position: "",
    rank: "",
    username: "",
    password: "",
    firstname: "",
    lastname: "",
    role: "Хэрэглэгч",
  });

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get<User[]>("/users/list");
        setUsers(data);
      } catch (err: any) {
        if (err.response?.status === 401) {
          router.push("/");
        } else {
          console.error(err);
        }
      }
    })();
  }, [router]);

  const handleAddUser = async () => {
    try {
      await api.post("/users/create", newUser);
      const { data } = await api.get<User[]>("/users/list");
      setUsers(data);
      setDialogOpen(false);
      setNewUser({ position: "", rank: "", username: "", password: "", firstname: "", lastname: "", role: "Хэрэглэгч" });
    } catch (err: any) {
      if (err.response?.status === 401) {
        router.push("/");
      } else {
        console.error(err);
      }
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Админ
          </Typography>
          <IconButton color="inherit" onClick={handleMenuOpen}>
            <AccountCircle />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={handleLogout}>Гарах</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Button variant="contained" onClick={() => setDialogOpen(true)} sx={{ mb: 2 }}>
          Хэрэглэгч нэмэх
        </Button>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Албан тушаал</TableCell>
                <TableCell>Цол</TableCell>
                <TableCell>Нэвтрэх нэр</TableCell>
                <TableCell>Нууц үг</TableCell>
                <TableCell>Нэр</TableCell>
                <TableCell>Овог</TableCell>
                <TableCell>Хэрэглэгчийн эрх</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id} hover>
                  <TableCell>{u.id}</TableCell>
                  <TableCell>{u.position}</TableCell>
                  <TableCell>{u.rank}</TableCell>
                  <TableCell>{u.username}</TableCell>
                  <TableCell>{u.password}</TableCell>
                  <TableCell>{u.firstname}</TableCell>
                  <TableCell>{u.lastname}</TableCell>
                  <TableCell>{u.role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Шинэ хэрэглэгч нэмэх</DialogTitle>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Албан тушаал"
              value={newUser.position}
              onChange={(e) => setNewUser((v) => ({ ...v, position: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Цол"
              value={newUser.rank}
              onChange={(e) => setNewUser((v) => ({ ...v, rank: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Нэвтрэх нэр"
              value={newUser.username}
              onChange={(e) => setNewUser((v) => ({ ...v, username: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Нууц үг"
              type="Нууц үг"
              value={newUser.password}
              onChange={(e) => setNewUser((v) => ({ ...v, password: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Нэр"
              value={newUser.firstname}
              onChange={(e) => setNewUser((v) => ({ ...v, firstname: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Овог"
              value={newUser.lastname}
              onChange={(e) => setNewUser((v) => ({ ...v, lastname: e.target.value }))}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel id="role-select-label">Role</InputLabel>
              <Select
                labelId="role-select-label"
                label="Хэрэглэгчийн эрх"
                value={newUser.role}
                onChange={(e) => setNewUser((v) => ({ ...v, role: e.target.value as User['role'] }))}
              >
                <MenuItem value="Админ">Админ</MenuItem>
                <MenuItem value="ХХЕГ">ХХЕГ</MenuItem>
                <MenuItem value="Хэрэглэгч">Хэрэглэгч</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Цуцлах</Button>
            <Button variant="contained" onClick={handleAddUser}>
              Хадгалах
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}