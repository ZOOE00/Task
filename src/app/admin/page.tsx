"use client";
import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

export default function AdminPage() {
  // Users state
  const [users, setUsers] = useState([
    { id: 1, name: "Alice", email: "alice@example.com", role: "admin" },
    { id: 2, name: "Bob", email: "bob@example.com", role: "user" },
  ]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "user" });

  // Tasks state
  const [tasks, setTasks] = useState([{ id: 1, title: "Review Budget", userId: 1 }]);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", userId: "" });

  // Current tab state: 'users' or 'tasks'
  const [currentTab, setCurrentTab] = useState<"users" | "tasks">("users");

  // Handlers for users
  const handleOpen = () => setDialogOpen(true);
  const handleClose = () => {
    setDialogOpen(false);
    setNewUser({ name: "", email: "", role: "user" });
  };
  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setNewUser((prev) => ({ ...prev, [field]: e.target.value }));
  const handleAdd = () => {
    const nextId = users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1;
    setUsers((prev) => [...prev, { id: nextId, ...newUser }]);
    handleClose();
  };

  // Handlers for tasks
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
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          <IconButton color="inherit">
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        {/* Menu buttons */}
        <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
          <Button
            variant={currentTab === "users" ? "contained" : "outlined"}
            onClick={() => setCurrentTab("users")}
          >
            Users
          </Button>
          <Button
            variant={currentTab === "tasks" ? "contained" : "outlined"}
            onClick={() => setCurrentTab("tasks")}
          >
            Tasks
          </Button>
        </Box>

        {/* Conditionally render Users or Tasks content */}
        {currentTab === "users" && (
          <>
            <Button variant="contained" onClick={handleOpen} sx={{ mb: 2 }}>
              Add User
            </Button>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell>{u.id}</TableCell>
                      <TableCell>{u.name}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>{u.role}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Add User Dialog */}
            <Dialog open={dialogOpen} onClose={handleClose}>
              <DialogTitle>Add New User</DialogTitle>
              <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, width: 360 }}>
                <TextField label="Name" value={newUser.name} onChange={handleChange("name")} fullWidth />
                <TextField label="Email" type="email" value={newUser.email} onChange={handleChange("email")} fullWidth />
                <TextField label="Role" value={newUser.role} onChange={handleChange("role")} fullWidth />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button variant="contained" onClick={handleAdd}>
                  Save
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}

        {currentTab === "tasks" && (
          <>
            <Button variant="contained" onClick={handleTaskOpen} sx={{ mb: 2 }}>
              Assign Task
            </Button>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Assigned To</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tasks.map((task) => {
                    const user = users.find((u) => u.id === task.userId);
                    return (
                      <TableRow key={task.id}>
                        <TableCell>{task.id}</TableCell>
                        <TableCell>{task.title}</TableCell>
                        <TableCell>{user ? user.name : "Unknown"}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Assign Task Dialog */}
            <Dialog open={taskDialogOpen} onClose={handleTaskClose}>
              <DialogTitle>Assign Task</DialogTitle>
              <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, width: 360 }}>
                <TextField
                  label="Task Title"
                  value={newTask.title}
                  onChange={handleTaskChange("title")}
                  fullWidth
                />
                <TextField
                  label="Assign To (User)"
                  select
                  SelectProps={{ native: true }}
                  value={newTask.userId}
                  onChange={handleTaskChange("userId")}
                  fullWidth
                >
                  <option value="">Select user</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </TextField>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleTaskClose}>Cancel</Button>
                <Button variant="contained" onClick={handleTaskAdd}>
                  Assign
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}
      </Container>
    </>
  );
}
