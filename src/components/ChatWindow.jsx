import React, { useState, useEffect, useRef } from "react";
import Picker from "emoji-picker-react";

const ChatWindow = ({ selectedUser, socket, user }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState({});
  const [typing, setTyping] = useState(false);
  const [userTyping, setUserTyping] = useState("");
  const inputRef = useRef(null);

  // Load messages from localStorage when component mounts
  useEffect(() => {
    const storedMessages = localStorage.getItem("messages");
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("privateMessage", ({ from, to, message, time }) => {
        // Update messages for both sender and receiver
        setMessages((prevMessages) => {
          const updatedMessages = { ...prevMessages };

          // Update sender's messages
          if (updatedMessages[from]) {
            updatedMessages[from] = [
              ...updatedMessages[from],
              { sender: from, message, time },
            ];
          } else {
            updatedMessages[from] = [{ sender: from, message, time }];
          }

          // Update receiver's messages
          if (to === user.username) {
            if (updatedMessages[from]) {
              updatedMessages[from] = [
                ...updatedMessages[from],
                { sender: from, message, time },
              ];
            } else {
              updatedMessages[from] = [{ sender: from, message, time }];
            }
          }

          localStorage.setItem("messages", JSON.stringify(updatedMessages)); // Save to localStorage
          return updatedMessages;
        });
      });

      socket.on("activated", (data) => {
        setTyping(true);
        setUserTyping(data);
      });

      // Clean up listener
      return () => {
        socket.off("privateMessage");
        socket.off("activated");
      };
    }
  }, [socket, user.username]);

  const handleTime = () => {
    const date = new Date();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const sendMessage = () => {
    let time = handleTime();
    if (msg.trim()) {
      socket.emit("privateMessage", {
        from: user.username,
        to: selectedUser || "general",
        time,
        message: msg,
      });
      setMessages((prevMessages) => {
        const updatedMessages = { ...prevMessages };

        // Update sender's messages
        const recipient = selectedUser || "general";
        if (updatedMessages[recipient]) {
          updatedMessages[recipient] = [
            ...updatedMessages[recipient],
            { sender: "me", message: msg, time },
          ];
        } else {
          updatedMessages[recipient] = [
            { sender: "me", message: msg, time },
          ];
        }

        localStorage.setItem("messages", JSON.stringify(updatedMessages)); // Save to localStorage
        return updatedMessages;
      });
      setMsg("");
      setTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    } else {
      if (socket) {
        socket.emit("active", { to: selectedUser || "general" });
      }
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setTyping(false);
    }, 1000);
  }, [typing]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h2>{selectedUser || "General Chat"}</h2>
      </div>
      <hr />
      <div className="chat-messages">
        {(messages[selectedUser] || []).map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender === "me" ? "sent" : "received"}`}
          >
            <p>{msg.message}</p>
            <span>{msg.time}</span>
          </div>
        ))}
        {typing && (
          <div className={`message received ${typing ? "typing" : ""}`}>
            <div className="typing-indicator"></div>
            {userTyping}
          </div>
        )}
      </div>

      <div className="chat-input">
        <input
          onKeyDown={handleKeyPress}
          ref={inputRef}
          type="text"
          placeholder="Write Something"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />
        <div
          className="emoji"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          😂
        </div>
        {showEmojiPicker && (
          <Picker
            onEmojiClick={(emojiObject) =>
              setMsg((prevMsg) => prevMsg + emojiObject.emoji)
            }
          />
        )}
        <button className="button-check" onClick={sendMessage}>
          <i className="fa-solid fa-check"></i>
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
