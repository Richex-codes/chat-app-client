import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const PrivateRoute = () => {
  const token = localStorage.getItem('token');
  let isTokenValid = false;

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Convert to seconds
      if (decodedToken.exp > currentTime) {
        isTokenValid = true;
      }
    } catch (error) {
      console.error('Invalid token:', error);
    }
  }

  return isTokenValid ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
