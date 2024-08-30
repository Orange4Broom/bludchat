import React, { useState } from "react";
import { useCreateRoom } from "@hooks/room/useCreateRoom";

export const CreateRoom: React.FC = () => {
  const [roomName, setRoomName] = useState("");
  const [roomURL, setRoomURL] = useState("");
  const { createRoom, loading } = useCreateRoom();

  const handleCreateRoom = async (event: React.FormEvent) => {
    event.preventDefault();
    await createRoom(roomName, roomURL);
    setRoomName("");
    setRoomURL("");
  };

  return (
    <div>
      <form onSubmit={handleCreateRoom}>
        <input
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="Room Name"
        />
        <input
          type="text"
          value={roomURL}
          onChange={(e) => setRoomURL(e.target.value)}
          placeholder="Enter link for room profile picture"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Room"}
        </button>
      </form>
    </div>
  );
};
