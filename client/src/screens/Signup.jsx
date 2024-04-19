import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useCurrentUserContext } from "../contexts/CurrentUserContext";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    displayName: "",
  });
  const { setCurrentUser } = useCurrentUserContext();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (e.target.password.value !== e.target.confirmPassword.value) {
      // console.log(
      //   "password : ",
      //   e.target.password.value,
      //   "confirm pass : ",
      //   e.target.confirmPassword.value
      // );
      toast.error("Password and Confirm Password doesn't match!!");
    } else {
      try {
        const response = await axios.post("/api/auth/signup", formData);
        // console.log(response.data);
        if (response.status == 201) {
          toast.success(
            "User is created You will be redirected to the home page"
          );
          localStorage.setItem("chat-user", JSON.stringify(response.data));
          setCurrentUser(response.data);
        }
      } catch (error) {
        // console.error(error);
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="text-white text-md p-7 ">
      <form className="space-y-4 " onSubmit={handleSubmit}>
        <div className="">
          <label htmlFor="username">Email</label>
          <br />
          <input
            type="email"
            name="username"
            id="username"
            // value=""
            onChange={handleChange}
            placeholder="xyz@gmail.com"
            required
            minLength={5}
            maxLength={20}
            className="w-full text-black p-2 bg-transparent border-b-2 border-b-black/50  focus:outline-none focus:border-b-2 focus:border-b-emerald-400 "
          />
        </div>
        <div className="">
          <label htmlFor="displayName">Display Name</label>
          <br />
          <input
            type="text"
            name="displayName"
            id="displayName"
            // value=""
            onChange={handleChange}
            placeholder="John Doe"
            required
            minLength={5}
            maxLength={20}
            className="w-full text-black p-2 bg-transparent border-b-2 border-b-black/50  focus:outline-none focus:border-b-2 focus:border-b-emerald-400 "
          />
        </div>
        <div className="">
          <label htmlFor="password">Password</label>
          <br />
          <input
            type="password"
            name="password"
            id="password"
            // value=""
            onChange={handleChange}
            placeholder="*****"
            required
            minLength={5}
            maxLength={20}
            className="w-full text-black p-2 bg-transparent border-b-2 border-b-black/50  focus:outline-none focus:border-b-2 focus:border-b-emerald-400 "
          />
        </div>
        <div className="">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <br />
          <input
            type="text"
            name="confirmPassword"
            id="confirmPassword"
            // value=""
            onChange={handleChange}
            placeholder="*****"
            required
            minLength={5}
            maxLength={20}
            className="w-full text-black p-2 bg-transparent border-b-2 border-b-black/50  focus:outline-none focus:border-b-2 focus:border-b-emerald-400 "
          />
        </div>
        <div className="text-center space-y-2">
          <button
            className="rounded-lg bg-blue-500 hover:bg-blue-600  px-3 py-2"
            type="submit"
          >
            SIGNUP
          </button>
        </div>
        <div className="text-base text-center">
          <p>
            Already have an Account ?{" "}
            <Link
              className="text-amber-400 font-semibold hover:text-amber-500"
              to="/login"
            >
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Signup;
