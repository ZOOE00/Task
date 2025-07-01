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
  descrip: string;
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
  const [submissionDialogOpen, setSubmissionDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [submissionText, setSubmissionText] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [submissions, setSubmissions] = useState<Record<number, { text: string; file?: File }>>({});

  useEffect(() => {
    const fetchUserAndTasks = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const id = localStorage.getItem("id");
        if (!token) return;

        const taskRes = await axios.get<Task[]>(
          `${process.env.NEXT_PUBLIC_API_URL}/task/list-to`,
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
    localStorage.removeItem("authToken");
    router.push("/");
  };

  const handleOpenSubmission = (task: Task) => {
    setSelectedTask(task);
    const prev = submissions[task.id];
    setSubmissionText(prev?.text || "");
    setUploadedFile(prev?.file || null);
    setSubmissionDialogOpen(true);
  };

  const handleSubmitTask = async () => {
    if (!selectedTask || !user) return;

    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Not authenticated.");
      return;
    }

    const formData = new FormData();
    formData.append("taskId", selectedTask.id.toString());
    formData.append("userId", user.id.toString());
    formData.append("text", submissionText);
    if (uploadedFile) {
      formData.append("file", uploadedFile);
    }

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/submissions`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSubmissions((prev) => ({
        ...prev,
        [selectedTask.id]: { text: submissionText, file: uploadedFile || undefined },
      }));

      setSubmissionDialogOpen(false);
      alert("Submission successful!");
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Failed to submit task.");
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            My Tasks
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
            <MenuItem onClick={handleLogout}>Log out</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Assigned Tasks
        </Typography>

        {tasks.map((task) => (
          <Paper  sx={{ mb: 2, p: 2 }}>
            <Typography variant="subtitle1">{task.title}</Typography>
            {task.descrip && <Typography variant="body2">{task.descrip}</Typography>}
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

      {/* Submission Dialog */}
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
          <Button variant="contained" onClick={handleSubmitTask}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
