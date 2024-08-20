import React, { useState } from "react";
import { useCreateRoom } from "@hooks/room/useCreateRoom";

export const CreateRoom: React.FC = () => {
  const [roomName, setRoomName] = useState("");
  const { createRoom, loading } = useCreateRoom();

  const handleCreateRoom = async () => {
    await createRoom(roomName);
    setRoomName("");
  };

  return (
    <div>
      <input
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        placeholder="Room Name"
      />
      <button onClick={handleCreateRoom} disabled={loading}>
        {loading ? "Creating..." : "Create Room"}
      </button>
    </div>
  );
};
