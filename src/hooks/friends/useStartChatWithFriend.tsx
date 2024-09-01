import { useState } from "react";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useToastify } from "@hooks/useToastify";

import { User } from "@typings/User";

export const useStartChatWithFriend = (uid: string, displayName: string) => {
  const [loading, setLoading] = useState(false);
  const firestore = getFirestore();
  const notify = useToastify().notify;

  const startChatWithFriend = async (friend: User) => {
    setLoading(true);
    try {
      const roomsRef = collection(firestore, "rooms");
      await addDoc(roomsRef, {
        name: `${friend.displayName} and ${displayName}`,
        creatorId: uid,
        members: [uid, friend.uid],
        createdAt: serverTimestamp(),
      });
      notify("success", "Chat room created successfully");
    } catch (error) {
      notify("error", "Failed to create chat room");
    } finally {
      setLoading(false);
    }
  };

  return { startChatWithFriend, loading };
};
