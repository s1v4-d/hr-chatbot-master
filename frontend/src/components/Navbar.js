import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, isAdmin, logout } = useContext(AuthContext);

  return (
    <AppBar position="static" sx={{ marginBottom: "0.5rem" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          HR Chatbot
        </Typography>
        {isAuthenticated ? (
          <>
            <Button color="inherit" component={Link} to="/chatbot">
              Chatbot
            </Button>
            {isAdmin && (
              <Button color="inherit" component={Link} to="/upload">
                Upload Documents
              </Button>
            )}
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/register">
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
