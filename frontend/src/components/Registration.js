import { useState } from "react";
import { registerAPI } from "../api/api";
import { TextField, Button, Typography, Paper } from "@mui/material";

const Registration = ({ onSuccess }) => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "", full_name: "" });
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    const { username, email, password, full_name } = formData;
    if (!username || !email || !password || !full_name) {
      setError("All fields are required.");
      return;
    }

    try {
      await registerAPI(username, email, password, full_name);
      setSuccessMsg("Registration successful! Redirecting to login...");
      setTimeout(() => onSuccess(), 2000);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <Paper sx={{ p: 4, width: 350, textAlign: "center", margin: "2rem auto" }}>
      <Typography variant="h5" mb={2}>Register</Typography>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <TextField
          label="Full Name"
          variant="outlined"
          value={formData.full_name}
          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
        />
        <TextField
          label="Username"
          variant="outlined"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        />
        <TextField
          label="Email"
          variant="outlined"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        {error && <Typography color="error">{error}</Typography>}
        {successMsg && <Typography color="primary">{successMsg}</Typography>}
        <Button type="submit" variant="contained">Register</Button>
      </form>
    </Paper>
  );
};

export default Registration;
