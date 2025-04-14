import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { successNotification, errorNotification } from "../utils/Notifications";
import { IoLockClosedOutline } from "react-icons/io5";
import { getOTP, sendOTP } from "../redux/slices/user/ResetPassword.slice";

const ForgetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [toggle, setToggle] = useState(false);
  const [otp, setOtp] = useState("");

  const formHandler = async (e) => {
    e.preventDefault();

    try {
      let res;
      if (!toggle) {
        res = await dispatch(getOTP({ email }));

        setToggle(res.payload.data.otpSend);
      } else {
        res = await dispatch(sendOTP({ email, otp }));

        if (res.payload.data.otpVerify) {
          setTimeout(() => {
            navigate("/newpassword");
          }, 3500);
        }
      }
      successNotification(res.payload.data.message);
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
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto min-h-screen">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <div className="justify-self-center border border-black rounded-full p-6">
                <IoLockClosedOutline className=" text-5xl " />
              </div>
              <div className="text-center">
                {" "}
                <h2 className=" font-bold">Trouble logging in?</h2>
                <p className=" mt-2 text-sm">
                  Enter your email and we'll send you a OTP to get back into
                  your account.
                </p>
              </div>
              <form className="space-y-4 md:space-y-6" onSubmit={formHandler}>
                <div>
                  {toggle ? (
                    <input
                      type="number"
                      name="otp"
                      id="otp"
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="OTP"
                      required
                      value={otp}
                      onChange={(e) => {
                        setOtp(e.target.value);
                      }}
                    />
                  ) : (
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                    />
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  {toggle ? "Send OTP" : "Get OTP"}
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
