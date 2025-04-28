import { supabase } from '@/utils/supabase';

export const sendMessage = async (id, senderId, senderType, recipientId, content) => {
  const { data, error } = await supabase
    .from('Message') // Replace 'Message' with your actual table name if different
    .insert([
      {
        id, // Unique ID for the message
        senderId, // ID of the sender
        senderType, // Type of the sender (e.g., 'USER' or 'CUSTOMER_REP')
        recipientId, // ID of the recipient
        content, // Message content
        createdAt: new Date().toISOString(), // Timestamp for when the message was sent
      },
    ]);

  if (error) {
    console.error('Error sending message:', error.message);
    throw new Error('Failed to send message.');
  }

  return data;
};

export const getMessages = async (userId) => {
  const { data, error } = await supabase
    .from('Message')
    .select('*')
    .or(`senderId.eq.${userId},recipientId.eq.${userId}`)
    .order('createdAt', { ascending: true });

  if (error) {
    console.error('Error fetching messages:', error.message);
    throw new Error('Failed to fetch messages.');
  }

  return data;
};