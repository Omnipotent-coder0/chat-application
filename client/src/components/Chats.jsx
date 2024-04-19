import React, { useEffect, useState } from "react";
import axios from "axios";
import Avatar from "./Avatar";
import toast from "react-hot-toast";
import { FaSearch } from "react-icons/fa";
import { GiExitDoor } from "react-icons/gi";
import { useSelectedUserContext } from "../contexts/SelectedUserContext";
import { useCurrentUserContext } from "../contexts/CurrentUserContext";

const Chats = () => {
  const { setSelectedUser } = useSelectedUserContext();
  const { setCurrentUser } = useCurrentUserContext();
  const [users, setUsers] = useState([]);
  const [searchUsersArray, setSearchUsersArray] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  const handleExit = async () => {
    try {
      const response = await axios.post("/api/auth/logout");
      if (response.status == 200) {
        localStorage.removeItem("chat-user");
        localStorage.removeItem("chat-selected-user");
        toast.success("User is successfully logged out");
        setCurrentUser(null);
        setSelectedUser(null);
      }
    } catch (error) {
      // console.error(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const getSearchUsers = async () => {
      const currentUsersArray = users.filter((user) =>
        user.displayName.toLowerCase().includes(searchInput.toLowerCase())
      );
      setSearchUsersArray(currentUsersArray);
    };
    getSearchUsers();
    // console.log("search input : ", searchInput);
  }, [searchInput]);

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const response = await axios.get("/api/users");
        if (response.status === 200) {
          setUsers(response.data);
          setSearchUsersArray(response.data);
        }
      } catch (error) {
        localStorage.removeItem("chat-user");
        localStorage.removeItem("chat-selected-user");
        // console.error(error);
        toast.error(error.message);
        setSelectedUser(null);
        setCurrentUser(null);
      }
    };
    getAllUsers();
  }, []);

  return (
    <div className=" w-[15rem] border-r-2 p-5 border-gray-300/50 relative">
      <div className="flex items-center justify-around mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-[22vh] text-xs p-[3px] bg-transparent border-b-2 border-b-black/50  focus:outline-none focus:border-b-2 focus:border-b-emerald-400 "
        />
        <FaSearch size={13} className="hover:text-emerald-400 cursor-pointer" />
      </div>
      <div className=" h-4/5 overflow-auto">
        {searchUsersArray.map((user) => (
          <Avatar key={user._id} user={user} />
        ))}
      </div>

      <div className="text-red-700 font-bold absolute cursor-pointer bottom-3 left-3 hover:text-red-500 duration-200 p-2 bg-white/50 hover:bg-white rounded-full">
        <GiExitDoor onClick={handleExit} className="h-7 w-7 " />
      </div>
    </div>
  );
};

export default Chats;
