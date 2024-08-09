// src/page/PrivateRoute.js

import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../utility/auth';

const PrivateRoute = ({ element, redirectPath }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login' || location.pathname === '/signup';

  // Allow access to login and signup pages
  if (isLoginPage) {
    return element;
  }

  // Redirect to login if not authenticated
  return isAuthenticated() ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
