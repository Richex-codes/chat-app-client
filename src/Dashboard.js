// Dashboard.js
import { useState } from 'react';
import React from 'react';
import { useEffect } from 'react';
import Sidebar from './components/SideBar';
import ChatWindow from './components/ChatWindow';
import UserProfile from './components/UserProfile';
import io from 'socket.io-client';
import axios from 'axios';
import './dashboard.css';
import './chatwindow.css';
import './sidebar.css';
import './userprofile.css';
import './chatlist.css';

const Dashboard = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [user, setUser] = useState({});
  const [socket, setSocket] = useState()


  const handleChatItemClick = (username) => {
    setSelectedUser(username); // Set the selected user
    // Join the selected user's room
};
   // Fetch user data from API or local storage
   useEffect(() => {
    const fetchUserData = async () => {
        try {
            const response = await axios.get('http://localhost:3001/user');
            setUser(response.data.User);
        } catch (error) {
            console.error(error);
        }
    };
    fetchUserData();
}, []);

// socket.io connections
  useEffect(() => {
    const newSocket = io('http://localhost:3001/dashboard', {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax : 5000,
      reconnectionAttempts: Infinity,
      withCredentials: true,
    });
    
    newSocket.on('connect', () => {
      console.log('connected to /dashboard')
    })
    setSocket(newSocket)
    return () => newSocket.disconnect();
  }, []);

  return (
    <div className="dashboard">
<Sidebar handleChatItemClick={handleChatItemClick} user={user} socket={socket} />
{selectedUser && <ChatWindow selectedUser={selectedUser} socket={socket} user={user}/>}
      {/* <UserProfile /> */}
    </div>
  );
};

export default Dashboard;                                                 
