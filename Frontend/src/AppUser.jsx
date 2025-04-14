import React, { useEffect } from "react";
import Sidenav from "./Components/Sidenav";
import { Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setSocket } from "./redux/slices/user/SocketSlice";
import io from "socket.io-client";

const AppUser = () => {
  const dispatch = useDispatch();
  const userId =
    useSelector((state) => state.userAuth.userId) ||
    localStorage.getItem("userId");

  useEffect(() => {
    if (userId && localStorage.getItem("userToken") 
      // && !window.socket
    ) {
      const socket = io("http://localhost:3000", {
        query: { userId },
      });

      dispatch(setSocket(socket));
      //window.socket = socket;

      localStorage.setItem("userId", userId);
    }
  }, [userId, dispatch]);

  return (
    <div className=" h-screen overflow-hidden flex">
      <Sidenav />
      <div className=" relative w-full overflow-y-scroll">
        <Outlet />
      </div>
    </div>
  );
};

export default AppUser;
