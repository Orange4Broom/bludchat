import React from "react";
import { auth } from "@fbase/firebase";

import { useAddUserToRoom } from "@hooks/room/useAddUserToRoom";

import { ChatRoomProps } from "@typings/ChatRoomProps";

import "./addUserToRoom.scss";

export const AddUserToRoom: React.FC<ChatRoomProps> = ({ roomId }) => {
  const { handleAddUser, userId, setUserId } = useAddUserToRoom(roomId);
  const currentUser = auth.currentUser;

  if (!currentUser) {
    return <div>Please log in to add users to the room.</div>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddUser();
  };

  return (
    <form className="add-user" onSubmit={handleSubmit}>
      <h3 className="add-user__header">Add user to room by id</h3>
      <input
        className="add-user__input"
        type="text"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        placeholder="Enter user ID"
      />
      <button className="add-user__submit" type="submit">
        Add User
      </button>
    </form>
  );
};
