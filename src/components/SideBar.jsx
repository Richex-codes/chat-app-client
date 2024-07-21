import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Sidebar = ({
  handleChatItemClick,
  user,
  socket,
  handleClick,
  connectedUsers
}) => {
  const [potentialUsers, setPotentialUsers] = useState([]);
  const [usersOnline, setUsersOnline] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // get all users

  const fetchAndSetUsers = useCallback(async (onlineUsers = []) => {
    try {
      const response = await axios.get("http://localhost:3001/all");
      const allUsers = response.data.map((user) => ({
        ...user,
        online: onlineUsers.includes(user.username),
      }));
      setPotentialUsers(allUsers);
      console.log("Fetched and updated potential users:", allUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, []);

  useEffect(() => {
    fetchAndSetUsers([]);
  }, [fetchAndSetUsers]);

  // Handle receiving connected users and updating online status
  useEffect(() => {
    if (socket) {
      socket.on("connectedUsers", (onlineUsers) => {
        console.log("Online users received:", onlineUsers);
        setUsersOnline(onlineUsers);
        fetchAndSetUsers(onlineUsers);
      });

      return () => {
        socket.off("connectedUsers");
      };
    }
  }, [socket, fetchAndSetUsers]);

  // Update potential users with online status based on online users




  // remove current user from potential users list
  const filteredPusers = potentialUsers.filter((u) => {
    return u._id !== user._id;
  });

  // Filtered users based on search term
  const filteredUsers = connectedUsers.filter((u) => {
    return u.username.toLowerCase().includes(searchTerm.toLowerCase());
  });


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("messages"); // Remove username as well
    navigate("/login", { replace: true });
    console.log("Logging out...");
  };

  return (
    <div className="sidebar">
      <div className="profile">
        <h2>{user.name}</h2>
        <p>Senior Developer</p>
      </div>
      <div className="container-pchat">
        {filteredPusers.map((u, index) => {
          return (
            <div
              className={`oval-box ${u.online ? "online" : ""}`}
              key={index}
              onClick={() => handleClick(u, user)}
            >
              {u.username}
            </div>
          );
        })}
      </div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search Friends"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {}
      <div className="chat-list">
        {/* Dynamic list of connected users */}
        {filteredUsers.map((u, index) => (
          <div
            className="chat-item"
            key={index}
            onClick={() => handleChatItemClick(u.username, u._id)}
          >
            <p>{u.username}</p>
            <span>Message for {u.username}</span>
          </div>
        ))}
      </div>
      <div className="logout-button">
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Sidebar;
