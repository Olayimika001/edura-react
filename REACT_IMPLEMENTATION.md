# React Implementation Guide for Edura Education Platform

## Table of Contents
1. [Project Overview](#project-overview)
2. [Project Setup](#project-setup)
3. [Project Structure](#project-structure)
4. [Authentication Implementation](#authentication-implementation)
5. [Routing Setup](#routing-setup)
6. [State Management](#state-management)
7. [Component Architecture](#component-architecture)
8. [API Integration](#api-integration)
9. [Styling Approach](#styling-approach)
10. [Migration Checklist](#migration-checklist)

---

## Project Overview

This document outlines the implementation plan for converting the Edura HTML template into a modern React application with authentication capabilities. The Edura platform is an online education and course management system featuring:

- **Core Features**: Courses, Instructors, Events, Blog, Shop, Gallery
- **User Features**: User authentication, course enrollment, shopping cart, wishlist
- **Admin Features**: Course management, user management (future)

---

## Project Setup

### 1. Initialize React Project

```bash
# Using Vite (Recommended)
npm create vite@latest edura-react -- --template react
cd edura-react
npm install

# Or using Create React App
npx create-react-app edura-react
cd edura-react
```

### 2. Install Dependencies

```bash
# Core dependencies
npm install react-router-dom axios

# State management
npm install @reduxjs/toolkit react-redux

# Form handling and validation
npm install react-hook-form yup @hookform/resolvers

# UI components (optional - if using a component library)
npm install @mui/material @emotion/react @emotion/styled
# OR
npm install react-bootstrap bootstrap

# Authentication
npm install jwt-decode

# HTTP client
npm install axios

# Utilities
npm install date-fns

# Development dependencies
npm install -D @types/react @types/react-dom
```

### 3. Project Structure

```
edura-react/
├── public/
│   ├── assets/          # Copy from html-app/assets
│   │   ├── img/
│   │   ├── css/         # Will be converted to CSS modules or styled-components
│   │   └── js/          # Will be replaced with React components
│   └── index.html
├── src/
│   ├── components/      # Reusable components
│   │   ├── common/
│   │   │   ├── Header/
│   │   │   ├── Footer/
│   │   │   ├── Button/
│   │   │   ├── Card/
│   │   │   └── Loading/
│   │   ├── auth/
│   │   │   ├── LoginForm/
│   │   │   ├── RegisterForm/
│   │   │   └── ProtectedRoute/
│   │   ├── courses/
│   │   │   ├── CourseCard/
│   │   │   ├── CourseList/
│   │   │   └── CourseDetails/
│   │   ├── instructors/
│   │   │   ├── InstructorCard/
│   │   │   └── InstructorList/
│   │   └── events/
│   │       ├── EventCard/
│   │       └── EventList/
│   ├── pages/           # Page components
│   │   ├── Home/
│   │   ├── Courses/
│   │   ├── CourseDetails/
│   │   ├── Instructors/
│   │   ├── InstructorDetails/
│   │   ├── Events/
│   │   ├── EventDetails/
│   │   ├── Blog/
│   │   ├── BlogDetails/
│   │   ├── Shop/
│   │   ├── Cart/
│   │   ├── Checkout/
│   │   ├── Contact/
│   │   ├── About/
│   │   ├── Login/
│   │   ├── Register/
│   │   └── Profile/
│   ├── store/           # Redux store
│   │   ├── slices/
│   │   │   ├── authSlice.js
│   │   │   ├── courseSlice.js
│   │   │   ├── cartSlice.js
│   │   │   └── userSlice.js
│   │   └── store.js
│   ├── services/        # API services
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── courseService.js
│   │   └── userService.js
│   ├── hooks/           # Custom hooks
│   │   ├── useAuth.js
│   │   └── useLocalStorage.js
│   ├── utils/           # Utility functions
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   └── validators.js
│   ├── context/         # React Context (if not using Redux)
│   │   └── AuthContext.js
│   ├── styles/          # Global styles
│   │   ├── index.css
│   │   └── variables.css
│   ├── App.jsx
│   ├── main.jsx
│   └── routes.jsx
└── package.json
```

---

## Authentication Implementation

### 1. Authentication Service (`src/services/authService.js`)

```javascript
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const API_URL = `${API_BASE_URL}/auth`;

// Register user
const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  
  return response.data;
};

// Login user
const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  
  return response.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Get current user from token
const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

// Get token
const getToken = () => {
  return localStorage.getItem('token');
};

// Check if user is authenticated
const isAuthenticated = () => {
  const token = getToken();
  return !!token;
};

// Refresh token
const refreshToken = async () => {
  const response = await axios.post(`${API_URL}/refresh`, {
    token: getToken()
  });
  
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  
  return response.data;
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  getToken,
  isAuthenticated,
  refreshToken
};

export default authService;
```

### 2. Auth Redux Slice (`src/store/slices/authSlice.js`)

```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';

// Initial state
const initialState = {
  user: authService.getCurrentUser(),
  token: authService.getToken(),
  isAuthenticated: authService.isAuthenticated(),
  loading: false,
  error: null,
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await authService.login(credentials);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Login failed'
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await authService.register(userData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Registration failed'
      );
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  authService.logout();
});

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('user', JSON.stringify(state.user));
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, updateUser } = authSlice.actions;
export default authSlice.reducer;
```

### 3. Redux Store Configuration (`src/store/store.js`)

```javascript
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import courseReducer from './slices/courseSlice';
import cartReducer from './slices/cartSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: courseReducer,
    cart: cartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### 4. Custom Auth Hook (`src/hooks/useAuth.js`)

```javascript
import { useSelector, useDispatch } from 'react-redux';
import { loginUser, registerUser, logoutUser } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  const login = async (credentials) => {
    return dispatch(loginUser(credentials));
  };

  const register = async (userData) => {
    return dispatch(registerUser(userData));
  };

  const logout = () => {
    dispatch(logoutUser());
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
  };
};
```

### 5. Protected Route Component (`src/components/auth/ProtectedRoute.jsx`)

```javascript
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
```

### 6. Login Page Component (`src/pages/Login/Login.jsx`)

```javascript
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import LoginForm from '../../components/auth/LoginForm';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, error } = useAuth();
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data).unwrap();
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="login-card">
              <h2 className="login-title">Login to Your Account</h2>
              <p className="login-subtitle">
                Welcome back! Please login to your account.
              </p>
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <LoginForm onSubmit={onSubmit} loading={loading} />

              <div className="login-footer">
                <p>
                  Don't have an account?{' '}
                  <a href="/register">Register here</a>
                </p>
                <p>
                  <a href="/forgot-password">Forgot your password?</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
```

### 7. Login Form Component (`src/components/auth/LoginForm.jsx`)

```javascript
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const LoginForm = ({ onSubmit, loading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="login-form">
      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          id="email"
          {...register('email')}
          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
          placeholder="Enter your email"
        />
        {errors.email && (
          <div className="invalid-feedback">{errors.email.message}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          {...register('password')}
          className={`form-control ${errors.password ? 'is-invalid' : ''}`}
          placeholder="Enter your password"
        />
        {errors.password && (
          <div className="invalid-feedback">{errors.password.message}</div>
        )}
      </div>

      <div className="form-group form-check">
        <input
          type="checkbox"
          className="form-check-input"
          id="rememberMe"
          {...register('rememberMe')}
        />
        <label className="form-check-label" htmlFor="rememberMe">
          Remember me
        </label>
      </div>

      <button
        type="submit"
        className="btn btn-primary w-100"
        disabled={loading}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};

export default LoginForm;
```

### 8. Register Page Component (`src/pages/Register/Register.jsx`)

```javascript
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import RegisterForm from '../../components/auth/RegisterForm';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated, error } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await register(data).unwrap();
      navigate('/');
    } catch (err) {
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="register-card">
              <h2 className="register-title">Create Your Account</h2>
              <p className="register-subtitle">
                Join Edura and start your learning journey today.
              </p>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <RegisterForm onSubmit={onSubmit} loading={loading} />

              <div className="register-footer">
                <p>
                  Already have an account? <a href="/login">Login here</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
```

### 9. Register Form Component (`src/components/auth/RegisterForm.jsx`)

```javascript
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
  agreeToTerms: yup
    .boolean()
    .oneOf([true], 'You must agree to the terms and conditions'),
});

const RegisterForm = ({ onSubmit, loading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="register-form">
      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              {...register('firstName')}
              className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
              placeholder="Enter your first name"
            />
            {errors.firstName && (
              <div className="invalid-feedback">
                {errors.firstName.message}
              </div>
            )}
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              {...register('lastName')}
              className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
              placeholder="Enter your last name"
            />
            {errors.lastName && (
              <div className="invalid-feedback">{errors.lastName.message}</div>
            )}
          </div>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          id="email"
          {...register('email')}
          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
          placeholder="Enter your email"
        />
        {errors.email && (
          <div className="invalid-feedback">{errors.email.message}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          {...register('password')}
          className={`form-control ${errors.password ? 'is-invalid' : ''}`}
          placeholder="Create a password"
        />
        {errors.password && (
          <div className="invalid-feedback">{errors.password.message}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          {...register('confirmPassword')}
          className={`form-control ${
            errors.confirmPassword ? 'is-invalid' : ''
          }`}
          placeholder="Confirm your password"
        />
        {errors.confirmPassword && (
          <div className="invalid-feedback">
            {errors.confirmPassword.message}
          </div>
        )}
      </div>

      <div className="form-group form-check">
        <input
          type="checkbox"
          className="form-check-input"
          id="agreeToTerms"
          {...register('agreeToTerms')}
        />
        <label className="form-check-label" htmlFor="agreeToTerms">
          I agree to the{' '}
          <a href="/terms" target="_blank">
            Terms and Conditions
          </a>{' '}
          and{' '}
          <a href="/privacy" target="_blank">
            Privacy Policy
          </a>
        </label>
        {errors.agreeToTerms && (
          <div className="text-danger small">{errors.agreeToTerms.message}</div>
        )}
      </div>

      <button
        type="submit"
        className="btn btn-primary w-100"
        disabled={loading}
      >
        {loading ? 'Creating Account...' : 'Create Account'}
      </button>
    </form>
  );
};

export default RegisterForm;
```

### 10. API Interceptor Setup (`src/services/api.js`)

```javascript
import axios from 'axios';
import authService from './authService';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await authService.refreshToken();
        const token = authService.getToken();
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        authService.logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
```

---

## Routing Setup

### App Router Configuration (`src/App.jsx`)

```javascript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import Home from './pages/Home/Home';
import Courses from './pages/Courses/Courses';
import CourseDetails from './pages/CourseDetails/CourseDetails';
import Instructors from './pages/Instructors/Instructors';
import InstructorDetails from './pages/InstructorDetails/InstructorDetails';
import Events from './pages/Events/Events';
import EventDetails from './pages/EventDetails/EventDetails';
import Blog from './pages/Blog/Blog';
import BlogDetails from './pages/BlogDetails/BlogDetails';
import Shop from './pages/Shop/Shop';
import Cart from './pages/Cart/Cart';
import Checkout from './pages/Checkout/Checkout';
import Contact from './pages/Contact/Contact';
import About from './pages/About/About';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Profile from './pages/Profile/Profile';
import NotFound from './pages/NotFound/NotFound';

// Layout
import Layout from './components/common/Layout/Layout';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetails />} />
            <Route path="/instructors" element={<Instructors />} />
            <Route path="/instructors/:id" element={<InstructorDetails />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogDetails />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
```

---

## State Management

### Course Slice Example (`src/store/slices/courseSlice.js`)

```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import courseService from '../../services/courseService';

const initialState = {
  courses: [],
  course: null,
  loading: false,
  error: null,
};

export const fetchCourses = createAsyncThunk(
  'courses/fetchAll',
  async (filters, { rejectWithValue }) => {
    try {
      const data = await courseService.getAllCourses(filters);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch courses');
    }
  }
);

export const fetchCourseById = createAsyncThunk(
  'courses/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await courseService.getCourseById(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch course');
    }
  }
);

const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    clearCourse: (state) => {
      state.course = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCourseById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.loading = false;
        state.course = action.payload;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCourse } = courseSlice.actions;
export default courseSlice.reducer;
```

---

## Component Architecture

### Header Component with Auth (`src/components/common/Header/Header.jsx`)

```javascript
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from '../../../hooks/useAuth';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container">
        <nav className="navbar">
          <div className="logo">
            <Link to="/">
              <img src="/assets/img/logo.svg" alt="Edura" />
            </Link>
          </div>
          
          <ul className="nav-menu">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/courses">Courses</Link></li>
            <li><Link to="/instructors">Instructors</Link></li>
            <li><Link to="/events">Events</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>

          <div className="header-actions">
            {isAuthenticated ? (
              <>
                <Link to="/cart" className="cart-icon">
                  <i className="fas fa-shopping-cart"></i>
                </Link>
                <div className="user-menu">
                  <span>{user?.firstName || user?.email}</span>
                  <div className="dropdown">
                    <Link to="/profile">Profile</Link>
                    <button onClick={handleLogout}>Logout</button>
                  </div>
                </div>
              </>
            ) : (
              <Link to="/login" className="btn-login">
                <i className="far fa-user"></i> Login / Register
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
```

---

## API Integration

### Course Service Example (`src/services/courseService.js`)

```javascript
import api from './api';

const courseService = {
  getAllCourses: async (filters = {}) => {
    const response = await api.get('/courses', { params: filters });
    return response.data;
  },

  getCourseById: async (id) => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },

  enrollInCourse: async (courseId) => {
    const response = await api.post(`/courses/${courseId}/enroll`);
    return response.data;
  },

  getUserCourses: async () => {
    const response = await api.get('/courses/my-courses');
    return response.data;
  },
};

export default courseService;
```

---

## Styling Approach

### Option 1: CSS Modules (Recommended)

CSS Modules are a CSS file in which all class names and animation names are scoped locally by default. This means you can write CSS normally, but the class names are automatically transformed to be unique, preventing style conflicts.

#### How CSS Modules Work

**1. File Naming Convention**
- CSS Modules files must end with `.module.css` (e.g., `Header.module.css`)
- This tells React's build tool (Create React App, Vite, etc.) to process the file as a CSS Module

**2. Automatic Class Name Scoping**
When you write CSS in a module file, the build tool automatically:
- Generates unique class names (e.g., `header` becomes `Header_header__abc123`)
- Creates a JavaScript object mapping original names to scoped names
- Ensures styles are scoped to the component that imports them

**3. Import and Usage**
```javascript
// Header.module.css
.header {
  background-color: var(--white-color);
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
}
```

```javascript
// Header.jsx
import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <nav className={styles.navbar}>
        <div className={styles.logo}>Edura</div>
      </nav>
    </header>
  );
};
```

**What happens behind the scenes:**
- `styles` is a JavaScript object: `{ header: 'Header_header__abc123', navbar: 'Header_navbar__def456', logo: 'Header_logo__ghi789' }`
- React renders: `<header class="Header_header__abc123">`
- The CSS file is transformed so `.header` becomes `.Header_header__abc123`

#### Key Benefits

1. **No Naming Conflicts**: Each component's styles are isolated
   ```javascript
   // Header.module.css
   .title { color: blue; }
   
   // Footer.module.css  
   .title { color: red; }  // No conflict! They're scoped separately
   ```

2. **Type Safety** (with TypeScript):
   ```typescript
   import styles from './Header.module.css';
   // TypeScript knows available class names: styles.header, styles.navbar, etc.
   ```

3. **Easy Refactoring**: Rename classes in CSS, and TypeScript/IDE will show errors if you forget to update JSX

4. **Composition**: Combine multiple classes easily
   ```javascript
   <div className={`${styles.header} ${styles.active}`}>
   // Or use a helper library
   <div className={classNames(styles.header, { [styles.active]: isActive })}>
   ```

#### Advanced Usage

**Composition with `composes`:**
```css
/* Button.module.css */
.base {
  padding: 10px 20px;
  border: none;
  cursor: pointer;
}

.primary {
  composes: base;
  background-color: blue;
  color: white;
}
```

**Global Styles (when needed):**
```css
/* Header.module.css */
:global(.global-class) {
  /* This won't be scoped */
}

/* Or use :global() wrapper */
:global {
  .some-global-style {
    color: red;
  }
}
```

**Dynamic Class Names:**
```javascript
const Header = ({ isScrolled }) => {
  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      {/* Or use conditional logic */}
      <nav className={styles.navbar}>
        <div className={[styles.logo, styles.bold].join(' ')}>Edura</div>
      </nav>
    </header>
  );
};
```

#### Setup Requirements

**Create React App**: CSS Modules work out of the box, no configuration needed!

**Vite**: Also works automatically with `.module.css` files

**Custom Webpack Setup**: Requires CSS Modules loader configuration (usually already included)

#### Comparison with Regular CSS

| Regular CSS | CSS Modules |
|------------|-------------|
| Global scope (all styles affect entire app) | Local scope (styles scoped to component) |
| Risk of naming conflicts | No naming conflicts |
| Hard to track which styles are used | Easy to see imports and usage |
| No IDE autocomplete for class names | IDE autocomplete available |

#### Best Practices

1. **One module per component**: Keep CSS Modules co-located with components
   ```
   components/
     Header/
       Header.jsx
       Header.module.css
   ```

2. **Use descriptive class names**: Even though they're scoped, clear names help readability
   ```css
   /* Good */
   .navigation-menu { }
   
   /* Less clear */
   .menu { }
   ```

3. **Combine with CSS Variables**: Use CSS custom properties for theming
   ```css
   .header {
     background-color: var(--white-color);
     padding: var(--spacing-md);
   }
   ```

4. **Use camelCase or kebab-case**: Both work, but be consistent
   ```css
   /* Both are valid */
   .navBar { }
   .nav-bar { }
   ```

### Option 2: Styled Components

```bash
npm install styled-components
```

```javascript
import styled from 'styled-components';

const Header = styled.header`
  background-color: var(--white-color);
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;
```

### Option 3: Keep Original CSS (Quick Migration)

Copy the original CSS files and import them globally:

```javascript
// src/index.js
import './styles/style.css';
import './styles/app.min.css';
```

---

## CSS File Structure Analysis

Based on `html-app/assets/css/style.css`, here's the structure and how to organize it in React:

### Original CSS File Structure

The `style.css` file (26,600+ lines) follows this organization:

#### 1. **SASS Imports & CSS Variables** (Lines 1-24)
```css
@use "sass:math";
:root {
  --theme-color: #107507;
  --theme-color2: #f20f10;
  --title-color: #0f2239;
  --body-color: #4d5765;
  --smoke-color: #f3f7fb;
  --black-color: #000000;
  --white-color: #ffffff;
  --light-color: #72849b;
  --yellow-color: #ffb539;
  --success-color: #28a745;
  --error-color: #dc3545;
  --border-color: #ecf1f9;
  --title-font: "Jost", sans-serif;
  --body-font: "Roboto", sans-serif;
  --icon-font: "Font Awesome 6 Pro";
  --main-container: 1380px;
  --container-gutters: 24px;
  --section-space: 120px;
  --section-space-mobile: 80px;
  --section-title-space: 70px;
  --ripple-ani-duration: 5s;
}
```

#### 2. **Base/Reset Styles** (Lines 25-600)
- HTML/body resets
- Scrollbar styling
- Image, iframe, table defaults
- Link and button resets
- Focus states
- Typography base styles (h1-h6, p, lists)

#### 3. **Typography** (Lines 176-600)
- Heading styles (.h1 through .h6)
- Paragraph styles
- Link styles
- Responsive typography with media queries

#### 4. **WordPress Block Styles** (Lines 300-750)
- `.wp-block-*` classes
- Gallery styles
- Button blocks
- Search blocks
- Table blocks
- Cover blocks

#### 5. **Form Elements** (Lines 900-1200)
- `.form-control`, `.form-select`
- Input styles (text, date, email, etc.)
- Textarea styles
- Form groups with icons
- Placeholder styles
- Validation states

#### 6. **Component Styles** (Lines 1200+)

**Header Components:**
- `.th-header` - Main header container
- `.header-top` - Top bar
- `.header-logo` - Logo section
- `.header-menu` - Navigation menu
- `.header-button` - Header action buttons
- `.header-links` - Header links
- `.header-social` - Social media links
- `.sticky-wrapper` - Sticky header behavior

**Hero Sections:**
- `.hero-style1`, `.hero-style2`, etc.
- `.hero-subtitle`
- `.hero-text`
- `.hero-img1`, `.hero-img2`
- `.th-hero-bg` - Background images
- Hero animations and shapes

**Course Components:**
- `.course-card` - Course card container
- `.course-img` - Course image
- `.course-content` - Course content wrapper
- `.course-title` - Course title
- `.course-meta` - Course metadata
- `.course-price` - Pricing display
- `.course-tab` - Course tabs
- `.course-description` - Course details
- `.course-curriculam` - Curriculum section
- `.course-instructor` - Instructor section
- `.course-Reviews` - Reviews section

**Instructor Components:**
- `.instructor-card` - Instructor card
- `.instructor-img` - Instructor image
- `.instructor-name` - Name display
- `.instructor-title` - Job title
- `.instructor-meta` - Social links, ratings

**Blog Components:**
- `.blog-card` - Blog post card
- `.blog-img` - Blog image
- `.blog-content` - Blog content wrapper
- `.blog-meta` - Post metadata
- `.blog-title` - Post title
- `.blog-single` - Single post page
- `.blog-details` - Blog detail page

**Footer Components:**
- `.footer-widget` - Footer widget container
- `.widget_title` - Widget titles
- `.footer-bottom` - Footer bottom section
- `.footer-social` - Footer social links

**Other Components:**
- `.testimonial-card` - Testimonial cards
- `.cta-area` - Call-to-action sections
- `.about-section` - About page sections
- `.event-card` - Event cards
- `.sidebar` - Sidebar styles
- `.widget_*` - Various widget styles

#### 7. **Utility Classes** (Scattered throughout)
- `.th-btn` - Button styles
- `.icon-btn` - Icon buttons
- `.shape-mockup` - Decorative shapes
- Grid utilities (`.gy-30`, `.gx-10`, etc.)
- Spacing utilities

#### 8. **Animations & Keyframes** (Scattered)
- `@keyframes` definitions
- Animation classes
- Transition effects

#### 9. **Media Queries** (Throughout file)
- `@media (max-width: 1399px)`
- `@media (max-width: 1199px)`
- `@media (max-width: 991px)`
- `@media (max-width: 767px)`
- `@media (max-width: 575px)`
- `@media (max-width: 375px)`

### Recommended React CSS Organization

#### Structure 1: Global Styles + CSS Modules (Recommended)

```
src/
├── styles/
│   ├── variables.css        # CSS custom properties (:root variables)
│   ├── globals.css          # Global styles, resets, base elements
│   ├── typography.css       # Typography base styles (h1-h6, p, links)
│   ├── forms.css            # Form element styles (.form-control, .form-select)
│   ├── utilities.css        # Utility classes (.th-btn, spacing, layout)
│   └── animations.css       # Keyframes and animation utilities
│
├── components/
│   │
│   ├── Layout/
│   │   ├── Header/
│   │   │   ├── Header.jsx
│   │   │   ├── Header.module.css
│   │   │   ├── HeaderTop/
│   │   │   │   ├── HeaderTop.jsx
│   │   │   │   └── HeaderTop.module.css
│   │   │   ├── Navigation/
│   │   │   │   ├── Navigation.jsx
│   │   │   │   └── Navigation.module.css
│   │   │   └── MobileMenu/
│   │   │       ├── MobileMenu.jsx
│   │   │       └── MobileMenu.module.css
│   │   │
│   │   ├── Footer/
│   │   │   ├── Footer.jsx
│   │   │   ├── Footer.module.css
│   │   │   ├── FooterWidgets/
│   │   │   │   ├── FooterWidgets.jsx
│   │   │   │   └── FooterWidgets.module.css
│   │   │   └── FooterBottom/
│   │   │       ├── FooterBottom.jsx
│   │   │       └── FooterBottom.module.css
│   │   │
│   │   └── Sidebar/
│   │       ├── Sidebar.jsx
│   │       └── Sidebar.module.css
│   │
│   ├── Hero/
│   │   ├── Hero.jsx
│   │   ├── Hero.module.css
│   │   ├── HeroSlider/
│   │   │   ├── HeroSlider.jsx
│   │   │   └── HeroSlider.module.css
│   │   └── HeroSlide/
│   │       ├── HeroSlide.jsx
│   │       └── HeroSlide.module.css
│   │
│   ├── Courses/
│   │   ├── CourseCard/
│   │   │   ├── CourseCard.jsx
│   │   │   └── CourseCard.module.css
│   │   ├── CourseList/
│   │   │   ├── CourseList.jsx
│   │   │   └── CourseList.module.css
│   │   ├── CourseDetails/
│   │   │   ├── CourseDetails.jsx
│   │   │   ├── CourseDetails.module.css
│   │   │   ├── CourseDescription/
│   │   │   │   ├── CourseDescription.jsx
│   │   │   │   └── CourseDescription.module.css
│   │   │   ├── CourseCurriculum/
│   │   │   │   ├── CourseCurriculum.jsx
│   │   │   │   └── CourseCurriculum.module.css
│   │   │   ├── CourseInstructor/
│   │   │   │   ├── CourseInstructor.jsx
│   │   │   │   └── CourseInstructor.module.css
│   │   │   └── CourseReviews/
│   │   │       ├── CourseReviews.jsx
│   │   │       └── CourseReviews.module.css
│   │   ├── CourseTabs/
│   │   │   ├── CourseTabs.jsx
│   │   │   └── CourseTabs.module.css
│   │   └── CourseFilter/
│   │       ├── CourseFilter.jsx
│   │       └── CourseFilter.module.css
│   │
│   ├── Instructors/
│   │   ├── InstructorCard/
│   │   │   ├── InstructorCard.jsx
│   │   │   └── InstructorCard.module.css
│   │   ├── InstructorList/
│   │   │   ├── InstructorList.jsx
│   │   │   └── InstructorList.module.css
│   │   └── InstructorDetails/
│   │       ├── InstructorDetails.jsx
│   │       └── InstructorDetails.module.css
│   │
│   ├── Blog/
│   │   ├── BlogCard/
│   │   │   ├── BlogCard.jsx
│   │   │   └── BlogCard.module.css
│   │   ├── BlogList/
│   │   │   ├── BlogList.jsx
│   │   │   └── BlogList.module.css
│   │   ├── BlogDetails/
│   │   │   ├── BlogDetails.jsx
│   │   │   ├── BlogDetails.module.css
│   │   │   ├── BlogContent/
│   │   │   │   ├── BlogContent.jsx
│   │   │   │   └── BlogContent.module.css
│   │   │   └── BlogMeta/
│   │   │       ├── BlogMeta.jsx
│   │   │       └── BlogMeta.module.css
│   │   └── BlogSidebar/
│   │       ├── BlogSidebar.jsx
│   │       └── BlogSidebar.module.css
│   │
│   ├── Events/
│   │   ├── EventCard/
│   │   │   ├── EventCard.jsx
│   │   │   └── EventCard.module.css
│   │   ├── EventList/
│   │   │   ├── EventList.jsx
│   │   │   └── EventList.module.css
│   │   └── EventDetails/
│   │       ├── EventDetails.jsx
│   │       └── EventDetails.module.css
│   │
│   ├── Shop/
│   │   ├── ProductCard/
│   │   │   ├── ProductCard.jsx
│   │   │   └── ProductCard.module.css
│   │   ├── Cart/
│   │   │   ├── Cart.jsx
│   │   │   ├── Cart.module.css
│   │   │   ├── CartItem/
│   │   │   │   ├── CartItem.jsx
│   │   │   │   └── CartItem.module.css
│   │   │   └── CartSummary/
│   │   │       ├── CartSummary.jsx
│   │   │       └── CartSummary.module.css
│   │   ├── Checkout/
│   │   │   ├── Checkout.jsx
│   │   │   └── Checkout.module.css
│   │   └── Wishlist/
│   │       ├── Wishlist.jsx
│   │       └── Wishlist.module.css
│   │
│   ├── Common/
│   │   ├── Button/
│   │   │   ├── Button.jsx
│   │   │   └── Button.module.css
│   │   ├── TestimonialCard/
│   │   │   ├── TestimonialCard.jsx
│   │   │   └── TestimonialCard.module.css
│   │   ├── CTA/
│   │   │   ├── CTA.jsx
│   │   │   └── CTA.module.css
│   │   ├── SectionTitle/
│   │   │   ├── SectionTitle.jsx
│   │   │   └── SectionTitle.module.css
│   │   ├── Breadcrumb/
│   │   │   ├── Breadcrumb.jsx
│   │   │   └── Breadcrumb.module.css
│   │   ├── Pagination/
│   │   │   ├── Pagination.jsx
│   │   │   └── Pagination.module.css
│   │   ├── SearchBar/
│   │   │   ├── SearchBar.jsx
│   │   │   └── SearchBar.module.css
│   │   ├── SocialLinks/
│   │   │   ├── SocialLinks.jsx
│   │   │   └── SocialLinks.module.css
│   │   ├── Rating/
│   │   │   ├── Rating.jsx
│   │   │   └── Rating.module.css
│   │   ├── Price/
│   │   │   ├── Price.jsx
│   │   │   └── Price.module.css
│   │   ├── Badge/
│   │   │   ├── Badge.jsx
│   │   │   └── Badge.module.css
│   │   ├── Modal/
│   │   │   ├── Modal.jsx
│   │   │   └── Modal.module.css
│   │   ├── Loading/
│   │   │   ├── Loading.jsx
│   │   │   └── Loading.module.css
│   │   └── ErrorBoundary/
│   │       ├── ErrorBoundary.jsx
│   │       └── ErrorBoundary.module.css
│   │
│   ├── Forms/
│   │   ├── Input/
│   │   │   ├── Input.jsx
│   │   │   └── Input.module.css
│   │   ├── Textarea/
│   │   │   ├── Textarea.jsx
│   │   │   └── Textarea.module.css
│   │   ├── Select/
│   │   │   ├── Select.jsx
│   │   │   └── Select.module.css
│   │   ├── Checkbox/
│   │   │   ├── Checkbox.jsx
│   │   │   └── Checkbox.module.css
│   │   ├── Radio/
│   │   │   ├── Radio.jsx
│   │   │   └── Radio.module.css
│   │   ├── FormGroup/
│   │   │   ├── FormGroup.jsx
│   │   │   └── FormGroup.module.css
│   │   └── ContactForm/
│   │       ├── ContactForm.jsx
│   │       └── ContactForm.module.css
│   │
│   ├── Widgets/
│   │   ├── Widget/
│   │   │   ├── Widget.jsx
│   │   │   └── Widget.module.css
│   │   ├── CategoriesWidget/
│   │   │   ├── CategoriesWidget.jsx
│   │   │   └── CategoriesWidget.module.css
│   │   ├── RecentPostsWidget/
│   │   │   ├── RecentPostsWidget.jsx
│   │   │   └── RecentPostsWidget.module.css
│   │   ├── TagsWidget/
│   │   │   ├── TagsWidget.jsx
│   │   │   └── TagsWidget.module.css
│   │   ├── SearchWidget/
│   │   │   ├── SearchWidget.jsx
│   │   │   └── SearchWidget.module.css
│   │   └── NewsletterWidget/
│   │       ├── NewsletterWidget.jsx
│   │       └── NewsletterWidget.module.css
│   │
│   └── Pages/
│       ├── Home/
│       │   ├── Home.jsx
│       │   └── Home.module.css
│       ├── About/
│       │   ├── About.jsx
│       │   └── About.module.css
│       ├── Contact/
│       │   ├── Contact.jsx
│       │   └── Contact.module.css
│       ├── Gallery/
│       │   ├── Gallery.jsx
│       │   └── Gallery.module.css
│       └── Error/
│           ├── Error.jsx
│           └── Error.module.css
│
├── pages/
│   ├── HomePage.jsx
│   ├── CoursesPage.jsx
│   ├── CourseDetailsPage.jsx
│   ├── InstructorsPage.jsx
│   ├── InstructorDetailsPage.jsx
│   ├── BlogPage.jsx
│   ├── BlogDetailsPage.jsx
│   ├── EventsPage.jsx
│   ├── EventDetailsPage.jsx
│   ├── ShopPage.jsx
│   ├── ProductDetailsPage.jsx
│   ├── CartPage.jsx
│   ├── CheckoutPage.jsx
│   ├── WishlistPage.jsx
│   ├── AboutPage.jsx
│   ├── ContactPage.jsx
│   ├── GalleryPage.jsx
│   └── ErrorPage.jsx
│
└── App.jsx
```

#### Structure Explanation

**`styles/` Directory:**
- **`variables.css`**: Contains all CSS custom properties (`:root` variables) from the original `style.css`. These are global and used throughout the application.
- **`globals.css`**: Base HTML element styles, resets, scrollbar styling, and global utilities.
- **`typography.css`**: Typography base styles for headings (h1-h6), paragraphs, links, and text utilities.
- **`forms.css`**: Shared form element styles (`.form-control`, `.form-select`, `.form-group`) that can be used across multiple components.
- **`utilities.css`**: Reusable utility classes like `.th-btn`, spacing utilities (`.gy-30`, `.gx-10`), and layout helpers.
- **`animations.css`**: Keyframe animations (`@keyframes`) and animation utility classes.

**`components/` Directory Organization:**

1. **Layout Components** (`Layout/`): Site-wide layout components
   - `Header/`: Main header with sub-components (HeaderTop, Navigation, MobileMenu)
   - `Footer/`: Footer with widgets and bottom section
   - `Sidebar/`: Reusable sidebar component

2. **Feature Components** (`Courses/`, `Instructors/`, `Blog/`, `Events/`, `Shop/`): Domain-specific components
   - Each feature has its own directory with Card, List, and Details components
   - Sub-components are nested within their parent feature directory

3. **Common Components** (`Common/`): Reusable UI components used across the app
   - Buttons, Cards, CTAs, Breadcrumbs, Pagination, etc.
   - These are shared across multiple pages

4. **Forms** (`Forms/`): Form-related components
   - Individual form elements (Input, Textarea, Select)
   - Complete forms (ContactForm)

5. **Widgets** (`Widgets/`): Sidebar and footer widgets
   - Categories, Recent Posts, Tags, Search, Newsletter widgets

6. **Pages** (`Pages/`): Page-specific components
   - Components that are specific to a single page

**CSS Module Naming Convention:**
- Each component has its own `.module.css` file
- CSS Modules are scoped to the component
- Use CSS variables from `variables.css` for theming
- Media queries are co-located within each module file

**Import Order in `src/index.js`:**
```javascript
// 1. CSS Variables (must be first)
import './styles/variables.css';

// 2. Global/Base Styles
import './styles/globals.css';
import './styles/typography.css';

// 3. Shared Component Styles
import './styles/forms.css';
import './styles/utilities.css';
import './styles/animations.css';

// 4. React App
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Component CSS Modules are imported in their respective component files
```

**globals.css** (Extract from original):
```css
/* CSS Variables */
@use "sass:math";
:root {
  --theme-color: #107507;
  --theme-color2: #f20f10;
  --title-color: #0f2239;
  --body-color: #4d5765;
  /* ... all other variables ... */
}

/* Base/Reset Styles */
html, body {
  scroll-behavior: auto !important;
}

body {
  font-family: var(--title-font);
  font-size: 16px;
  font-weight: 400;
  color: var(--body-color);
  line-height: 26px;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

/* Scrollbar Styles */
body::-webkit-scrollbar {
  width: 10px;
  height: 10px;
  border-radius: 20px;
}
/* ... */

/* Typography Base */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--title-font);
  color: var(--title-color);
  font-weight: 700;
  line-height: 1.4;
  margin: 0 0 15px 0;
}
/* ... */

/* Links */
a {
  color: var(--theme-color);
  text-decoration: none;
  transition: all ease 0.4s;
}
a:hover {
  color: var(--title-color);
}
```

**Example: Header Component CSS Migration**

**Original CSS** (from `style.css`):
```css
/* Lines ~5000-5500 in style.css */
.th-header {
  position: relative;
  z-index: 999;
}
.header-top {
  background-color: var(--title-color);
  padding: 12px 0;
}
.header-logo {
  padding-top: 20px;
  padding-bottom: 20px;
}
.header-menu ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}
.header-menu li {
  display: inline-block;
  position: relative;
}
.header-button {
  height: 100%;
  display: flex;
  align-items: center;
  gap: 15px;
}
@media (max-width: 991px) {
  .header-menu {
    display: none;
  }
}
```

**Migrated to `Header.module.css`:**
```css
/* components/Layout/Header/Header.module.css */
.header {
  position: relative;
  z-index: 999;
  background-color: var(--white-color);
}

.topBar {
  background-color: var(--title-color);
  padding: 12px 0;
}

.logo {
  padding-top: 20px;
  padding-bottom: 20px;
}

.menu {
  margin: 0;
  padding: 0;
  list-style-type: none;
  display: flex;
  gap: 2rem;
}

.menuItem {
  display: inline-block;
  position: relative;
}

.buttonGroup {
  height: 100%;
  display: flex;
  align-items: center;
  gap: 15px;
  margin-left: 15px;
}

@media (max-width: 991px) {
  .menu {
    display: none;
  }
  
  .buttonGroup {
    flex-direction: column;
    gap: 10px;
  }
}
```

**Usage in `Header.jsx`:**
```javascript
// components/Layout/Header/Header.jsx
import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.topBar}>
        {/* Header top content */}
      </div>
      <div className={styles.logo}>
        {/* Logo */}
      </div>
      <nav>
        <ul className={styles.menu}>
          <li className={styles.menuItem}>Home</li>
          <li className={styles.menuItem}>Courses</li>
        </ul>
      </nav>
      <div className={styles.buttonGroup}>
        {/* Action buttons */}
      </div>
    </header>
  );
};
```

**Example: CourseCard Component CSS Migration**

**Original CSS** (from `style.css`):
```css
/* Lines ~15000-16000 in style.css */
.course-card {
  background-color: var(--white-color);
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.4s;
}
.course-img {
  position: relative;
  overflow: hidden;
}
.course-content {
  padding: 30px;
}
.course-title {
  font-size: 22px;
  margin-bottom: 15px;
}
.course-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}
.course-price {
  font-size: 24px;
  color: var(--theme-color);
  font-weight: 700;
}
```

**Migrated to `CourseCard.module.css`:**
```css
/* components/Courses/CourseCard/CourseCard.module.css */
.card {
  background-color: var(--white-color);
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.4s;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
}

.image {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 250px;
}

.image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s;
}

.card:hover .image img {
  transform: scale(1.1);
}

.content {
  padding: 30px;
}

.title {
  font-size: 22px;
  margin-bottom: 15px;
  color: var(--title-color);
  font-family: var(--title-font);
}

.meta {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.metaItem {
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--body-color);
  font-size: 14px;
}

.price {
  font-size: 24px;
  color: var(--theme-color);
  font-weight: 700;
  margin-top: 15px;
}

@media (max-width: 767px) {
  .content {
    padding: 20px;
  }
  
  .title {
    font-size: 18px;
  }
  
  .price {
    font-size: 20px;
  }
}
```

**Usage in `CourseCard.jsx`:**
```javascript
// components/Courses/CourseCard/CourseCard.jsx
import styles from './CourseCard.module.css';

const CourseCard = ({ course }) => {
  return (
    <div className={styles.card}>
      <div className={styles.image}>
        <img src={course.image} alt={course.title} />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{course.title}</h3>
        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <i className="far fa-user"></i>
            {course.students} Students
          </span>
          <span className={styles.metaItem}>
            <i className="far fa-clock"></i>
            {course.duration}
          </span>
        </div>
        <div className={styles.price}>${course.price}</div>
      </div>
    </div>
  );
};
```

#### Structure 2: CSS Modules Only (Component-Scoped)

Extract component-specific styles into CSS Modules, keep shared styles in a global file:

```
src/
├── styles/
│   ├── variables.css        # Only CSS variables
│   └── reset.css            # Minimal reset
├── components/
│   ├── Header/
│   │   ├── Header.jsx
│   │   └── Header.module.css  # All header styles
│   └── ...
```

#### Structure 3: Theme-Based Organization

```
src/
├── styles/
│   ├── theme/
│   │   ├── variables.css    # CSS variables
│   │   ├── colors.css       # Color utilities
│   │   └── typography.css   # Typography scale
│   ├── base/
│   │   ├── reset.css
│   │   └── global.css
│   ├── components/
│   │   ├── buttons.css      # Shared button styles
│   │   ├── forms.css
│   │   └── cards.css
│   └── utilities/
│       ├── spacing.css
│       └── layout.css
├── components/
│   └── [Component]/[Component].module.css  # Component-specific
```

### Migration Strategy

#### Step 1: Extract CSS Variables
Create `src/styles/variables.css`:
```css
:root {
  /* Copy all :root variables from style.css */
  --theme-color: #107507;
  /* ... */
}
```

#### Step 2: Extract Base Styles
Create `src/styles/base.css`:
- HTML/body resets
- Typography base
- Link styles
- Image/iframe defaults

#### Step 3: Extract Shared Components
Create `src/styles/components/`:
- `buttons.css` - `.th-btn` styles
- `forms.css` - Form element styles
- `cards.css` - Shared card styles

#### Step 4: Create Component Modules
For each React component, create a corresponding `.module.css`:
- Extract component-specific styles from `style.css`
- Use CSS variables from `variables.css`
- Keep media queries co-located

#### Step 5: Import Order
```javascript
// src/index.js
import './styles/variables.css';      // 1. Variables first
import './styles/base.css';            // 2. Base styles
import './styles/components/buttons.css';  // 3. Shared components
import './styles/components/forms.css';
// Component CSS Modules are imported in their respective components
```

### Key CSS Classes to Extract

**Header:**
- `.th-header`, `.header-top`, `.header-logo`, `.header-menu`, `.header-button`

**Hero:**
- `.hero-style1`, `.hero-subtitle`, `.hero-text`, `.th-hero-bg`

**Course:**
- `.course-card`, `.course-img`, `.course-content`, `.course-title`, `.course-meta`, `.course-price`

**Instructor:**
- `.instructor-card`, `.instructor-img`, `.instructor-name`

**Blog:**
- `.blog-card`, `.blog-img`, `.blog-content`, `.blog-meta`, `.blog-title`

**Footer:**
- `.footer-widget`, `.widget_title`, `.footer-bottom`

**Buttons:**
- `.th-btn` (with variants: `.th-btn.style2`, `.th-btn.style3`, etc.)

**Forms:**
- `.form-control`, `.form-select`, `.form-group`

### CSS Variables Usage

All components should use CSS variables for theming:

```css
/* ✅ Good - Uses variables */
.header {
  background-color: var(--white-color);
  color: var(--title-color);
  padding: var(--section-space);
}

/* ❌ Bad - Hardcoded values */
.header {
  background-color: #ffffff;
  color: #0f2239;
  padding: 120px;
}
```

### Media Query Strategy

**Option A: Co-located** (Recommended for CSS Modules)
```css
/* Header.module.css */
.header {
  padding: 1rem;
}

@media (max-width: 991px) {
  .header {
    padding: 0.5rem;
  }
}
```

**Option B: Separate breakpoints file**
```css
/* styles/breakpoints.css */
@media (max-width: 991px) {
  :global(.header) {
    padding: 0.5rem;
  }
}
```

---

## Environment Variables

Create `.env` file:

```env
REACT_APP_API_BASE_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

---

## Migration Checklist

### Phase 1: Setup & Authentication
- [ ] Initialize React project
- [ ] Install dependencies
- [ ] Set up Redux store
- [ ] Implement authentication service
- [ ] Create login/register pages
- [ ] Implement protected routes
- [ ] Add auth to header component

### Phase 2: Core Pages
- [ ] Convert Home page
- [ ] Convert Courses listing page
- [ ] Convert Course details page
- [ ] Convert Instructors page
- [ ] Convert Events page
- [ ] Convert Blog page
- [ ] Convert Contact page
- [ ] Convert About page

### Phase 3: User Features
- [ ] Implement shopping cart
- [ ] Implement checkout flow
- [ ] Create user profile page
- [ ] Add course enrollment functionality
- [ ] Implement wishlist

### Phase 4: Styling & Polish
- [ ] Migrate CSS to CSS Modules or styled-components
- [ ] Ensure responsive design
- [ ] Add loading states
- [ ] Add error handling
- [ ] Optimize images and assets

### Phase 5: Testing & Deployment
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Test authentication flow
- [ ] Test protected routes
- [ ] Deploy to production

---

## Backend API Requirements

The React app expects a RESTful API with the following endpoints:

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout user

### Course Endpoints
- `GET /api/courses` - Get all courses (with filters)
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses/:id/enroll` - Enroll in course
- `GET /api/courses/my-courses` - Get user's enrolled courses

### User Endpoints
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

---

## Additional Considerations

1. **Token Storage**: Consider using httpOnly cookies for better security
2. **Password Reset**: Implement forgot password functionality
3. **Email Verification**: Add email verification on registration
4. **Social Login**: Consider adding Google/Facebook login
5. **Two-Factor Authentication**: Add 2FA for enhanced security
6. **Role-Based Access**: Implement admin/instructor/student roles
7. **File Uploads**: Add profile picture and course image uploads
8. **Search**: Implement search functionality for courses
9. **Filters**: Add advanced filtering for courses
10. **Pagination**: Implement pagination for course listings

---

## Resources

- [React Documentation](https://react.dev/)
- [React Router](https://reactrouter.com/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Hook Form](https://react-hook-form.com/)
- [Yup Validation](https://github.com/jquense/yup)
- [Axios](https://axios-http.com/)

---

## Notes

- This implementation uses Redux Toolkit for state management, but you can also use React Context API for smaller applications
- The authentication flow uses JWT tokens stored in localStorage. For production, consider using httpOnly cookies
- All API endpoints are examples and should be adjusted based on your backend implementation
- The styling approach can be customized based on your team's preferences
