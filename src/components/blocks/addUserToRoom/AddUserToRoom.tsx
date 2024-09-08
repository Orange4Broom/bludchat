import React, { useState } from "react";
import { auth } from "@fbase/firebase";

import { useAddUserToRoom } from "@hooks/room/useAddUserToRoom";

import { ChatRoomProps } from "@typings/ChatRoomProps";

import "./addUserToRoom.scss";
import { Icon } from "@/components/elements/icon/Icon";
import { useFetchMembers } from "@/hooks/room/useFetchMembers";
import { useToastify } from "@/hooks/useToastify";

export const AddUserToRoom: React.FC<ChatRoomProps> = ({ roomId }) => {
  const { handleAddUser, userId, setUserId } = useAddUserToRoom(roomId);
  const [open, setOpen] = useState<boolean>(false);
  const { members } = useFetchMembers(roomId);
  const currentUser = auth.currentUser;
  const { notify } = useToastify();

  if (!currentUser) {
    return <div>Please log in to add users to the room.</div>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    userId.length > 26
      ? members.find((member) => member.uid !== userId)
        ? handleAddUser()
        : notify("error", "User is already in the room.")
      : notify("error", "Please enter a user ID.");
  };

  return (
    <form
      className="add-user"
      style={{
        height: open ? "140px" : "40px",
      }}
      onSubmit={handleSubmit}
    >
      <div className="add-user__top">
        <h3 className="add-user__header">Add user to room by id</h3>
        <button
          className="add-user__toggle-button"
          type="button"
          onClick={() => setOpen(!open)}
        >
          <Icon name={open ? "angle-up" : "angle-down"} type="fas" />
        </button>
      </div>
      <div
        style={{
          display: open ? "flex" : "none",
          flexDirection: "column",
          gap: "20px",
          width: "100%",
        }}
      >
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
      </div>
    </form>
  );
};
