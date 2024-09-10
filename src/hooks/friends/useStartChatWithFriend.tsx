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
        roomURL:
          "https://firebasestorage.googleapis.com/v0/b/bludchat-604f0.appspot.com/o/files%2FwexAXtUq4yaKfq6WnyRfjLeJDvJ2%2FChat%20no%20profile.png?alt=media&token=e2b3f3da-71d6-4cee-bebd-f0a128c66a2e",
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
