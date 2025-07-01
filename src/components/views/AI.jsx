import React, { useState } from 'react';
import './ChatPage.css';

export default function AI() {

     // Store an array of messages: { sender: 'user'|'bot', text: string }
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [lastReply, setLastReply] = useState('$none$');

  // Handle sending of user message
  const handleSend = async() => {
    if (!inputValue.trim()) return;

    setLastReply('')

    const payload = {
        message : inputValue
    }

    // 1. Add the user’s message to the conversation
    const newUserMessage = {
      sender: 'user',
      text: inputValue
    };
    setMessages((prev) => [...prev, newUserMessage]);

    // 2. Clear the input
    setInputValue('');

    const response = await fetch('http://localhost:3000/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const r = await response.json()
      setLastReply(r)

      const botReply = {
        sender: 'bot',
        text: r[0].reply
      };
      setMessages((prev) => [...prev, botReply]);


  };

  // Handle Enter key in the input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  

  return (
    <>
    <div className="chat-container">
      {/* Header */}
      <div className="chat-header">
        <h5 className="mb-0">Gitam AI chatbot</h5>
      </div>

      {/* Messages */}
      <div className="chat-body">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message-bubble ${msg.sender === 'user' ? 'user-bubble':'bot-bubble'}`}
          >
            {msg.text}
          </div>
        ))}   

        {lastReply=='' && <div
            className='message-bubble thinking-bubble'
          >
            Thinking...
          </div>}     
      </div>

      

      {/* Footer with input */}
      <div className="chat-footer">
        <input
          type="text"
          className="form-control"
          placeholder="Type a message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button className="btn btn-success ms-2" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
    </>
  )
}
