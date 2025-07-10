import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import { BASE_URL } from "../App";

const ChatComponent = ({ currentUserId, managerUserId, user, title, allNames }) => {
  const [showChat, setShowChat] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // { userId }
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const roomIdRef = useRef();

  const SOCKET_SERVER_URL = BASE_URL;

  const getRoomId = (userA, userB) => [userA, userB].sort().join("-");

  const connectSocket = (roomId) => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    socketRef.current = io(SOCKET_SERVER_URL, {
      transports: ["websocket"],
    });

    socketRef.current.on("connect", () => {
      socketRef.current.emit("joinRoom", { roomId });
    });

    socketRef.current.on("chat message", (msg) => {
      const isSelf = msg.senderId === currentUserId;
      const newMsg = { ...msg, self: isSelf };

      setMessages((prev) => {
        const isCurrentRoom = msg.roomId === roomIdRef.current;
        return isCurrentRoom ? [...prev, newMsg] : prev;
      });
    });
  };

  const getAllMessages = async (roomId) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/messages/${roomId}`);
      const msgs = res.data.map((msg) => ({
        ...msg,
        self: msg.senderId === currentUserId,
      }));
      setMessages(msgs);
    } catch (err) {
      console.error("Failed to load messages:", err);
    }
  };

  const handleSelectUser = (userId) => {
    if (selectedUser?.userId === userId) return;

    const roomId = getRoomId(currentUserId, userId);
    roomIdRef.current = roomId;
    setSelectedUser({ userId });

    getAllMessages(roomId);
    connectSocket(roomId);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!selectedUser) {
      alert("Please select a user to chat with.");
      return;
    }

    const receiverId = selectedUser.userId;
    const roomId = getRoomId(currentUserId, receiverId);
    roomIdRef.current = roomId;

    if (message.trim() && socketRef.current) {
      const msgObj = {
        roomId,
        senderId: currentUserId,
        receiverId,
        message,
        user,
        time: new Date().toLocaleTimeString(),
      };
      socketRef.current.emit("chat message", msgObj);
      setMessage("");
    }
  };

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const managerList = Array.isArray(managerUserId)
    ? managerUserId
    : [managerUserId];

  useEffect(() => {
    if (showChat && managerList.length > 0 && !selectedUser) {
      handleSelectUser(managerList[0]);
    }
  }, [showChat, managerList]);

  if (!showChat) {
    return (
      <button
        onClick={() => setShowChat(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-full text-sm font-semibold"
      >
        {title}
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 shadow-lg border border-gray-300 rounded-xl w-[400px] h-[500px] bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="p-3 border-b flex justify-between items-center bg-gray-100 rounded-t-xl">
        <span className="font-bold text-gray-700">{title}</span>
        <button
          onClick={() => setShowChat(false)}
          className="text-gray-500 hover:text-red-500 text-xl font-bold"
        >
          ×
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Manager ID List */}
        <div className="w-[30%] border-r overflow-y-auto">
          {managerList.map((id, idx) => (
            <div
              key={id}
              className={`cursor-pointer text-sm px-2 py-1 rounded mb-1 whitespace-normal ${
                selectedUser?.userId === id
                  ? "bg-blue-100 text-blue-700"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => handleSelectUser(id)}
            >
              {allNames ? allNames[idx] : 'Manager ' + (idx + 1)}
            </div>
          ))}
        </div>

        {/* Chat Messages */}
        <div className="flex flex-col flex-1 p-2 overflow-hidden">
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.self ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`rounded-xl p-2 max-w-[70%] text-sm ${
                    msg.self ? "bg-green-200" : "bg-gray-200"
                  }`}
                >
                  <div className="text-[10px] text-gray-600 mb-1">
                    {msg.self ? "You" : msg.user?.name || msg.senderId} •{" "}
                    {msg.time}
                  </div>
                  <div>{msg.message}</div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSend}
            className="flex items-center mt-2 gap-2 border-t pt-2"
          >
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              type="text"
              placeholder="Type a message..."
              className="flex-1 border border-gray-300 rounded px-3 py-1 text-sm"
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded text-sm"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
