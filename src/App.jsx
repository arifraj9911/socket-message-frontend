import { io } from "socket.io-client";
import "./App.css";
import { useState } from "react";
import { useEffect } from "react";

const socket = io("http://localhost:5000");

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [currentClientId, setCurrentClientId] = useState("");

  useEffect(() => {
    setCurrentClientId(socket.id);

    socket.on("message", (data) => {
      console.log('current id',currentClientId)
      console.log('socket id',socket.id)
      console.log('user ',data)
      console.log('user id',data.clientId)
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("message");
    };
  }, [currentClientId]);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("message", message);
      setMessage("");
    }
  };

  console.log("message", message);
  console.log("all messages", messages);

  return (
    <div className="flex flex-col items-start" style={{ padding: "20px" }}>
      <h1 className="text-2xl">Real-Time Messaging</h1>
      <div className="border h-96 w-[400px] overflow-y-scroll my-10 p-6">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`pb-3 ${
              msg.clientId === currentClientId
                ? "text-right self-end" // Messages sent by the current user
                : "text-left self-start" // Messages from others
            }`}
          >
            <strong>
              {msg.clientId === currentClientId ? "You" : msg.clientId}:
            </strong>{" "}
            {msg.text}
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          style={{ padding: "5px" }}
          className="border"
        />
        <button
          className="bg-purple-400  text-white py-3 px-4"
          onClick={sendMessage}
          style={{ padding: "5px 10px" }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
