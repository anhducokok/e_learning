import { useChat } from '../../src/contexts/ChatContext';
import ChatBox from './ChatBox';

const MyChatWidget = () => {
  const { openChats/*, toggleChat, currentUserId*/ } = useChat(); // toggleChat, currentUserId unused

  return (
    <div>
      <div className="fixed bottom-20 right-4 flex gap-4 z-[100]">
        {openChats.map(userId => (
          <ChatBox key={userId} receiverId={userId} />
        ))}
      </div>
    </div>
  );
};

export default MyChatWidget;
