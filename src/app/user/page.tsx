"use client";
import React, { useState } from "react";
import {
  AppBar, Toolbar, IconButton, Typography, Container,
  Card, CardContent, CardActions, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Menu, MenuItem, Box, Paper
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useRouter } from "next/navigation";

export default function UserPage() {
  const router = useRouter();

  const user = { id: 2, name: "Bob", email: "bob@example.com", role: "user" };

  const tasks = [
    { id: 1, title: "Report Writing", userId: 2, startDate: "2025-06-25", endDate: "2025-06-30" },
    { id: 2, title: "Security Check", userId: 1, startDate: "2025-06-26", endDate: "2025-06-28" },
    { id: 3, title: "System Audit", userId: 2, startDate: "2025-06-27", endDate: "2025-07-01" },
  ];

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleOpenChangePassword = () => {
    handleMenuClose();
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
  };

  const handleSavePassword = () => {
    setError("");
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill all fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    alert("Password changed!");
    handleCloseDialog();
  };

  const handleLogout = () => {
    handleMenuClose();
    router.push("/");
  };

  // Task submission
  const [submissionDialogOpen, setSubmissionDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [submissionText, setSubmissionText] = useState("");
  const [submissions, setSubmissions] = useState<{ [taskId: number]: string }>({});

  const handleOpenSubmission = (task: any) => {
    setSelectedTask(task);
    setSubmissionText(submissions[task.id] || "");
    setSubmissionDialogOpen(true);
  };

  const handleSubmitTask = () => {
    setSubmissions((prev) => ({ ...prev, [selectedTask.id]: submissionText }));
    setSubmissionDialogOpen(false);
    alert("Submitted!");
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            User Dashboard
          </Typography>
          <IconButton color="inherit" onClick={handleMenuOpen}>
            <AccountCircle />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem onClick={handleOpenChangePassword}>Change Password</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        
        {/* Task List */}
        <Typography variant="h6" gutterBottom>Assigned Tasks</Typography>
        {tasks.filter(t => t.userId === user.id).map(task => (
          <Paper key={task.id} sx={{ mb: 2, p: 2 }}>
            <Typography variant="subtitle1">{task.title}</Typography>
            <Typography variant="body2">Start: {task.startDate}</Typography>
            <Typography variant="body2">End: {task.endDate}</Typography>
            <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
              Submission: {submissions[task.id] || "Not submitted"}
            </Typography>
            <Button sx={{ mt: 1 }} variant="outlined" onClick={() => handleOpenSubmission(task)}>
              {submissions[task.id] ? "Edit Submission" : "Submit Task"}
            </Button>
          </Paper>
        ))}
      </Container>

      {/* Change Password Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, width: 360 }}>
          <TextField
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            fullWidth
          />
          <TextField
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
          />
          <TextField
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
          />
          {error && (
            <Typography color="error" variant="body2">{error}</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSavePassword}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Task Submission Dialog */}
      <Dialog open={submissionDialogOpen} onClose={() => setSubmissionDialogOpen(false)}>
        <DialogTitle>Submit Task: {selectedTask?.title}</DialogTitle>
        <DialogContent>
          <TextField
            label="Submission Text / Link"
            fullWidth
            multiline
            minRows={3}
            value={submissionText}
            onChange={(e) => setSubmissionText(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSubmissionDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmitTask}>Submit</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
