// src/index.js

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import Home from "./page/Home";
import Menu from "./page/Menu";
import About from "./page/About";
import Login from "./page/Login";
import Newproduct from "./page/NewProduct";
import Signup from "./page/Signup";
import Cart from "./page/Cart";
import Success from "./page/Success";
import Cancel from "./page/Cancel";
import PrivateRoute from "./page/privateroute"; // Import PrivateRoute
import { store } from "./redux/index";
import { Provider } from "react-redux";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Home />} />
      <Route path="about" element={<About />} />
      <Route path="login" element={<Login/>} />
      <Route path="signup" element={<PrivateRoute element={<Signup />} />} />
      <Route path="newproduct" element={<PrivateRoute element={<Newproduct />} />} />
      <Route path="cart" element={<Cart />} />
      <Route path="success" element={<Success />} />
      <Route path="cancel" element={<Cancel />} />
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);

reportWebVitals();
