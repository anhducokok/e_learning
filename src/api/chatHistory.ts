import type { Request, Response } from "express";
import db from "../db"; 
export const getChatHistory = async (req: Request, res: Response) => {
  const { user1, user2 } = req.query;
  if (!user1 || !user2) {
    return res.status(400).json({ error: "Missing user1 or user2" });
  }
  try {
    const { rows } = await db.query(
      `SELECT * FROM messages
       WHERE (sender_id = $1 AND receiver_id = $2)
          OR (sender_id = $2 AND receiver_id = $1)
       ORDER BY created_at ASC`,
      [user1, user2]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
};

// Đăng ký route này trong file server chính:
// import { getChatHistory } from './api/chatHistory';
// app.get('/api/chat/history', getChatHistory);
