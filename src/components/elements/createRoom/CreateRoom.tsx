import React, { useState } from "react";
import { useCreateRoom } from "@hooks/room/useCreateRoom";

import "./createRoom.scss";

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
    <>
      <h3 className="createroom__title">Create Room</h3>
      <form className="createroom" onSubmit={handleCreateRoom}>
        <input
          className="createroom__name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="Room Name"
        />
        <input
          className="createroom__url"
          type="text"
          placeholder="Enter link for room's profile picture"
          value={roomURL}
          onChange={(e) => setRoomURL(e.target.value)}
        />
        <button className="createroom__button" type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Room"}
        </button>
      </form>
    </>
  );
};
