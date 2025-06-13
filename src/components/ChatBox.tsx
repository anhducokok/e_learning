// import { useChat } from '../../src/contexts/ChatContext';
// import { useEffect, useRef, useState } from 'react';
// import { X } from 'lucide-react';

// interface Props {
//   receiverId: string;
// }

// const ChatBox = ({ receiverId }: Props) => {
//   const { messages, sendMessage, currentUserId, toggleChat } = useChat();
//   const [input, setInput] = useState('');
//   const [history, setHistory] = useState<any[]>([]);
//   const chatEndRef = useRef<HTMLDivElement | null>(null);

//   const realtimeMessages = messages[receiverId] || [];

//   // Fetch lịch sử tin nhắn khi ChatBox được mount
//   useEffect(() => {
//     const fetchHistory = async () => {
//       try {
//         const res = await fetch(
//           `http://localhost:3212/chat/history?userA=${currentUserId}&userB=${receiverId}`
//         );
//         const result = await res.json();
//         const data = Array.isArray(result?.data) ? result.data : [];
//         setHistory(data);
//       } catch (error) {
//         //         setHistory([]);
//       }
//     };

//     if (currentUserId && receiverId) {
//       fetchHistory();
//     }
//   }, [receiverId, currentUserId]);

//   // Gộp lịch sử và realtime, loại bỏ trùng lặp dựa trên `id`
//   const allMessages = [
//     ...history,
//     ...realtimeMessages.filter(
//       (msg) => !history.some((h) => h.id === msg.id)
//     ),
//   ].sort(
//     (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
//   );

//   // Auto scroll
//   useEffect(() => {
//     if (chatEndRef.current) {
//       chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
//     }
//   }, [allMessages]);

//   const handleSend = (e?: React.FormEvent) => {
//     if (e) e.preventDefault();
//     if (input.trim()) {
//       sendMessage(receiverId, input.trim());
//       setInput('');
//     }
//   };

//   return (
//     <div className="fixed bottom-24 right-8 z-50">
//       <div className="bg-white w-[400px] h-[520px] rounded-3xl shadow-3xl flex flex-col border border-red-500 overflow-hidden">
//         {/* Header */}
//         <div className="bg-red-800 text-white p-6 flex justify-between items-center font-bold text-xl tracking-wide rounded-t-3xl shadow-lg">
//           <span>Chat với {receiverId}</span>
//           <button
//             onClick={() => toggleChat(receiverId)}
//             aria-label="Đóng khung chat"
//             className="hover:text-red-300 transition"
//           >
//             <X className="w-6 h-6" />
//           </button>
//         </div>

//         {/* Messages */}
//         <div className="flex-1 p-6 overflow-y-auto text-red-900 text-base leading-relaxed bg-red-50">
//           {allMessages.length === 0 && (
//             <p className="italic text-red-500">Xin chào! Bạn cần hỗ trợ gì?</p>
//           )}
//           {allMessages.map((msg, index) => (
//             <div
//               key={msg.id || index}
//               className={
//                 msg.senderId === currentUserId
//                   ? 'text-right mb-2'
//                   : 'text-left mb-2'
//               }
//             >
//               <span
//                 className={
//                   msg.senderId === currentUserId
//                     ? 'bg-red-100 px-3 py-2 rounded-2xl inline-block'
//                     : 'bg-gray-200 px-3 py-2 rounded-2xl inline-block'
//                 }
//               >
//                 {msg.content}
//               </span>
//             </div>
//           ))}
//           <div ref={chatEndRef} />
//         </div>

//         {/* Input */}
//         <form
//           onSubmit={handleSend}
//           className="p-6 border-t border-red-300 flex gap-4 bg-white"
//         >
//           <input
//             type="text"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             placeholder="Nhập tin nhắn..."
//             className="flex-1 border border-red-400 rounded-2xl px-5 py-3 text-base text-red-900 placeholder-red-400 focus:outline-none focus:ring-4 focus:ring-red-700 transition"
//           />
//           <button
//             type="submit"
//             className="bg-red-700 hover:bg-red-800 text-white px-7 py-3 rounded-2xl font-semibold transition shadow-lg"
//           >
//             Gửi
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ChatBox;

import { useChat } from '../../src/contexts/ChatContext';
import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { userService } from '../services/userService'; // 👈 Thêm import
import type { User } from '../types/api'; // 👈 Nếu cần

interface Props {
  receiverId: string;
}

const ChatBox = ({ receiverId }: Props) => {
  const { messages, sendMessage, currentUserId, toggleChat } = useChat();
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<any[]>([]);
  const [receiverUser, setReceiverUser] = useState<User | null>(null); // 👈 Thêm state
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const realtimeMessages = messages[receiverId] || [];

  // 👇 Fetch user info by receiverId
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const allUsers = await userService.getAllUsers();
        const user = allUsers.find((u: User) => u.id === receiverId) || null;
        setReceiverUser(user);
      } catch (err) {
        setReceiverUser(null);
      }
    };

    if (receiverId) {
      fetchUser();
    }
  }, [receiverId]);

  // 👇 Fetch lịch sử tin nhắn
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(
          `http://localhost:3212/chat/history?userA=${currentUserId}&userB=${receiverId}`
        );
        const result = await res.json();
        const data = Array.isArray(result?.data) ? result.data : [];
        setHistory(data);
      } catch (error) {
        setHistory([]);
      }
    };

    if (currentUserId && receiverId) {
      fetchHistory();
    }
  }, [receiverId, currentUserId]);

  // 👇 Gộp và sort tin nhắn
  const allMessages = [
    ...history,
    ...realtimeMessages.filter(
      (msg) => !history.some((h) => h.id === msg.id)
    ),
  ].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [allMessages]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (input.trim()) {
      sendMessage(receiverId, input.trim());
      setInput('');
    }
  };

  return (
    <div className="fixed bottom-24 right-8 z-50">
      <div className="bg-white w-[400px] h-[520px] rounded-3xl shadow-3xl flex flex-col border border-red-500 overflow-hidden">
        {/* Header */}
        <div className="bg-red-800 text-white p-6 flex justify-between items-center font-bold text-xl tracking-wide rounded-t-3xl shadow-lg">
          <span>
            Chat với {receiverUser?.name || 'Người dùng'}
          </span>
          <button
            onClick={() => toggleChat(receiverId)}
            aria-label="Đóng khung chat"
            className="hover:text-red-300 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-6 overflow-y-auto text-red-900 text-base leading-relaxed bg-red-50">
          {allMessages.length === 0 && (
            <p className="italic text-red-500">Xin chào! Bạn cần hỗ trợ gì?</p>
          )}
          {allMessages.map((msg, index) => (
            <div
              key={msg.id || index}
              className={
                msg.senderId === currentUserId
                  ? 'text-right mb-2'
                  : 'text-left mb-2'
              }
            >
              <span
                className={
                  msg.senderId === currentUserId
                    ? 'bg-red-100 px-3 py-2 rounded-2xl inline-block'
                    : 'bg-gray-200 px-3 py-2 rounded-2xl inline-block'
                }
              >
                {msg.content}
              </span>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={handleSend}
          className="p-6 border-t border-red-300 flex gap-4 bg-white"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nhập tin nhắn..."
            className="flex-1 border border-red-400 rounded-2xl px-5 py-3 text-base text-red-900 placeholder-red-400 focus:outline-none focus:ring-4 focus:ring-red-700 transition"
          />
          <button
            type="submit"
            className="bg-red-700 hover:bg-red-800 text-white px-7 py-3 rounded-2xl font-semibold transition shadow-lg"
          >
            Gửi
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;
