import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../redux/slices/user/GetUsers.slice";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { errorNotification } from "../utils/Notifications";
import { useNavigate } from "react-router-dom";
import emptyProfile from "../utils/Image/empty-profile.avif";
import {
  addUser,
  getMessages,
  removeUser,
} from "../redux/slices/user/Messages.slice";

const Search = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const users = useSelector((state) => state.users);

  const formHandler = async (e) => {
    e.preventDefault();

    try {
      dispatch(
        getUsers({
          search: e.target.value,
          token: localStorage.getItem("userToken"),
        })
      );
    } catch (error) {
      errorNotification(error.message);
    }
  };

  useEffect(() => {
    dispatch(getMessages({ token: localStorage.getItem("userToken") }));
  }, []);

  const messages = useSelector((state) => state.messages);

  return (
    <>
      <ToastContainer transition={Slide} />
      <nav className="bg-gray-100 bg-opacity-25 shadow border-b border-gray-400 overflow-auto">
        <div className="">
          <div className=" flex justify-center items-center h-16">
            <div className="w-2/3 sm:w-1/3">
              <div className=" w-full">
                <label htmlFor="search" className="sr-only">
                  Search
                </label>
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    id="search"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-400 rounded-md leading-5 bg-gray-100 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-blue-300 focus:shadow-outline-blue sm:text-sm transition duration-150 ease-in-out"
                    placeholder="Search"
                    type="search"
                    onChange={(e) => {
                      formHandler(e);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      {users.status == "loading" && (
        <div className="h-screen flex justify-center items-center">
          Loading...
        </div>
      )}
      {users.status == "failed" && (
        <div className="h-screen flex justify-center items-center">
          Check Your Internet Connection !!
        </div>
      )}
      {users.status == "succeeded" && (
        <>
          {users.users.length > 0 &&
            users.users.map((user) => {
              return (
                <div
                  key={user._id}
                  className=" px-5 sm:px-0 w-full  sm:w-1/3 mx-auto items-center overflow-auto"
                >
                  <div className="flex hover:cursor-pointer hover:bg-slate-200 justify-between px-3 py-1 bg-white items-center gap-1 rounded-lg border border-gray-100 my-3 overflow-auto">
                    <div className="relative w-16 h-16 rounded-full hover:bg-red-700 bg-gradient-to-r from-purple-400 via-blue-500 to-red-400 ">
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-gray-200 rounded-full border-2 border-white">
                        <img
                          className="w-full h-full object-cover rounded-full"
                          src={user.profile != "" ? user.profile : emptyProfile}
                          alt=""
                        />
                      </div>
                    </div>
                    <div>
                      <span className="font-mono">
                        <span className=" text-xl">{user.username}</span>
                      </span>
                    </div>
                    <div>
                      <span className="font-mono">
                        <span className=" text-xl">{user.fullname}</span>
                      </span>
                    </div>
                    <div>
                      <span className="font-mono">
                        {messages.messages.messages.some(
                          (item) => item.username === user.username
                        ) ? (
                          <button
                            onClick={async () => {
                              await dispatch(
                                removeUser({
                                  username: user.username,
                                  token: localStorage.getItem("userToken"),
                                })
                              );
                              await dispatch(
                                getMessages({
                                  token: localStorage.getItem("userToken"),
                                })
                              );
                            }}
                            className=" text-xl text-white px-5 py-1 rounded bg-red-500"
                          >
                            Remove
                          </button>
                        ) : (
                          <button
                            onClick={async () => {
                              await dispatch(
                                addUser({
                                  username: user.username,
                                  token: localStorage.getItem("userToken"),
                                })
                              );
                              await dispatch(
                                getMessages({
                                  token: localStorage.getItem("userToken"),
                                })
                              );
                            }}
                            className=" text-xl text-white px-5 py-1 rounded bg-blue-500"
                          >
                            Add
                          </button>
                        )}
                      </span>
                    </div>
                    {/* <div className="flex gap-2">
                      <button className="bg-blue-500 text-white rounded py-1 px-2">
                        Follow
                      </button>
                    </div> */}
                  </div>
                </div>
              );
            })}
          {users.users.length === 0 && (
            <div className="h-screen flex justify-center items-center">
              User Not Found !!
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Search;
