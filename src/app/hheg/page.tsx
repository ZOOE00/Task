// File: src/app/kheg/page.tsx
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
  firstname: string;
  lastname: string;
  // whatever other fields come back, e.g. role…
}

interface TaskForm {
  title: string;
  description: string;
  userId: number;
  startDate: string;
  endDate: string;
}

export default function KHEGPage() {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  // --- users & tasks state ---
  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState<TaskForm>({
    title: "",
    description: "",
    userId: 0,
    startDate: "",
    endDate: "",
  });

  // --- fetch users by role from your API ---
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/users/list-role`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUsers(res.data);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };
    fetchUsers();
  }, []);

  // --- add task locally (or POST to your backend) ---
  const handleAddTask = () => {
    const id = tasks.length ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
    setTasks([
      ...tasks,
      { id, ...newTask },
    ]);
    setDialogOpen(false);
    setNewTask({ title: "", description: "", userId: 0, startDate: "", endDate: "" });
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            ХХЕГ — Үүрэг өгөх
          </Typography>
          <IconButton color="inherit" onClick={handleMenuOpen}>
            <AccountCircle />
          </IconButton>
          <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleMenuClose}>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Button variant="contained" onClick={() => setDialogOpen(true)} sx={{ mb: 2 }}>
          Үүрэг нэмэх
        </Button>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Гарчиг</TableCell>
                <TableCell>Тайлбар</TableCell>
                <TableCell>Ажилтан</TableCell>
                <TableCell>Эхлэх огноо</TableCell>
                <TableCell>Дуусах огноо</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map((t) => {
                const user = users.find((u) => u.id === t.userId);
                return (
                  <TableRow key={t.id}>
                    <TableCell>{t.id}</TableCell>
                    <TableCell>{t.title}</TableCell>
                    <TableCell>{t.description}</TableCell>
                    <TableCell>
                      {user ? `${user.firstname} ${user.lastname}` : "Unknown"}
                    </TableCell>
                    <TableCell>{t.startDate}</TableCell>
                    <TableCell>{t.endDate}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle>Үүрэг нэмэх</DialogTitle>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Гарчиг"
              value={newTask.title}
              onChange={(e) => setNewTask((v) => ({ ...v, title: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Тайлбар"
              value={newTask.description}
              onChange={(e) => setNewTask((v) => ({ ...v, description: e.target.value }))}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel id="user-select-label">Албан тушаалтан</InputLabel>
              <Select
                labelId="user-select-label"
                value={newTask.userId}
                label="Албан тушаалтан"
                onChange={(e) =>
                  setNewTask((v) => ({ ...v, userId: Number(e.target.value) }))
                }
                inputProps={{ name: "userId" }}
              >
                <MenuItem value={0} disabled>
                  Сонгох
                </MenuItem>
                {users.map((u) => (
                  <MenuItem key={u.id} value={u.id}>
                    {u.firstname} {u.lastname}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Эхлэх огноо"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={newTask.startDate}
              onChange={(e) => setNewTask((v) => ({ ...v, startDate: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Дуусах огноо"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={newTask.endDate}
              onChange={(e) => setNewTask((v) => ({ ...v, endDate: e.target.value }))}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Цуцлах</Button>
            <Button variant="contained" onClick={handleAddTask}>
              Хадгалах
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}
