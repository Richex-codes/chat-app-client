import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ handleChatItemClick, user, socket }) => {
    const [connectedUsers, setConnectedUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate()

    // Handle connected users update
    useEffect(() => {
        if (socket && user.username) {
            socket.emit('user', user.username);

            socket.on('connectedUsers', (users) => {
                // Exclude the current user from the list
                const otherUsers = users.filter(username => username !== user.username);
                setConnectedUsers(otherUsers);
            });
        }
        
        return () => {
            if (socket) {
                socket.off('connectedUsers');
            }
        };
    }, [socket, user.username]);

    // Filtered users based on search term
    const filteredUsers = connectedUsers.filter(username =>
        username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('messages');  // Remove username as well
        navigate('/login', { replace: true }); 
        console.log('Logging out...');
    };
 
    return (
        <div className="sidebar">
            <div className="profile">
                <h2>{user.name}</h2>
                <p>Senior Developer</p>
            </div>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search Friends"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="chat-list">
                {/* Dynamic list of connected users */}
                {filteredUsers.map((username, index) => (
                    <div className="chat-item" key={index} onClick={() => handleChatItemClick(username)}> 
                        <p>{username}</p>
                        <span>Message for {username}</span>
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
