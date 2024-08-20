import React from "react";
import { useAddFriend } from "@/hooks/friends/useAddFriend";

export const AddFriend: React.FC = () => {
  const { friendId, setFriendId, addFriend } = useAddFriend();

  return (
    <div>
      <h3>Add Friend</h3>
      <input
        type="text"
        value={friendId}
        onChange={(e) => setFriendId(e.target.value)}
        placeholder="Enter Friend ID"
      />
      <button onClick={addFriend}>Add Friend</button>
    </div>
  );
};
