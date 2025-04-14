import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { successNotification, errorNotification } from "../utils/Notifications";
import { IoLockClosedOutline } from "react-icons/io5";
import { resetPassword } from "../redux/slices/user/ResetPassword.slice";

const ForgetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const formHandler = async (e) => {
    e.preventDefault();

    try {
      if (newPassword === confirmNewPassword) {
        const res = await dispatch(resetPassword({ confirmNewPassword }));
        successNotification(res.payload.data.message);
        setTimeout(() => {
          navigate("/userlogin");
        }, 3500);
      } else {
        alert("Please enter the correct password.");
      }
    } catch (error) {
      errorNotification(error.message);
    }
  };
  return (
    <>
      <ToastContainer transition={Slide} />
      <section
        className=" min-h-screen bg-slate-900 dark:bg-gray-900"
       
      >
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto min-h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <div className="justify-self-center border border-black rounded-full p-6">
                <IoLockClosedOutline className=" text-5xl " />
              </div>
              <div className="text-center">
                {" "}
                <h2 className=" font-bold">Trouble logging in?</h2>
              </div>
              <form className="space-y-4 md:space-y-6" onSubmit={formHandler}>
                <div>
                  <input
                    type="password"
                    name="newpassword"
                    id="newpassword"
                    className="bg-gray-50 mb-5 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="New Password"
                    required
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                    }}
                  />

                  <input
                    type="password"
                    name="confirmnewpassword"
                    id="confirmnewpassword"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Confirm New Password"
                    required
                    value={confirmNewPassword}
                    onChange={(e) => {
                      setConfirmNewPassword(e.target.value);
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Change Password
                </button>
                <p className="text-sm text-center font-light text-gray-500 dark:text-gray-400">
                  <Link
                    to={"/usersignup"}
                    className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                  >
                    Create new account
                  </Link>
                </p>
                <div className="text-center">
                  <Link to={"/login"} className=" text-blue-400 underline">
                    Go To Back
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ForgetPassword;
