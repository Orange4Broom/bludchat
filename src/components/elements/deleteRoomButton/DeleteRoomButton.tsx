import React from "react";
import { useDeleteRoom } from "@hooks/room/useDeleteRoom";

import { ChatRoomProps } from "@typings/ChatRoomProps";

export const DeleteRoomButton: React.FC<ChatRoomProps> = ({ roomId }) => {
  const { deleteRoom, loading } = useDeleteRoom();

  return (
    <button onClick={() => deleteRoom(roomId)} disabled={loading}>
      {loading ? "Deleting..." : "Delete Room"}
    </button>
  );
};
