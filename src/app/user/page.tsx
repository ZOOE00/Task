"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Container,
  Paper,
  Button,
  TextField,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  firstname: string;
  lastname: string;
}

interface Task {
  id: number;
  title: string;
  description?: string;
  userId: number;
  startDate: string;
  endDate: string;
}

export default function UserPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const [changePwdOpen, setChangePwdOpen] = useState(false);
  const [submissionDialogOpen, setSubmissionDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [submissionText, setSubmissionText] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [submissions, setSubmissions] = useState<Record<number, { text: string; file?: File }>>({});

  // Fetch user and tasks
  useEffect(() => {
    const fetchUserAndTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const userRes = await axios.get<User>(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const userData = userRes.data;
        setUser(userData);

        const taskRes = await axios.get<Task[]>(
          `${process.env.NEXT_PUBLIC_API_URL}/users/list/${userData.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTasks(taskRes.data || []);
      } catch (err) {
        console.error("Failed to fetch user or tasks", err);
      }
    };

    fetchUserAndTasks();
  }, []);

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };
  const openChangePwd = () => {
    handleMenuClose();
    setChangePwdOpen(true);
  };

  const handleOpenSubmission = (task: Task) => {
    setSelectedTask(task);
    const prev = submissions[task.id];
    setSubmissionText(prev?.text || "");
    setUploadedFile(prev?.file || null);
    setSubmissionDialogOpen(true);
  };

  const handleSubmitTask = () => {
    if (!selectedTask) return;
    setSubmissions(prev => ({
      ...prev,
      [selectedTask.id]: { text: submissionText, file: uploadedFile || undefined },
    }));
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
            open={openMenu}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem onClick={openChangePwd}>Change Password</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Assigned Tasks
        </Typography>

        {tasks.map((task) => (
          <Paper key={task.id} sx={{ mb: 2, p: 2 }}>
            <Typography variant="subtitle1">{task.title}</Typography>
            {task.description && <Typography variant="body2">{task.description}</Typography>}
            <Typography variant="body2">Start: {task.startDate}</Typography>
            <Typography variant="body2">End: {task.endDate}</Typography>
            <Typography variant="body2" sx={{ mt: 1, fontStyle: "italic" }}>
              Submission: {submissions[task.id]?.text || "Not submitted"}
            </Typography>
            {submissions[task.id]?.file && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="caption">
                  File: {submissions[task.id]!.file!.name}
                </Typography>
              </Box>
            )}
            <Button
              sx={{ mt: 1 }}
              variant="outlined"
              onClick={() => handleOpenSubmission(task)}
            >
              {submissions[task.id] ? "Edit Submission" : "Submit Task"}
            </Button>
          </Paper>
        ))}
      </Container>

      {/* Task Submission Dialog */}
      <Dialog
        open={submissionDialogOpen}
        onClose={() => setSubmissionDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Submit Task: {selectedTask?.title}</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Submission Text / Link"
            fullWidth
            multiline
            minRows={3}
            value={submissionText}
            onChange={(e) => setSubmissionText(e.target.value)}
          />
          <Button variant="outlined" component="label">
            {uploadedFile ? "Change File" : "Upload File"}
            <input
              type="file"
              hidden
              onChange={(e) => setUploadedFile(e.target.files?.[0] ?? null)}
            />
          </Button>
          {uploadedFile && (
            <Typography variant="caption">Selected: {uploadedFile.name}</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSubmissionDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmitTask}>Submit</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
