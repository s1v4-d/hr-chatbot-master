import { useState, useContext } from "react";
import { loginAPI } from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginAPI(credentials.username, credentials.password);
      login("dummy_token");
      setError("");
      navigate("/chatbot");
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
      <Paper sx={{ p: 4, width: 300, textAlign: "center" }}>
        <Typography variant="h5" mb={2}>Login</Typography>
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
          <Button type="submit" variant="contained">Login</Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;
