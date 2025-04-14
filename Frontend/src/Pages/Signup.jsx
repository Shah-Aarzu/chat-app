import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userData } from "../redux/slices/user/User.slice";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { successNotification, errorNotification } from "../utils/Notifications";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    profile: null,
    fullname: "",
    username: "",
    email: "",
    password: "",
  });

  const userHandler = (e) => {
    if (e.target.name === "profile") {
      setUser((prev) => {
        return { ...prev, [e.target.name]: e.target.files[0] };
      });
    } else {
      setUser((prev) => {
        return { ...prev, [e.target.name]: e.target.value.trim() };
      });
    }
  };

  const formHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("profile", user.profile);
    formData.append("fullname", user.fullname);
    formData.append("username", user.username);
    formData.append("email", user.email);
    formData.append("password", user.password);

    try {
      if (user.fullname && user.username && user.email && user.password) {
        if (user.fullname.length > 20)
          errorNotification("Fullname Should Be Maximum 20 Characters");
        else if (user.username.length > 10)
          errorNotification("Username Should Be Maximum 10 Characters");
        else if (user.email.length > 25)
          errorNotification("Email Should Be Maximum 25 Characters");
        else if (user.password.length > 15)
          errorNotification("Password Should Be Maximum 15 Characters");
        else {
          const res = await dispatch(userData(formData));

          successNotification(res.payload.data.message);

          if (res.payload.data.created) {
            setTimeout(() => {
              navigate("/");
            }, 3500);
          }
        }
      } else {
        errorNotification("field is required");
      }
    } catch (error) {
      errorNotification(error.message);
    }
  };

  return (
    <>
      <ToastContainer transition={Slide} />
      <section className="min-h-screen overflow-y-auto bg-slate-900 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Create an account
              </h1>
              <form
                className="space-y-4 md:space-y-6"
                encType="multipart/form-data"
                onSubmit={formHandler}
              >
                <div>
                  <label
                    htmlFor="repeat-password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Profile
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    name="profile"
                    id="profile"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    onChange={userHandler}
                  />
                </div>
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Full name *
                  </label>
                  <input
                    type="text"
                    name="fullname"
                    id="name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Name Surname"
                    required
                    onChange={userHandler}
                  />
                </div>

                <div>
                  <label
                    htmlFor="username"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Username *
                  </label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Username"
                    required
                    onChange={userHandler}
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    E-mail *
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="email@email.com"
                    required
                    onChange={userHandler}
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                    onChange={userHandler}
                  />
                </div>
                {/* <div>
                  <label
                    htmlFor="repeat-password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Bio
                  </label>
                  <input
                    type="text"
                    name="bio"
                    id="bio"
                    placeholder="bio"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    onChange={userHandler}
                  />
                </div> */}
                <button
                  type="submit"
                  className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Sign up
                </button>
                <p className="text-center text-sm font-light text-gray-500 dark:text-gray-400">
                  Already have an account?{" "}
                  <Link
                    to={"/login"}
                    className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                  >
                    Login
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

export default Signup;
