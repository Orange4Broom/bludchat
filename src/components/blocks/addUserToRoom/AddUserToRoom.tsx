import React, { useState } from "react";
import { getFirestore, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { FriendList } from "../friendList/FriendList";
import { AddFriend } from "../friendList/AddFriend";
import { auth } from "../../../firebase/firebase";

import { ChatRoomProps } from "../../../typings/ChatRoomProps";

export const AddUserToRoom: React.FC<ChatRoomProps> = ({ roomId }) => {
  const [userId, setUserId] = useState("");
  const currentUser = auth.currentUser;

  const handleAddUser = async (id: string) => {
    if (!id) return;
    const firestore = getFirestore();
    const roomRef = doc(firestore, "rooms", roomId);
    await updateDoc(roomRef, {
      members: arrayUnion(id),
    });
    setUserId(""); // Clear the input field after adding the user
  };

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
