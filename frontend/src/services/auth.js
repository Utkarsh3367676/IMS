import api from "./axios";

export const login = async (credentials) => {
  try {
    const response = await api.post("/api/token/", {
      username: credentials.username,
      password: credentials.password,
    });

    // Store the tokens
    localStorage.setItem("token", response.data.access);
    localStorage.setItem("refreshToken", response.data.refresh);
    localStorage.setItem("role", response.data.role);
    console.log(response.data.role);
    // Get user details
    const userResponse = await api.get("/api/users/", {
      headers: {
        Authorization: `Bearer ${response.data.access}`,
      },
    });

    // Store user data
    localStorage.setItem("user", JSON.stringify(userResponse.data));

    return userResponse.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail ||
        "Login failed. Please check your credentials."
    );
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post("/users/register/", {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      role: userData.role,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "Registration failed. Please try again."
    );
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const getToken = () => {
  return localStorage.getItem("token");
};
