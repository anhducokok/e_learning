import React, { useState/*, useEffect*/ } from "react"; // useEffect unused

import ChatPopup from "./ChatPopup";

import { useAuth } from "../contexts/AuthContext";

const ChatDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { isAuthenticated, user } = useAuth();
  const toggleDropdown = () => setIsOpen((v) => !v);

  if (!isAuthenticated || !user?.id) return null;

  return (
    <div className="fixed bottom-0 right-6 z-50 flex flex-col items-end space-y-6">
      {/* Chat button */}
      <div className="relative my-6">
        <button
          onClick={toggleDropdown}
          className="bg-red-700 text-white px-7 py-5 mx-2 rounded-full shadow-xl hover:bg-red-800 transition font-semibold flex items-center gap-4 text-xl"
          aria-haspopup="true"
          aria-expanded={isOpen}
        >
          💬 Tin nhắn
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute right-0 bottom-full mb-5 w-[420px] bg-white rounded-3xl shadow-3xl border border-red-400 overflow-hidden max-h-[500px] flex flex-col text-lg">
            <ChatPopup />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatDropdown;
