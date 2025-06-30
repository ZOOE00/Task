"use client";
import React, { useState } from "react";
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
  Box,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";

export default function AdminPage() {
  const [users, setUsers] = useState([
    { id: 1, name: "Alice", email: "alice@example.com", role: "admin" },
    { id: 2, name: "Bob", email: "bob@example.com", role: "user" },
  ]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "", position: "", rank: "" });

  const [tasks, setTasks] = useState([{ id: 1, title: "Review Budget", userId: 1 }]);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", userId: "" });

  const [currentTab, setCurrentTab] = useState<"users" | "tasks">("users");

  const handleOpen = () => setDialogOpen(true);
  const handleClose = () => {
    setDialogOpen(false);
    setNewUser({ name: "", email: "", role: "user", position: "", rank: "" });
  };
  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setNewUser((prev) => ({ ...prev, [field]: e.target.value }));
  const handleAdd = () => {
    const nextId = users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1;
    setUsers((prev) => [...prev, { id: nextId, ...newUser }]);
    handleClose();
  };

  const handleTaskOpen = () => setTaskDialogOpen(true);
  const handleTaskClose = () => {
    setTaskDialogOpen(false);
    setNewTask({ title: "", userId: "" });
  };
  const handleTaskChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setNewTask((prev) => ({ ...prev, [field]: e.target.value }));
  const handleTaskAdd = () => {
    const nextId = tasks.length ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
    setTasks((prev) => [...prev, { id: nextId, ...newTask, userId: Number(newTask.userId) }]);
    handleTaskClose();
  };

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: "#1A237E" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, color: "white" }}>
            Admin Dashboard
          </Typography>
          <IconButton color="inherit">
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
          <Button
            variant={currentTab === "users" ? "contained" : "outlined"}
            onClick={() => setCurrentTab("users")}
            color="primary"
          >
            Хэрэглэгчийн жагсаалт
          </Button>
          <Button
            variant={currentTab === "tasks" ? "contained" : "outlined"}
            onClick={() => setCurrentTab("tasks")}
            color="secondary"
          >
            Даалгаврууд
          </Button>
        </Box>

        {currentTab === "users" && (
          <>
            <Button variant="contained" onClick={handleOpen} sx={{ mb: 2 }}>
              Хэрэглэгч бүртгэх
            </Button>

            <TableContainer component={Paper} elevation={3}>
              <Table>
                <TableHead sx={{ backgroundColor: "#E8EAF6" }}>
                  <TableRow>
                    <TableCell>Д/д</TableCell>
                    <TableCell>Албан тушаал</TableCell>
                    <TableCell>Цол</TableCell>
                    <TableCell>Овог, Нэр</TableCell>
                    <TableCell>Хэрэглэгчийн эрх</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id} hover>
                      <TableCell>{u.id}</TableCell>
                      <TableCell>{u.position}</TableCell>
                      <TableCell>{u.rank}</TableCell>
                      <TableCell>{u.name}</TableCell>
                      <TableCell>{u.role}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Dialog open={dialogOpen} onClose={handleClose} fullWidth maxWidth="sm">
              <DialogTitle>Хэрэглэгч бүртгэх</DialogTitle>
              <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField label="Албан тушаал" value={newUser.position} onChange={handleChange("position")} fullWidth />
                <TextField label="Цол" value={newUser.rank} onChange={handleChange("rank")} fullWidth />
                <TextField label="Овог, нэр" value={newUser.name} onChange={handleChange("name")} fullWidth />
                <TextField label="Хэрэглэгчийн эрх" value={newUser.role} onChange={handleChange("role")} fullWidth />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Болих</Button>
                <Button variant="contained" onClick={handleAdd} color="primary">
                  Хадгалах
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}

        {currentTab === "tasks" && (
          <>
            <Button variant="contained" onClick={handleTaskOpen} sx={{ mb: 2 }}>
              Үүрэг өгөх
            </Button>

            <TableContainer component={Paper} elevation={3}>
              <Table>
                <TableHead sx={{ backgroundColor: "#FFF8E1" }}>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Гарчиг</TableCell>
                    <TableCell>Хариуцагч</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tasks.map((task) => {
                    const user = users.find((u) => u.id === task.userId);
                    return (
                      <TableRow key={task.id} hover>
                        <TableCell>{task.id}</TableCell>
                        <TableCell>{task.title}</TableCell>
                        <TableCell>{user ? user.name : "Тодорхойгүй"}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            <Dialog open={taskDialogOpen} onClose={handleTaskClose} fullWidth maxWidth="sm">
              <DialogTitle>Үүрэг өгөх</DialogTitle>
              <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  label="Үүрэг"
                  value={newTask.title}
                  onChange={handleTaskChange("title")}
                  fullWidth
                />
                <TextField
                  label="Хариуцагч"
                  select
                  SelectProps={{ native: true }}
                  value={newTask.userId}
                  onChange={handleTaskChange("userId")}
                  fullWidth
                >
                  <option value="">Хэрэглэгч сонгох</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </TextField>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleTaskClose}>Цуцлах</Button>
                <Button variant="contained" onClick={handleTaskAdd} color="primary">
                  Оноох
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}
      </Container>
    </>
  );
}