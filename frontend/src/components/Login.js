import { useState } from "react";
import { login } from "../api/api";
import "../styles/Login.css";

const Login = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(credentials.username, credentials.password);
      setSuccess(response.data.message);
      setError("");
    } catch (err) {
      setError("Invalid login credentials");
      setSuccess("");
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={credentials.username}
          onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
        />
        <button type="submit">Login</button>
      </form>
      {error && <p className="error">{error}</p>}
      {success && <p>{success}</p>}
    </div>
  );
};

export default Login;
