"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  AppBar, Toolbar, IconButton, Typography, Container,
  Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Dialog, DialogActions,
  DialogContent, DialogTitle, TextField, Menu, MenuItem,
  Select, InputLabel, FormControl
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useRouter } from "next/navigation";
import ChangePasswordDialog from "@/components/changePassword";

export default function KHEGPage() {
  const router = useRouter();

  // --- Account Menu & Dialogs ---
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  // --- Users & Tasks State ---
  const [users, setUsers] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "", userId: "", startDate: "", endDate: ""
  });

  // --- Load Users From API ---
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
  headers: { Authorization: `Bearer ${token}` },
});

        setUsers(res.data);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };
    fetchUsers();
  }, []);

  // --- Add Task ---
  const handleAddTask = () => {
    const nextId = tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
    setTasks([
      ...tasks,
      { id: nextId, ...newTask, userId: Number(newTask.userId) }
    ]);
    setDialogOpen(false);
    setNewTask({ title: "", userId: "", startDate: "", endDate: "" });
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            ХХЕГ — Task Assignment
          </Typography>
          <IconButton color="inherit" onClick={handleMenuOpen}>
            <AccountCircle />
          </IconButton>
          <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleMenuClose}>
            <MenuItem onClick={() => { setPasswordDialogOpen(true); handleMenuClose(); }}>
              Change Password
            </MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Button variant="contained" onClick={() => setDialogOpen(true)} sx={{ mb: 2 }}>
          Create Task
        </Button>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Start</TableCell>
                <TableCell>End</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map((t) => {
                const assignedUser = users.find(u => u.id === t.userId);
                return (
                  <TableRow key={t.id}>
                    <TableCell>{t.id}</TableCell>
                    <TableCell>{t.title}</TableCell>
                    <TableCell>{assignedUser?.name || "Unknown"}</TableCell>
                    <TableCell>{t.startDate}</TableCell>
                    <TableCell>{t.endDate}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Create Task Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle>Create Task</DialogTitle>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              label="Title"
              value={newTask.title}
              onChange={(e) => setNewTask(v => ({ ...v, title: e.target.value }))}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel id="user-select-label">Assign to User</InputLabel>
              <Select
                labelId="user-select-label"
                value={newTask.userId}
                label="Assign to User"
                onChange={(e) => setNewTask(v => ({ ...v, userId: e.target.value }))}
              >
                {users.map(u => (
                  <MenuItem key={u.id} value={u.id}>{u.name} ({u.email})</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Start Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={newTask.startDate}
              onChange={(e) => setNewTask(v => ({ ...v, startDate: e.target.value }))}
              fullWidth
            />
            <TextField
              label="End Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={newTask.endDate}
              onChange={(e) => setNewTask(v => ({ ...v, endDate: e.target.value }))}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleAddTask}>Save</Button>
          </DialogActions>
        </Dialog>
      </Container>

      {/* Change Password Dialog */}
      <ChangePasswordDialog open={passwordDialogOpen} onClose={() => setPasswordDialogOpen(false)} />
    </>
  );
}
