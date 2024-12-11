import { useState, useContext } from "react";
import { loginAPI } from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginAPI(credentials.username, credentials.password);
      // If success, store token (dummy token from backend or actual)
      login("dummy_token");
      setError("");
    } catch (err) {
      setError("Invalid login credentials");
    }
  };

  return (
    <Box 
      display="flex" 
      flexDirection="column"
      alignItems="center" 
      justifyContent="center" 
      height="100vh"
      bgcolor="#f4f4f4"
    >
      <Paper sx={{ p: 4, width: 300 }}>
        <Typography variant="h5" mb={2} textAlign="center">
          Login
        </Typography>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <TextField
            label="Username"
            variant="outlined"
            value={credentials.username}
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button type="submit" variant="contained">
            Login
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;
