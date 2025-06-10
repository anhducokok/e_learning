// import { useChat } from '../../src/contexts/ChatContext';
// import { useEffect, useRef, useState } from 'react';

// interface Props {
//   receiverId: string;
// }

// const ChatBox = ({ receiverId }: Props) => {
//   const { messages, sendMessage, currentUserId, toggleChat } = useChat();
//   const [input, setInput] = useState('');
//   const chatEndRef = useRef<HTMLDivElement | null>(null);

//   const chatMessages = messages[receiverId] || [];

//   useEffect(() => {
//     // Scroll to bottom when messages change
//     if (chatEndRef.current) {
//       chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
//     }
//   }, [chatMessages]);

//   const handleSend = () => {
//     if (input.trim()) {
//       sendMessage(receiverId, input.trim());
//       setInput('');
//     }
//   };

//   return (
//     <div className="w-80 h-96 bg-white shadow-lg rounded-lg flex flex-col border border-gray-200">
//       <div className="bg-red-600 text-white px-4 py-2 rounded-t-lg flex justify-between">
//         <span>Chat with {receiverId}</span>
//         <button onClick={() => toggleChat(receiverId)}>×</button>
//       </div>
//       <div className="flex-1 overflow-y-auto p-2 space-y-2">
//         {chatMessages.map((msg, index) => (
//           <div
//             key={index}
//             className={`p-2 rounded-lg max-w-[80%] ${
//               msg.senderId === currentUserId
//                 ? 'bg-red-500 text-white self-end ml-auto'
//                 : 'bg-gray-200 text-black self-start mr-auto'
//             }`}
//           >
//             {msg.content}
//           </div>
//         ))}
//         <div ref={chatEndRef} />
//       </div>
//       <div className="p-2 border-t flex gap-2">
//         <input
//           className="border flex-1 p-1 rounded"
//           value={input}
//           onChange={e => setInput(e.target.value)}
//           placeholder="Type your message..."
//         />
//         <button
//           onClick={handleSend}
//           className="bg-red-500 text-white px-3 py-1 rounded"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChatBox;
import { useChat } from '../../src/contexts/ChatContext';
import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

interface Props {
  receiverId: string;
}

const ChatBox = ({ receiverId }: Props) => {
  const { messages, sendMessage, currentUserId, toggleChat } = useChat();
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const chatMessages = messages[receiverId] || [];

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

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
          <span>Chat với {receiverId}</span>
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
          {chatMessages.length === 0 && (
            <p className="italic text-red-500">Xin chào! Bạn cần hỗ trợ gì?</p>
          )}
          {chatMessages.map((msg, index) => (
            <div
              key={index}
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
