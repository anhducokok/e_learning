import type { Request, Response } from "express";
import db from "../db"; 

export const getChatHistory = async (req: Request, res: Response) => {
  const { user1, user2 } = req.query;

  console.log('🔍 Getting chat history for users:', { user1, user2 });

  if (!user1 || !user2) {
    console.log('❌ Missing user IDs');
    return res.status(400).json({ 
      success: false, 
      error: "Missing user IDs. Both user1 and user2 are required." 
    });
  }

  try {
    const { rows } = await db.query(
      `SELECT 
        id,
        sender_id as "senderId",
        receiver_id as "receiverId",
        content,
        created_at as "createdAt"
      FROM messages
      WHERE (sender_id = $1 AND receiver_id = $2)
         OR (sender_id = $2 AND receiver_id = $1)
      ORDER BY created_at ASC`,
      [user1, user2]
    );

    console.log(`✅ Found ${rows.length} messages`);

    res.json({ 
      success: true,
      data: rows
    });
  } catch (err) {
    console.error('❌ Database error:', err);
    res.status(500).json({ 
      success: false, 
      error: "Failed to fetch chat history" 
    });
  }
};

// Đăng ký route này trong file server chính:
// import { getChatHistory } from './api/chatHistory';
// app.get('/api/chat/history', getChatHistory);
