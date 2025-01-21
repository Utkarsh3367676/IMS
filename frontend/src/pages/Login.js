import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api"; // Make sure to import api
import { jwtDecode } from "jwt-decode";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/api/token/", formData);

      // Store tokens
      localStorage.setItem("token", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);

      // Create userData object with explicit property mapping
      const userData = {
        is_staff: Boolean(response.data.is_staff),
        is_superuser: Boolean(response.data.is_superuser),
        username: String(response.data.username || ""),
        email: String(response.data.email || ""),
        groups: Array.isArray(response.data.groups) ? response.data.groups : [],
      };

      localStorage.setItem("userData", JSON.stringify(userData));

      // Decode and log token contents
      const decodedToken = jwtDecode(response.data.access);

      // Pass both token and user data to login
      await login(response.data.access, userData);
      navigate("/");
    } catch (error) {
      setError(
        error.response?.data?.detail ||
          error.response?.data?.error ||
          "Failed to login"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 8,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: "100%", marginBottom: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
          <TextField
            label="Username"
            name="username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </Button>
        </Box>

        <Button
          onClick={() => navigate("/register")}
          color="secondary"
          fullWidth
          sx={{ marginTop: 2 }}
        >
          Register
        </Button>
      </Box>
    </Container>
  );
};

export default Login;
