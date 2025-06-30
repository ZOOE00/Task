// File: src/app/admin/page.tsx
"use client";
import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

export default function AdminPage() {
  const [users, setUsers] = useState([
    { id: 1, name: 'Alice', email: 'alice@example.com', role: 'admin' },
    { id: 2, name: 'Bob', email: 'bob@example.com', role: 'user' },
  ]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'user' });

  const handleOpen = () => setDialogOpen(true);
  const handleClose = () => {
    setDialogOpen(false);
    setNewUser({ name: '', email: '', role: 'user' });
  };
  const handleChange = field => e => setNewUser(prev => ({ ...prev, [field]: e.target.value }));
  const handleAdd = () => {
    const nextId = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
    setUsers(prev => [...prev, { id: nextId, ...newUser }]);
    handleClose();
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Admin Dashboard</Typography>
          <IconButton color="inherit"><AccountCircle /></IconButton>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Button variant="contained" onClick={handleOpen} sx={{ mb: 2 }}>Add User</Button>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell><TableCell>Name</TableCell><TableCell>Email</TableCell><TableCell>Role</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map(u => (
                <TableRow key={u.id}>
                  <TableCell>{u.id}</TableCell><TableCell>{u.name}</TableCell><TableCell>{u.email}</TableCell><TableCell>{u.role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={dialogOpen} onClose={handleClose}>
          <DialogTitle>Add New User</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: 360 }}>
            <TextField label="Name" value={newUser.name} onChange={handleChange('name')} fullWidth />
            <TextField label="Email" type="email" value={newUser.email} onChange={handleChange('email')} fullWidth />
            <TextField label="Role" value={newUser.role} onChange={handleChange('role')} fullWidth />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button variant="contained" onClick={handleAdd}>Save</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}