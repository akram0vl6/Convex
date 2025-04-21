import { useState } from "react";
import "./Auth.css";
import Register from "../../components/Auth/Register";
import Login from "../../components/Auth/Login";
import {Routes, Route } from 'react-router-dom'

const Auth = () => {
//   const [isAuth, setIsAuth] = useState(true);
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
};

export default Auth;
