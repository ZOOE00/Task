"use client";
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';

export default function UserPage() {
  // Normally data would come from context or props
  const user = { id: 2, name: 'Bob', email: 'bob@example.com', role: 'user' };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>User Dashboard</Typography>
          <IconButton color="inherit"><AccountCircle /></IconButton>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>  
        <Card sx={{ maxWidth: 400, mx: 'auto' }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>{user.name}</Typography>
            <Typography variant="body2">Email: {user.email}</Typography>
            <Typography variant="body2">Role: {user.role}</Typography>
          </CardContent>
          <CardActions>
            <Button size="small">Edit Profile</Button>
            <Button size="small">Logout</Button>
          </CardActions>
        </Card>
      </Container>
    </>
  );
}
