import { useNavigate } from "react-router-dom";
import Registration from "../components/Registration";
import { Box, Typography } from "@mui/material";

const RegistrationPage = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/login");
  };

  return (
    <Box sx={{ backgroundColor: "#f4f4f4", height: "100vh", py: 4 }}>
      <Typography variant="h4" textAlign="center" mb={4}>Create Your Account</Typography>
      <Registration onSuccess={handleSuccess} />
    </Box>
  );
};

export default RegistrationPage;
