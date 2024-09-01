import { useState } from "react";
import { getFirestore, doc, deleteDoc } from "firebase/firestore";
import { useToastify } from "@hooks/useToastify";

import { User } from "@typings/User";

export const useRemoveFriend = (uid: string) => {
  const [loading, setLoading] = useState(false);
  const firestore = getFirestore();
  const notify = useToastify().notify;

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
      notify("success", "Friend removed successfully");
    } catch (error) {
      notify("error", "Failed to remove friend");
    } finally {
      setLoading(false);
    }
  };

  return { removeFriend, loading };
};
