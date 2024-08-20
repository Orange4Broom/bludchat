import React from "react";
import { FriendList } from "../friendList/FriendList";
import { AddFriend } from "../friendList/AddFriend";
import { auth } from "../../../firebase/firebase";

import { useAddUserToRoom } from "../../../hooks/useAddUserToRoom";

import { ChatRoomProps } from "../../../typings/ChatRoomProps";

export const AddUserToRoom: React.FC<ChatRoomProps> = ({ roomId }) => {
  const { handleAddUser, userId, setUserId } = useAddUserToRoom(roomId);
  const currentUser = auth.currentUser;

  if (!currentUser) {
    return <div>Please log in to add users to the room.</div>;
  }

  return (
    <div>
      <input
        type="text"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        placeholder="Enter user ID"
      />
      <button onClick={() => handleAddUser(userId)}>Add User</button>
      <FriendList
        uid={currentUser.uid}
        displayName={currentUser.displayName || "Nameless User"}
        onSelectFriend={handleAddUser}
        inRoom={true}
      />
      <AddFriend />
    </div>
  );
};
