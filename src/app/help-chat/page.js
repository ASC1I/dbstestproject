'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import { sendMessage, getMessages } from '@/utils/messageService';
import cuid from 'cuid';

export default function HelpChatPage() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userId, setUserId] = useState(null); // Initialize userId as null

  useEffect(() => {
    const fetchUserId = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) {
        console.error('Error fetching user:', error.message);
        return;
      }

      if (user) {
        setUserId(user.id); // Set the user ID from Supabase
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchMessages = async () => {
      try {
        const data = await getMessages(userId);
        setMessages(data);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchMessages();
  }, [userId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
  
    try {
      // Generate a unique ID for the message
      const messageId = cuid();
  
      // Send the message
      await sendMessage(messageId, userId, 'USER', 'CUSTOMER_REP_ID', 'Me: '+ newMessage); // Replace CUSTOMER_REP_ID with the actual recipient ID
      setNewMessage('');
  
      // Fetch updated messages
      const updatedMessages = await getMessages(userId);
      setMessages(updatedMessages);
    } catch (err) {
      console.error('Error sending message:', err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-bold">Help Chat</h1>
      <div className="mt-6">
        <div className="border p-4 h-96 overflow-y-scroll">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-2 my-2 ${
                msg.senderType === 'USER' ? 'text-right' : 'text-left'
              }`}
            >
              <p className="text-sm">{msg.content}</p>
              <p className="text-xs text-gray-500">{new Date(msg.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
        <form onSubmit={handleSendMessage} className="mt-4 flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 p-2 border rounded"
            placeholder="Type your message..."
            required
          />
          <button type="submit" className="ml-2 bg-blue-500 text-white p-2 rounded">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}