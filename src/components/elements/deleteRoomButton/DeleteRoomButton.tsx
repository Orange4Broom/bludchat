import React from "react";
import { useDeleteRoom } from "@hooks/room/useDeleteRoom";

import { ChatRoomProps } from "@typings/ChatRoomProps";

import "./deleteButton.scss";
import { Icon } from "@/components/elements/icon/Icon";

export const DeleteRoomButton: React.FC<ChatRoomProps> = ({
  roomId,
  buttonText,
  width,
  onDelete,
}) => {
  const { deleteRoom, loading } = useDeleteRoom();

  return (
    <button
      className={`delete-button ${width}`}
      onClick={() => {
        deleteRoom(roomId), onDelete && onDelete();
      }}
      disabled={loading}
    >
      {loading ? (
        "Deleting..."
      ) : (
        <>
          {buttonText} <Icon name="trash-can" type="fas" />
        </>
      )}
    </button>
  );
};
