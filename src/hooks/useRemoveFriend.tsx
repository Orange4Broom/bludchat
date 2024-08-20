import { useState } from "react";
import { getFirestore, doc, deleteDoc } from "firebase/firestore";

import { User } from "../typings/User";

export const useRemoveFriend = (uid: string) => {
  const [loading, setLoading] = useState(false);
  const firestore = getFirestore();

  const removeFriend = async (
    friendId: string,
    setFriends: React.Dispatch<React.SetStateAction<User[]>>
  ) => {
    setLoading(true);
    try {
      const friendRef = doc(firestore, "users", uid, "friends", friendId);
      await deleteDoc(friendRef);
      setFriends((prevFriends) =>
        prevFriends.filter((friend) => friend.uid !== friendId)
      );
      alert("Friend removed successfully");
    } catch (error) {
      console.error("Error removing friend: ", error);
      alert("Failed to remove friend");
    } finally {
      setLoading(false);
    }
  };

  return { removeFriend, loading };
};
