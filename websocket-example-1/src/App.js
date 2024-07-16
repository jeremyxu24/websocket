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
      const messageObject = { user: "jeremy", message: message, timestamp: timestamp };
      socket.send(JSON.stringify(messageObject));
      const headers = messages.length > 0 ? Object.keys(messages[0]) : [];
      setMessage('');
    }
  };
  const headers = messages.length > 0 ? Object.keys(messages[0]) : [];

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
        <table>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header.charAt(0).toUpperCase() + header.slice(1)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {messages.map((msg, index) => (
            <tr key={index}>
              {headers.map((header) => (
                <td key={header}>{msg[header]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
          
      </div>
    </div>
  );
}

export default App;
