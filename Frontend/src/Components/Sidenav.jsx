import React, { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userLogout } from "../redux/slices/user/UserAuth.slice";
import { disconnectSocket } from "../redux/slices/user/SocketSlice";
import { IoSearch } from "react-icons/io5";
import { FiMessageSquare } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import { CiLogout } from "react-icons/ci";

const Sidenav = () => {
  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(userLogout());
    dispatch(disconnectSocket());
  };

  return (
    <>
      <aside className="h-screen  md:w-1/3 lg:w-1/4 md:block">
        <div className="h-screen sticky flex flex-col gap-2 p-1 sm:p-4 text-sm border-r-2 border-indigo-100 top-12">
          <h2 className="sm:pl-3 mb-4 text-2xl font-semibold">Chat</h2>
          <NavLink
            to="search"
            className={({ isActive, isPending }) =>
              isActive
                ? "flex items-center px-3 py-2.5 font-bold bg-white  text-indigo-900 border rounded-full"
                : "flex items-center px-3 py-2.5 font-semibold hover:text-indigo-900 hover:border hover:rounded-full"
            }
          >
            <span className=" hidden sm:block">Search</span>
            <IoSearch className="w-full size-6 block sm:hidden" />
          </NavLink>
          <NavLink
            to="messages"
            className={({ isActive, isPending }) =>
              isActive
                ? "flex  items-center px-3 py-2.5 font-bold bg-white  text-indigo-900 border rounded-full"
                : "flex  items-center px-3 py-2.5 font-semibold hover:text-indigo-900 hover:border hover:rounded-full"
            }
          >
            <span className=" hidden sm:block">Messages</span>
            <FiMessageSquare className="w-full size-6 block sm:hidden" />
          </NavLink>
          <NavLink
            to="profile"
            className={({ isActive, isPending }) =>
              isActive
                ? "flex items-center px-3 py-2.5 font-bold bg-white  text-indigo-900 border rounded-full"
                : "flex items-center px-3 py-2.5 font-semibold hover:text-indigo-900 hover:border hover:rounded-full"
            }
          >
            <span className=" hidden sm:block">Profile</span>
            <CgProfile className="w-full size-6 block sm:hidden" />
          </NavLink>
          <Link
            className="flex items-center px-3 py-2.5 font-semibold hover:text-indigo-900 hover:border hover:rounded-full"
            onClick={logoutHandler}
          >
            <span className=" hidden sm:block">Logout</span>
            <CiLogout className="w-full size-6 block sm:hidden" />
          </Link>
        </div>
      </aside>
    </>
  );
};

export default Sidenav;
