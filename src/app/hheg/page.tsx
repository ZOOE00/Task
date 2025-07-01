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
  Box,
  SelectChangeEvent,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  firstname: string;
  lastname: string;
}

interface TaskForm {
  title: string;
  descrip: string;
  created_to: number;
  startDate: string;
  endDate: string;
}

interface Task extends TaskForm {
  id: number;
  status: boolean;
}

export default function KHEGPage() {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    router.push("/");
  };

  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState<TaskForm>({
    title: "",
    descrip: "",
    created_to: 0,
    startDate: "",
    endDate: "",
  });

  const [filterStart, setFilterStart] = useState("");
  const [filterEnd, setFilterEnd] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.get<User[]>(
          `${process.env.NEXT_PUBLIC_API_URL}/users/list-role`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("User list response:", res.data);
        if (Array.isArray(res.data)) {
          setUsers(res.data);
        } else {
          console.error("Unexpected user list format:", res.data);
          alert("Алдаатай хэрэглэгчийн мэдээлэл ирлээ.");
        }
      } catch (err) {
        console.error("Failed to fetch users", err);
        alert("Хэрэглэгчийн жагсаалт татаж чадсангүй.");
      }
    }

    async function fetchTasks() {
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.get<Task[]>(
          `${process.env.NEXT_PUBLIC_API_URL}/task/list`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTasks(res.data || []);
      } catch (err) {
        console.error("Failed to fetch tasks", err);
        alert("Үүргүүдийг татахад алдаа гарлаа.");
      }
    }

    fetchUsers();
    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Токен олдсонгүй. Нэвтэрч орно уу.");
        return;
      }

      const response = await axios.post<Task>(
        `${process.env.NEXT_PUBLIC_API_URL}/task/create`,
        {
          title: newTask.title,
          descrip: newTask.descrip,
          created_to: +newTask.created_to,
        //   start_date: newTask.startDate,
        //   end_date: newTask.endDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks((prev) => [...prev, response.data]);
      setDialogOpen(false);
      setNewTask({
        title: "",
        descrip: "",
        created_to: 0,
        startDate: "",
        endDate: "",
      });
      console.log("Үүрэг амжилттай нэмэгдлээ:", newTask);
    } catch (err) {
      console.error("Үүрэг нэмэхэд алдаа гарлаа:", err);
      alert("Үүрэг нэмэхэд алдаа гарлаа");
    }
  };

  const handleUserChange = (e: SelectChangeEvent<string>) => {
    setNewTask((v) => ({ ...v, created_to: Number(e.target.value) }));
  };

  const filteredTasks = tasks.filter((task) => {
    if (!filterStart || !filterEnd) return true;
    const taskStart = new Date(task.startDate).getTime();
    const start = new Date(filterStart).getTime();
    const end = new Date(filterEnd).getTime();
    return taskStart >= start && taskStart <= end;
  });

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
            <MenuItem onClick={handleLogout}>Программаас гарах</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 2,
            mb: 2,
          }}
        >
          <TextField
            label="Эхлэх огноо"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={filterStart}
            onChange={(e) => setFilterStart(e.target.value)}
            size="small"
          />
          <TextField
            label="Дуусах огноо"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={filterEnd}
            onChange={(e) => setFilterEnd(e.target.value)}
            size="small"
          />
          <Button variant="outlined">Хайх</Button>
        </Box>

        <Button
          variant="contained"
          onClick={() => setDialogOpen(true)}
          sx={{ mb: 2 }}
        >
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
              {filteredTasks.map((t) => {
                const user = users.find((u) => u.id === t.created_to);
                return (
                  <TableRow key={t.id}>
                    <TableCell>{t.id}</TableCell>
                    <TableCell>{t.title}</TableCell>
                    <TableCell>{t.descrip}</TableCell>
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

        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Үүрэг нэмэх</DialogTitle>
          <DialogContent
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Гарчиг"
              value={newTask.title}
              onChange={(e) =>
                setNewTask((v) => ({ ...v, title: e.target.value }))
              }
              fullWidth
            />
            <TextField
              label="Тайлбар"
              value={newTask.descrip}
              onChange={(e) =>
                setNewTask((v) => ({ ...v, descrip: e.target.value }))
              }
              fullWidth
              multiline
              rows={4}
            />
            <FormControl fullWidth>
              <InputLabel id="user-select-label">Албан тушаалтан</InputLabel>
              <Select
                labelId="user-select-label"
                value={newTask.created_to.toString()}
                label="Албан тушаалтан"
                onChange={handleUserChange}
              >
                <MenuItem value="0" disabled>
                  Сонгох
                </MenuItem>
                {users.map((u) => (
                  <MenuItem key={u.id} value={u.id.toString()}>
                    {u.firstname} {u.lastname}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {/* <TextField
              label="Эхлэх огноо"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={newTask.startDate}
              onChange={(e) =>
                setNewTask((v) => ({ ...v, startDate: e.target.value }))
              }
              fullWidth
            />
            <TextField
              label="Дуусах огноо"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={newTask.endDate}
              onChange={(e) =>
                setNewTask((v) => ({ ...v, endDate: e.target.value }))
              }
              fullWidth
            /> */}
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
