import React from "react";
import { useAddFriend } from "@/hooks/friends/useAddFriend";

import "./addFriends.scss";

export const AddFriend: React.FC = () => {
  const { friendId, setFriendId, addFriend, loading } = useAddFriend();

  return (
    <form className="addfriend" onSubmit={addFriend}>
      <h3 className="addfriend__header">Add Friend</h3>
      <input
        className="addfriend__input"
        type="text"
        value={friendId}
        onChange={(e) => setFriendId(e.target.value)}
        placeholder="Enter Friend ID"
      />
      <button className="addfriend__submit" type="submit" disabled={loading}>
        Add Friend
      </button>
    </form>
  );
};
