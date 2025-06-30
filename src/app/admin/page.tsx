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
  Menu,
  MenuItem,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  // Account Menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleOpenPasswordDialog = () => {
    setAnchorEl(null);
    setPasswordDialogOpen(true);
  };
  const handleClosePasswordDialog = () => {
    setPasswordDialogOpen(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
  };
  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Бүх талбарыг бөглөнө үү.");
    } else if (newPassword !== confirmPassword) {
      setPasswordError("Нууц үг таарахгүй байна.");
    } else {
      alert("Нууц үг амжилттай солигдлоо.");
      handleClosePasswordDialog();
    }
  };
  const handleLogout = () => {
    setAnchorEl(null);
    router.push("/");
  };

  // Tabs
  const [currentTab, setCurrentTab] = useState<"users" | "tasks">("users");

  // User Management
  const [users, setUsers] = useState([
    { id: 1, name: "Alice", email: "alice@example.com", role: "admin", position: "Ахлагч", rank: "Дэслэгч" },
    { id: 2, name: "Bob", email: "bob@example.com", role: "user", position: "Гишүүн", rank: "Ахлагч" },
  ]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "user", position: "", rank: "" });

  const handleOpenUserDialog = () => setDialogOpen(true);
  const handleCloseUserDialog = () => {
    setDialogOpen(false);
    setNewUser({ name: "", email: "", role: "user", position: "", rank: "" });
  };
  const handleUserChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setNewUser((prev) => ({ ...prev, [field]: e.target.value }));
  const handleAddUser = () => {
    const nextId = users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1;
    setUsers((prev) => [...prev, { id: nextId, ...newUser }]);
    handleCloseUserDialog();
  };

  // Task Management
  const [tasks, setTasks] = useState([{ id: 1, title: "Review Budget", userId: 1 }]);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", userId: "" });

  const handleOpenTaskDialog = () => setTaskDialogOpen(true);
  const handleCloseTaskDialog = () => {
    setTaskDialogOpen(false);
    setNewTask({ title: "", userId: "" });
  };
  const handleTaskChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setNewTask((prev) => ({ ...prev, [field]: e.target.value }));
  const handleAddTask = () => {
    const nextId = tasks.length ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
    setTasks((prev) => [...prev, { id: nextId, ...newTask, userId: Number(newTask.userId) }]);
    handleCloseTaskDialog();
  };

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: "#1A237E" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, color: "white" }}>
            Admin Dashboard
          </Typography>
          <IconButton color="inherit" onClick={handleMenuOpen}>
            <AccountCircle />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem onClick={handleOpenPasswordDialog}>Нууц үг солих</MenuItem>
            <MenuItem onClick={handleLogout}>Гарах</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
          <Button
            variant={currentTab === "users" ? "contained" : "outlined"}
            onClick={() => setCurrentTab("users")}
            color="primary"
          >
            Хэрэглэгчид
          </Button>
          <Button
            variant={currentTab === "tasks" ? "contained" : "outlined"}
            onClick={() => setCurrentTab("tasks")}
            color="secondary"
          >
            Даалгавар
          </Button>
        </Box>

        {currentTab === "users" && (
          <>
            <Button variant="contained" onClick={handleOpenUserDialog} sx={{ mb: 2 }}>
              Хэрэглэгч нэмэх
            </Button>
            <TableContainer component={Paper} elevation={3}>
              <Table>
                <TableHead sx={{ backgroundColor: "#E8EAF6" }}>
                  <TableRow>
                    <TableCell>Д/д</TableCell>
                    <TableCell>Албан тушаал</TableCell>
                    <TableCell>Цол</TableCell>
                    <TableCell>Нэр</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Эрх</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id} hover>
                      <TableCell>{u.id}</TableCell>
                      <TableCell>{u.position}</TableCell>
                      <TableCell>{u.rank}</TableCell>
                      <TableCell>{u.name}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>{u.role}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Dialog open={dialogOpen} onClose={handleCloseUserDialog} fullWidth maxWidth="sm">
              <DialogTitle>Хэрэглэгч бүртгэх</DialogTitle>
              <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField label="Албан тушаал" value={newUser.position} onChange={handleUserChange("position")} fullWidth />
                <TextField label="Цол" value={newUser.rank} onChange={handleUserChange("rank")} fullWidth />
                <TextField label="Овог, нэр" value={newUser.name} onChange={handleUserChange("name")} fullWidth />
                <TextField label="Email" type="email" value={newUser.email} onChange={handleUserChange("email")} fullWidth />
                <TextField label="Эрх" value={newUser.role} onChange={handleUserChange("role")} fullWidth />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseUserDialog}>Болих</Button>
                <Button variant="contained" onClick={handleAddUser} color="primary">
                  Хадгалах
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}

        {currentTab === "tasks" && (
          <>
            <Button variant="contained" onClick={handleOpenTaskDialog} sx={{ mb: 2 }}>
              Үүрэг оноох
            </Button>
            <TableContainer component={Paper} elevation={3}>
              <Table>
                <TableHead sx={{ backgroundColor: "#FFF8E1" }}>
                  <TableRow>
                    <TableCell>Д/д</TableCell>
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

            <Dialog open={taskDialogOpen} onClose={handleCloseTaskDialog} fullWidth maxWidth="sm">
              <DialogTitle>Үүрэг өгөх</DialogTitle>
              <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  label="Үүргийн гарчиг"
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
                <Button onClick={handleCloseTaskDialog}>Цуцлах</Button>
                <Button variant="contained" onClick={handleAddTask}>
                  Оноох
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}
      </Container>

      {/* Change Password Dialog */}
      <Dialog open={passwordDialogOpen} onClose={handleClosePasswordDialog}>
        <DialogTitle>Нууц үг солих</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Одоогийн нууц үг"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            fullWidth
          />
          <TextField
            label="Шинэ нууц үг"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
          />
          <TextField
            label="Шинэ нууц үг давтах"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
          />
          {passwordError && (
            <Typography color="error" variant="body2">
              {passwordError}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePasswordDialog}>Болих</Button>
          <Button variant="contained" onClick={handleChangePassword}>
            Хадгалах
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
