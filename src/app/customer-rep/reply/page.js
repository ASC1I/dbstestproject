'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import { sendMessage, getMessages } from '@/utils/messageService';
import cuid from 'cuid';

export default function CustomerRepReplyPage() {
  const [unreadMessages, setUnreadMessages] = useState([]); // List of users with unread messages
  const [messages, setMessages] = useState([]); // Messages for the selected user
  const [newMessage, setNewMessage] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const CUSTOMER_REP_ID = 'CUSTOMER_REP_ID'; // Replace with the actual customer rep ID

  // Fetch unread messages from users
  useEffect(() => {
    const fetchUnreadMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('Message')
          .select('senderId, senderType, content, createdAt')
          .eq('senderType', 'USER')
          .eq('isRead', false)
          .order('createdAt', { ascending: true });

        if (error) {
          console.error('Error fetching unread messages:', error.message);
          return;
        }

        // Group unread messages by senderId
        const groupedMessages = data.reduce((acc, message) => {
          if (!acc[message.senderId]) {
            acc[message.senderId] = {
              senderId: message.senderId,
              latestMessage: message.content,
              createdAt: message.createdAt,
            };
          }
          return acc;
        }, {});

        setUnreadMessages(Object.values(groupedMessages));
      } catch (err) {
        console.error('Error fetching unread messages:', err.message);
      }
    };

    fetchUnreadMessages();
  }, [CUSTOMER_REP_ID]);

  // Fetch messages for the selected user
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (selectedUserId) {
          const data = await getMessages(selectedUserId);
          setMessages(data);

          // Mark all messages from this user as read
          await supabase
            .from('Message')
            .update({ isRead: true })
            .eq('senderId', selectedUserId)
            .eq('recipientId', CUSTOMER_REP_ID);
        }
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchMessages();
  }, [selectedUserId, CUSTOMER_REP_ID]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
  
    if (!newMessage.trim()) {
      console.error('Message content is empty.');
      return;
    }

    const messageId = cuid();
  
    try {
      console.log('Sending message:', newMessage); // Debugging log
      await sendMessage(messageId, CUSTOMER_REP_ID, 'CUSTOMER_REP', selectedUserId, 'Customer Rep: '+newMessage);
      setNewMessage(''); // Clear the input field after sending the message
  
      // Fetch updated messages
      const updatedMessages = await getMessages(selectedUserId);
      setMessages(updatedMessages);
    } catch (err) {
      console.error('Error sending message:', err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-bold">Customer Rep Reply</h1>
      <div className="mt-6 flex">
        {/* Unread Messages List */}
        <div className="w-1/3 border-r pr-4">
          <h2 className="text-xl font-bold mb-4">Unread Messages</h2>
          <ul>
            {unreadMessages.map((msg) => (
              <li
                key={msg.senderId}
                className="p-2 border-b cursor-pointer hover:bg-gray-100"
                onClick={() => setSelectedUserId(msg.senderId)}
              >
                <p className="font-bold">User ID: {msg.senderId}</p>
                <p className="text-sm text-gray-600">{msg.latestMessage}</p>
                <p className="text-xs text-gray-400">
                  {new Date(msg.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Chat Window */}
        <div className="w-2/3 pl-4">
          {selectedUserId ? (
            <>
              <div className="border p-4 h-96 overflow-y-scroll">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-2 my-2 ${
                      msg.senderType === 'CUSTOMER_REP' ? 'text-right' : 'text-left'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(msg.createdAt).toLocaleString()}
                    </p>
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
            </>
          ) : (
            <p className="text-gray-500">Select a user to view and respond to messages.</p>
          )}
        </div>
      </div>
    </div>
  );
}