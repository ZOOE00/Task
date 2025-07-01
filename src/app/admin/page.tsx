"use client";
import React, { useState, useEffect } from "react";
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
  Tooltip,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import EditIcon from "@mui/icons-material/Edit";
import { useRouter } from "next/navigation";
import api from "../lib/api";

interface User {
  id: number;
  position: string;
  rank: string;
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  role: number; // 1=Админ, 2=ХХЕГ, 3=Хэрэглэгч
}

export default function AdminPage() {
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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState<Omit<User, "id">>({
    position: "",
    rank: "",
    username: "",
    password: "",
    firstname: "",
    lastname: "",
    role: 3,
  });
  const fetchUsers = async () => {
    try {
      const { data } = await api.get<User[]>("/users/list");
      setUsers(data);
    } catch (err: any) {
      if (err.response?.status === 401) router.push("/login");
      else console.error("Алдаа:", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return router.push("/login");
    fetchUsers();
  }, [router]);

  const handleAddUser = async () => {
    try {
      await api.post("/users/create", newUser);
      await fetchUsers();
      setDialogOpen(false);
      setNewUser({
        position: "",
        rank: "",
        username: "",
        password: "",
        firstname: "",
        lastname: "",
        role: 3,
      });
    } catch (err: any) {
      console.error("Хэрэглэгч нэмэх үед алдаа:", err.response?.data || err);
    }
  };

 const handleEditClick = async (id: number) => {
  try {
    console.log("Fetching user by id:", id);
    const { data } = await api.get<User>(`/users/list/${id}`);
    setSelectedUser(data);
    setEditDialogOpen(true);
  } catch (err: any) {
    console.error(
      "Хэрэглэгчийн мэдээлэл авах үед алдаа:",
      err.response?.data || err
    );
  }
};

  const handleSaveEdit = async () => {
    if (!selectedUser) return;
    try {
      await api.put(`users/update/${selectedUser.id}`, selectedUser);
      await fetchUsers();
      setEditDialogOpen(false);
      setSelectedUser(null);
    } catch (err: any) {
      console.error("Хэрэглэгч засах үед алдаа:", err.response?.data || err);
    }
  };

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: "#1A237E" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Админ
          </Typography>
          <IconButton color="inherit" onClick={handleMenuOpen}>
            <AccountCircle />
          </IconButton>
          <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleMenuClose}>
            <MenuItem onClick={handleLogout}>Гарах</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Button
          variant="contained"
          onClick={() => setDialogOpen(true)}
          sx={{ mb: 2 }}
        >
          Хэрэглэгч нэмэх
        </Button>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Засах</TableCell>
                <TableCell>Албан тушаал</TableCell>
                <TableCell>Цол</TableCell>
                <TableCell>Нэр</TableCell>
                <TableCell>Овог</TableCell>
                <TableCell>Нэвтрэх нэр</TableCell>
                <TableCell>Нууц үг</TableCell>
                <TableCell>Эрх</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>{u.id}</TableCell>
                  <TableCell>
                    <Tooltip title="Засах">
                      <IconButton
                        onClick={() => handleEditClick(u.id)}
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <TableCell>{u.position}</TableCell>
                  <TableCell>{u.rank}</TableCell>
                  <TableCell>{u.firstname}</TableCell>
                  <TableCell>{u.lastname}</TableCell>
                  <TableCell>{u.username}</TableCell>
                  <TableCell>{u.password}</TableCell>
                  <TableCell>
                    {u.role === 1
                      ? "Админ"
                      : u.role === 2
                      ? "ХХЕГ"
                      : "Хэрэглэгч"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Шинэ хэрэглэгч нэмэх</DialogTitle>
          <DialogContent
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Албан тушаал"
              value={newUser.position}
              onChange={(e) =>
                setNewUser((v) => ({ ...v, position: e.target.value }))
              }
              fullWidth
            />
            <TextField
              label="Цол"
              value={newUser.rank}
              onChange={(e) =>
                setNewUser((v) => ({ ...v, rank: e.target.value }))
              }
              fullWidth
            />
            <TextField
              label="Нэвтрэх нэр"
              value={newUser.username}
              onChange={(e) =>
                setNewUser((v) => ({ ...v, username: e.target.value }))
              }
              fullWidth
            />
            <TextField
              label="Нууц үг"
              type="password"
              value={newUser.password}
              onChange={(e) =>
                setNewUser((v) => ({ ...v, password: e.target.value }))
              }
              fullWidth
            />
            <TextField
              label="Нэр"
              value={newUser.firstname}
              onChange={(e) =>
                setNewUser((v) => ({ ...v, firstname: e.target.value }))
              }
              fullWidth
            />
            <TextField
              label="Овог"
              value={newUser.lastname}
              onChange={(e) =>
                setNewUser((v) => ({ ...v, lastname: e.target.value }))
              }
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Хэрэглэгчийн эрх</InputLabel>
              <Select
                value={newUser.role}
                label="Хэрэглэгчийн эрх"
                onChange={(e) =>
                  setNewUser((v) => ({ ...v, role: Number(e.target.value) }))
                }
              >
                <MenuItem value={1}>Админ</MenuItem>
                <MenuItem value={2}>ХХЕГ</MenuItem>
                <MenuItem value={3}>Хэрэглэгч</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Цуцлах</Button>
            <Button variant="contained" onClick={handleAddUser}>
              Хадгалах
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Хэрэглэгч засах</DialogTitle>
          <DialogContent
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Албан тушаал"
              value={selectedUser?.position || ""}
              onChange={(e) =>
                setSelectedUser((prev) =>
                  prev ? { ...prev, position: e.target.value } : null
                )
              }
              fullWidth
            />
            <TextField
              label="Цол"
              value={selectedUser?.rank || ""}
              onChange={(e) =>
                setSelectedUser((prev) =>
                  prev ? { ...prev, rank: e.target.value } : null
                )
              }
              fullWidth
            />
            <TextField
              label="Нэвтрэх нэр"
              value={selectedUser?.username || ""}
              onChange={(e) =>
                setSelectedUser((prev) =>
                  prev ? { ...prev, username: e.target.value } : null
                )
              }
              fullWidth
            />
            <TextField
              label="Нууц үг"
              value={selectedUser?.password || ""}
              onChange={(e) =>
                setSelectedUser((prev) =>
                  prev ? { ...prev, password: e.target.value } : null
                )
              }
              fullWidth
            />
            <TextField
              label="Нэр"
              value={selectedUser?.firstname || ""}
              onChange={(e) =>
                setSelectedUser((prev) =>
                  prev ? { ...prev, firstname: e.target.value } : null
                )
              }
              fullWidth
            />
            <TextField
              label="Овог"
              value={selectedUser?.lastname || ""}
              onChange={(e) =>
                setSelectedUser((prev) =>
                  prev ? { ...prev, lastname: e.target.value } : null
                )
              }
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Хэрэглэгчийн эрх</InputLabel>
              <Select
                value={selectedUser?.role || 3}
                label="Хэрэглэгчийн эрх"
                onChange={(e) =>
                  setSelectedUser((prev) =>
                    prev ? { ...prev, role: Number(e.target.value) } : null
                  )
                }
              >
                <MenuItem value={1}>Админ</MenuItem>
                <MenuItem value={2}>ХХЕГ</MenuItem>
                <MenuItem value={3}>Хэрэглэгч</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>Болих</Button>
            <Button variant="contained" onClick={handleSaveEdit}>
              Хадгалах
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}