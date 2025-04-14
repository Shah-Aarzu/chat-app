import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userAuth } from "../redux/slices/user/UserAuth.slice";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { successNotification, errorNotification } from "../utils/Notifications";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, setLogin] = useState({
    username: "",
    password: "",
  });

  const loginHandler = (e) => {
    setLogin((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const formHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await dispatch(userAuth(login));

      successNotification(res.payload.data.message);

      if (res.payload.data.auth) {
        setTimeout(() => {
          navigate("/messages");
        }, 3500);
      }
    } catch (error) {
      errorNotification(error.message);
    }
  };
  return (
    <>
      <ToastContainer transition={Slide} />
      <section
        className=" min-h-screen bg-slate-900 dark:bg-gray-900 overflow-y-auto"
        
      >
        <div className="flex items-center justify-center px-6 py-8 mx-auto min-h-screen">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Login
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={formHandler}>
                <div>
                  <label
                    htmlFor="Username"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    id="Username"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Username"
                    required
                    onChange={loginHandler}
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                    onChange={loginHandler}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Login
                </button>
                <div className="text-center">
                  <input
                    type="button"
                    value="Forgot password?"
                    className="text-ce font-medium text-blue-600 hover:underline dark:text-blue-500"
                    onClick={() => {
                      navigate("/password-reset");
                    }}
                  />
                </div>
                <p className="text-sm text-center font-light text-gray-500 dark:text-gray-400">
                  Don’t have an account yet?{" "}
                  <Link
                    to={"/usersignup"}
                    className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                  >
                    Sign up
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
