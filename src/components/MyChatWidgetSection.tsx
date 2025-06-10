import { useChat } from '../../src/contexts/ChatContext';
import ChatBox from './ChatBox';

const dummyUserList = [
  { id: '80016a30-2d11-48d5-bb8f-71c0656ef612', name: 'Teacher' },
  { id: 'd5182703-dae7-4723-ac98-c1a7cd7e1083', name: 'Bob' },
  { id: '49298468-8a39-4cf0-896f-2fdba3a0e4b6', name: 'Bob' },
];

const MyChatWidget = () => {
  const { openChats, toggleChat, currentUserId } = useChat();

  return (
    <div>
      {/* Button để mở chat */}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
        {dummyUserList
          .filter(user => user.id !== currentUserId)
          .map(user => (
            <button
              key={user.id}
              onClick={() => toggleChat(user.id)}
              className="bg-gray-800 text-white px-3 py-2 rounded hover:bg-gray-600"
            >
              Chat with {user.name}
            </button>
          ))}
      </div>

      {/* Các khung ChatBox mở */}
      <div className="fixed bottom-20 right-4 flex gap-4 z-[100]">
        {openChats.map(userId => (
          <ChatBox key={userId} receiverId={userId} />
        ))}
      </div>
    </div>
  );
};

export default MyChatWidget;
