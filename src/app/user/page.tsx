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
  const [submissionDialogOpen, setSubmissionDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [submissionText, setSubmissionText] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [submissions, setSubmissions] = useState<Record<number, { text: string; file?: File }>>({});
  useEffect(() => {
    const fetchUserAndTasks = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          router.push("/");
          return;
        }

        // 1. Fetch logged-in user info
        const userRes = await axios.get<User>(
          `${process.env.NEXT_PUBLIC_API_URL}/users/list`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(userRes.data);

        // 2. Fetch tasks assigned to this user
        const taskRes = await axios.get<Task[]>(
          `${process.env.NEXT_PUBLIC_API_URL}/task/list_to`,
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
    setSubmissionText("");
    setUploadedFile(null);
    setSubmissionDialogOpen(true);
  };

  const handleSubmitTask = async () => {
    if (!selectedTask || !user) return;

    const token = localStorage.getItem("authToken");
    const formData = new FormData();
    formData.append("taskId", selectedTask.id.toString());
    formData.append("userId", user.id.toString());
    formData.append("submission", submissionText);
    if (uploadedFile) formData.append("file", uploadedFile);

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/submission`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Амжилттай илгээгдлээ!");
      setSubmissionDialogOpen(false);
    } catch (err) {
      console.error("Submission error:", err);
      alert("Илгээхэд алдаа гарлаа");
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Миний үүргүүд
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
            <MenuItem onClick={openChangePwd}>Нууц үг солих</MenuItem>
            <MenuItem onClick={handleLogout}>Программаас гарах</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Үүрэгүүд
        </Typography>

        {tasks.length === 0 ? (
          <Typography>Үүрэг олдоогүй байна.</Typography>
        ) : (
          tasks.map((task) => (
            <Paper key={task.id} sx={{ mb: 2, p: 2 }}>
              <Typography variant="subtitle1">{task.title}</Typography>
              {task.description && (
                <Typography variant="body2">{task.description}</Typography>
              )}
              <Typography variant="body2">Эхлэх: {task.startDate}</Typography>
              <Typography variant="body2">Дуусах: {task.endDate}</Typography>
              <Button
                sx={{ mt: 1 }}
                variant="outlined"
                onClick={() => handleOpenSubmission(task)}
              >
                Үүрэг илгээх
              </Button>
            </Paper>
          ))
        )}
      </Container>

      <Dialog
        open={submissionDialogOpen}
        onClose={() => setSubmissionDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Биелэлт оруулах</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Биелэлтийн тайлбар / линк"
            fullWidth
            multiline
            minRows={3}
            value={submissionText}
            onChange={(e) => setSubmissionText(e.target.value)}
          />
          <Button variant="outlined" component="label">
            Файл оруулах
            <input
              type="file"
              hidden
              onChange={(e) => setUploadedFile(e.target.files?.[0] ?? null)}
            />
          </Button>
          {uploadedFile && (
            <Typography variant="caption">Сонгосон файл: {uploadedFile.name}</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSubmissionDialogOpen(false)}>Цуцлах</Button>
          <Button variant="contained" onClick={handleSubmitTask}>
            Илгээх
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
