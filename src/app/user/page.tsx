"use client";
import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useRouter } from "next/navigation";

export default function UserPage() {
  const user = { id: 2, name: "Bob", email: "bob@example.com", role: "user" };

  const router = useRouter();

  // Menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => setAnchorEl(null);

  // Dialog state
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
    router.push("/"); // Go back to login or homepage
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
        <Card sx={{ maxWidth: 400, mx: "auto" }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {user.name}
            </Typography>
            <Typography variant="body2">Email: {user.email}</Typography>
            <Typography variant="body2">Role: {user.role}</Typography>
          </CardContent>
          <CardActions>
            <Button size="small">Edit Profile</Button>
            <Button size="small" onClick={handleLogout}>
              Logout
            </Button>
          </CardActions>
        </Card>
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
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSavePassword}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
