import { useState } from "react";

export const useChatRoomHandlers = () => {
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);

  const handleCloseChatRoom = () => {
    setCurrentRoomId(null);
  };

  return {
    currentRoomId,
    setCurrentRoomId,
    handleCloseChatRoom,
  };
};
