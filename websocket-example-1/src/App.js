// websocket-sender/src/App.js
import React, { useState, useEffect } from 'react';

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Create WebSocket connection.
    const ws = new WebSocket('ws://localhost:8080');

    // Connection opened
    ws.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    // Listen for messages
    ws.onmessage = (event) => {
      if (typeof event.data === 'string') {
        setMessages((prevMessages) => [...prevMessages, JSON.parse(event.data)]);
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          setMessages((prevMessages) => [...prevMessages, JSON.parse(reader.result)]);
        };
        reader.readAsText(event.data);
      }
    };

    // Handle connection close
    ws.onclose = () => {
      console.log('Disconnected from WebSocket server');
    };

    // Save the WebSocket instance
    setSocket(ws);

    // Cleanup on component unmount
    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = () => {
    if (socket && message) {
      const timestamp = new Date().toISOString();
      const messageObject = { message, timestamp };
      socket.send(JSON.stringify(messageObject));
      setMessage('');
    }
  };

  return (
    <div className="App">
      <h1>WebSocket App 1</h1>
      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter message"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
      <div>
        <h2>Messages</h2>
        <ul>
          {messages.map((msg, index) => (
            <div key={index}>{msg.timestamp} - {msg.message}</div>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
