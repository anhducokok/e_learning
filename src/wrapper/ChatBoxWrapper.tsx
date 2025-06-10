// ChatBoxWrapper.tsx
import { useParams } from 'react-router-dom';
import ChatBox from '../components/ChatBox';

export default function ChatBoxWrapper() {
  const { userId } = useParams();
  return <ChatBox receiverId={userId!} />;
}
