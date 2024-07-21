import React, { useState, useRef } from "react";
import Picker from "emoji-picker-react";
// import InputEmoji from 'react-input-emoji'

const ChatWindow = ({
  selectedUser,
  socket,
  sendMessage,
  messages,
  msg,
  typing,
  userTyping,
  handleInputChange,
  removeChatItemClick,
  handleEmojiClick,
  selectedChat,
  user
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);


  const inputRef = useRef(null);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    } else {
      if (socket) {
        socket.emit("active", { to: selectedUser || "general" });
      }
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="icon-back">
          <i onClick={removeChatItemClick} class="fa-solid fa-arrow-left"></i>
        </div>
        <h2>{selectedUser || "General Chat"}</h2>
      </div>
      <hr /> 
      <div className="chat-messages">
        {(messages[selectedChat] || []).map((msg, index) => (
          <div
            key={index} 
            className={`message ${msg.sender === user._id ? "sent" : "received"}`}
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
          onChange={handleInputChange}
        />
        <div className="emoji-container">
          <div
            className="emoji"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            😂
          </div>
          {showEmojiPicker && (
            <div className="emoji-picker">
              <Picker
                onEmojiClick={(emojiObject) =>
                  handleEmojiClick(emojiObject.emoji)
                }
              />
            </div>
          )}
        </div>
        <button className="button-check" onClick={sendMessage}>
          <i className="fa-solid fa-check"></i>
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
