import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const WebSock = () => {
  const [messages, setMessages] = useState([]);
  const [value, setValue] = useState('');
  const [connected, setConnected] = useState(false);
  const [userName, setUsername] = useState('');
  const socket = useRef();

  function connect() {
    socket.current = new WebSocket('ws://localhost:5000');

    socket.current.onopen = () => {
      setConnected(true);

      const message = {
        event: 'connection',
        userName,
        id: Date.now(),
      };

      socket.current.send(JSON.stringify(message));
    };

    socket.current.onmessage = event => {
      const message = JSON.parse(event.data);
      setMessages(prev => [message, ...prev]);
    };

    socket.current.onclose = () => {
      console.log('Socket closed');
    };

    socket.current.onerror = () => {
      console.log('Socket error');
    };
  }

  const sendMessage = async () => {
    const message = {
      userName,
      message: value,
      id: Date.now(),
      event: 'message',
    };

    socket.current.send(JSON.stringify(message));
    setValue('');
  };

  if (!connected) {
    return (
      <div className="center">
        <div className="form">
          <input
            type="text"
            placeholder="Your Name"
            value={userName}
            onChange={e => setUsername(e.target.value)}
          />
          <button onClick={connect}>Войти</button>
        </div>
      </div>
    );
  }

  return (
    <div className="center">
      <div>
        <div className="form">
          <input
            type="text"
            value={value}
            onChange={e => setValue(e.target.value)}
          />
          <button onClick={sendMessage}>Отправить</button>
        </div>
        <div className="messages">
          {messages.map(mess => (
            <div key={mess.id}>
              {mess.event === 'connection' ? (
                <div>User {mess.userName} connected</div>
              ) : (
                <div>
                  {mess.userName} : {mess.message}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WebSock;
