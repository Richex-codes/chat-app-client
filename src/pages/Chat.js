import { useState, useEffect } from "react";
import React from "react";
import Sidebar from "../components/SideBar";
import ChatWindow from "../components/ChatWindow";
import io from "socket.io-client";
import axios from "axios";
import "../styles/dashboard.css";
import "../styles/chatwindow.css";
import "../styles/sidebar.css";
import "../styles/chatlist.css";

const Dashboard = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [refresh, setRefresh] = useState(null);
  // const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  // const [selectedUserInfo, setSelectedUserInfo] = useState(null);
  const [newChat, setNewChat] = useState(null);
  const [userChat, setUserChat] = useState([]);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [user, setUser] = useState({});
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState({});
  const [msg, setMsg] = useState("");
  const [typing, setTyping] = useState(false);
  const [userTyping, setUserTyping] = useState("");

  // get messages
  useEffect(() => {
    const getMessages = async () => {
      if (selectedChat) {
        try {
          const response = await axios.get(
            `http://localhost:3001/message/${selectedChat}`
          );

          // Assuming response.data is an array of message objects
          const formattedMessages = response.data.reduce((acc, msg) => {
            const { chatId, senderId, text, createdAt } = msg;
            const message = {
              sender: senderId,
              message: text,
              time: new Date(createdAt).toLocaleTimeString(),
            };

            if (!acc[chatId]) {
              acc[chatId] = [];
            }
            acc[chatId].push(message);
            return acc;
          }, {});

          setMessages(formattedMessages);

          console.log("messages", formattedMessages);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      }
    };
    getMessages();
  }, [selectedChat]);

  // Function to update messages state
  const updateMessages = (chatId, newMessage) => {
    setMessages((prevMessages) => {
      const chatMessages = prevMessages[chatId] || [];
      return {
        ...prevMessages,
        [chatId]: [...chatMessages, newMessage],
      };
    });
  };

  const handleChatItemClick = async (username, id) => {
    setSelectedUser(username);
    // setSelectedUserId(id);
    try {
      const response = await axios.get(
        `http://localhost:3001/chat/find/${user._id}/${id}`
      );
      setSelectedChat(response.data._id);
      // You can set the chat data or update the state as needed
    } catch (error) {
      console.error("Error fetching chat:", error);
    }
  };

  // set selected userInfo
  // useEffect(() => {
  //   const userInfo = async () => {
  //     try {
  //       const response = await axios.get(
  //         `http://localhost:3001/find/${selectedUserId}`
  //       );
  //       setSelectedUserInfo(response.data);
  //     } catch (error) {
  //       console.error("Error fetching user info:", error);
  //     }
  //   };
  //   userInfo();
  // }, [selectedUserId]);

  // get user chat
  useEffect(() => {
    const fetchUserChat = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/chat/${user._id}`
        );
        setUserChat(response.data);
        // console.log("chats", response.data);
      } catch (error) {
        console.error("Error fetching user chat:", error);
      }
    };
    fetchUserChat();
  }, [user._id, newChat, refresh]);

  // set connected users
  useEffect(() => {
    const fetchConnectedUsers = async () => {
      if (userChat && userChat.length > 0) {
        const recipients = userChat
          .map((chat) => {
            if (chat && chat.members) {
              return chat.members.find((u) => u !== user._id);
            }
            return null; // Handle the case where chat or chat.members is null
          })
          .filter(Boolean); // Filter out null values

        try {
          // Fetch data for each recipient
          const promises = recipients.map((id) =>
            axios.get(`http://localhost:3001/find/${id}`)
          );
          const responses = await Promise.all(promises);
          const newUsers = responses.map((response) => response.data);

          setConnectedUsers((prevUsers) => {
            // Create a new array of connected users without duplicates
            const allUsers = [...prevUsers, ...newUsers];
            const uniqueUsers = allUsers.filter(
              (user, index, self) =>
                index === self.findIndex((u) => u._id === user._id)
            );
            return uniqueUsers;
          });
        } catch (error) {
          console.error("Error fetching connected users:", error);
        }
      }
    };

    fetchConnectedUsers();
  }, [userChat, user._id, refresh]);

  // create new chat
  const handleClick = async (u, user) => {
    console.log(u.username);
    try {
      const response = await axios.post("http://localhost:3001/chat", {
        firstId: user._id,
        secondId: u._id,
      });
      setNewChat(response.data);

      // Update userChat state immediately
      setUserChat((prevChats) => [...prevChats, newChat]);
      console.log("chat created", response.data);
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  const handletextMessages = async () => {
    // create message
    if (msg.trim() === "") {
      return;
    }
    try {
      const response = await axios.post("http://localhost:3001/message", {
        chatId: selectedChat,
        senderId: user._id,
        text: msg,
      });
      const { senderId, text, createdAt, chatId } = response.data;
      const newMessage = {
        sender: senderId,
        message: text,
        time: new Date(createdAt).toLocaleTimeString(),
      };
      // Update messages state
      updateMessages(selectedChat, newMessage);
      setMsg("");
      console.log("text", response.data);
      // let time = handleTime();
      socket.emit("privateMessage", {
        from: chatId,
        to: selectedUser || "general",
        time: new Date(createdAt).toLocaleTimeString(),
        message: text,
      });
      setMsg("");
      // create a new chat
      // handleClick(user, selectedUserInfo);
      // console.log("chat created", selectedUserId);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const removeChatItemClick = () => {
    setSelectedUser(null);
  };

  // Adjust handleEmojiClick to append at cursor position or at the end
  const handleEmojiClick = (emoji) => {
    setMsg((prevMsg) => prevMsg + emoji);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/user");
        setUser(response.data.User);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.emit("user", user.username);
    }
  }, [socket, user.username]);

  useEffect(() => {
    const newSocket = io("http://localhost:3001", {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity,
      withCredentials: true,
    });

    newSocket.on("connect", () => {
      console.log("connected");
    });

    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("privateMessage", ({ from, to, message, time }) => {
        console.log("received private message");
        setRefresh(!refresh);
        setMessages((prevMessages) => {
          const updatedMessages = { ...prevMessages };

          if (updatedMessages[from]) {
            updatedMessages[from] = [
              ...updatedMessages[from],
              { sender: from, message, time },
            ];
          } else {
            updatedMessages[from] = [{ sender: from, message, time }];
          }

          if (to === user.username) {
            if (updatedMessages[from]) {
              updatedMessages[from] = [
                ...updatedMessages[from],
                { sender: from, message, time },
              ];
            }
          }

          return updatedMessages;
        });
      });

      socket.on("activated", (data) => {
        setTyping(true);
        setUserTyping(data);
      });

      return () => {
        socket.off("privateMessage");
        socket.off("activated");
      };
    }
  }, [socket, user.username]);

  const sendMessage = () => {
    handletextMessages();
    setTyping(false);
  };

  useEffect(() => {
    setTimeout(() => {
      setTyping(false);
    }, 1000);
  }, [typing]);

  const handleInputChange = (e) => {
    setMsg(e.target.value);
  };

  return (
    <div className="dashboard">
      <Sidebar
        handleChatItemClick={handleChatItemClick}
        user={user}
        socket={socket}
        newChat={newChat}
        handleClick={handleClick}
        connectedUsers={connectedUsers}
      />
      {selectedUser && (
        <ChatWindow
          selectedUser={selectedUser}
          socket={socket}
          user={user}
          typing={typing}
          msg={msg}
          messages={messages}
          userTyping={userTyping}
          handleInputChange={handleInputChange}
          sendMessage={sendMessage}
          removeChatItemClick={removeChatItemClick}
          handleEmojiClick={handleEmojiClick}
          selectedChat={selectedChat}
        />
      )}
    </div>
  );
};

export default Dashboard;
