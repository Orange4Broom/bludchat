import React from "react";
import { useDeleteRoom } from "@hooks/room/useDeleteRoom";

import { ChatRoomProps } from "@typings/ChatRoomProps";

import "./deleteButton.scss";
import { Icon } from "@/components/elements/icon/Icon";

export const DeleteRoomButton: React.FC<ChatRoomProps> = ({ roomId }) => {
  const { deleteRoom, loading } = useDeleteRoom();

  return (
    <button
      className="delete"
      onClick={() => deleteRoom(roomId)}
      disabled={loading}
    >
      {loading ? "Deleting..." : <Icon name="trash-can" type="fas" />}
    </button>
  );
};
