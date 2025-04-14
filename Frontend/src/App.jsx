import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AppUser from "./AppUser.jsx";
import Search from "./Pages/Search.jsx";
import Messages from "./Pages/Messages.jsx";
import Login from "./Pages/Login.jsx";
import Signup from "./Pages/Signup.jsx";
import PageNotFound from "./Pages/PageNotFound.jsx";
import { useSelector } from "react-redux";
import UpdateProfile from "./Pages/UpdateProfile.jsx";
import ForgetPassword from "./Pages/ForgetPassword.jsx";
import ResetPassword from "./Pages/ResetPassword.jsx";

const App = () => {
  const userAuth = useSelector((state) => state.userAuth.userAuth);

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/usersignup" element={<Signup />} />
        <Route path="/password-reset" element={<ForgetPassword />} />
        <Route path="/newpassword" element={<ResetPassword />} />
        <Route
          path="/"
          element={userAuth === true ? <AppUser /> : <Navigate to="/login" />}
        >
          <Route index path="/messages" element={<Messages />} />
          <Route path="/messages/:username" element={<Messages />} />
          <Route path="/search" element={<Search />} />
          <Route path="/profile" element={<UpdateProfile />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
};

export default App;
