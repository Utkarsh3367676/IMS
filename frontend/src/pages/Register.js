import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";
import {
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Box,
  Alert,
  Grid,
} from "@mui/material";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
    role: "VIEWER",
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.password2) {
      setError("Passwords don't match");
      return;
    }

    try {
      const response = await api.post("/register/", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      if (response.status === 201) {
        navigate("/login", {
          state: { message: "Registration successful! Please login." },
        });
      }
    } catch (error) {
      console.error("Error registering user:", error);
      setError(
        error.response?.data?.message ||
          error.response?.data?.detail ||
          "Registration failed. Please try again."
      );
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Register
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          mt: 3,
        }}
      >
        <TextField
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          label="Confirm Password"
          name="password2"
          type="password"
          value={formData.password2}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          label="Role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          fullWidth
          select
        >
          <MenuItem value="VIEWER">Viewer</MenuItem>
          <MenuItem value="ADMIN">Admin</MenuItem>
        </TextField>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Register
        </Button>
      </Box>
      <Grid container justifyContent="center" sx={{ mt: 2 }}>
        <Grid item>
          <Typography variant="body2">
            Already have an account?{" "}
            <Button
              onClick={() => navigate("/login")}
              variant="text"
              color="primary"
            >
              Login
            </Button>
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Register;
