import { useState } from "react";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { auth } from "@fbase/firebase";
import { User } from "@typings/User";
import { useToastify } from "@hooks/useToastify";

export const useRemoveUserFromRoom = (roomId: string) => {
  const [loading, setLoading] = useState(false);
  const firestore = getFirestore();
  const currentUser = auth.currentUser as User;
  const notify = useToastify().notify;

  const handleRemoveUserFromRoom = async (uId: string) => {
    if (!currentUser) {
      console.log("No user is authenticated");
      return;
    }

    setLoading(true);
    try {
      const roomRef = doc(firestore, "rooms", roomId);
      const roomDoc = await getDoc(roomRef);

      if (!roomDoc.exists()) {
        console.error("Room not found");
        return;
      }

      const roomData = roomDoc.data();
      const updatedMembers = roomData?.members.filter(
        (memberId: string) => memberId !== uId
      );

      await setDoc(roomRef, { members: updatedMembers }, { merge: true });
      notify("success", "User removed successfully");
    } catch (error) {
      notify("error", "Failed to remove user from room");
    } finally {
      setLoading(false);
    }
  };

  return { handleRemoveUserFromRoom, loading };
};
