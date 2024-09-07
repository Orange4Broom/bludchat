import { useState } from "react";
import { getFirestore, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { useToastify } from "@hooks/useToastify";

export const useAddUserToRoom = (roomId: string) => {
  const [userId, setUserId] = useState("");
  const notify = useToastify().notify;

  const handleAddUser = async () => {
    const firestore = getFirestore();
    const roomRef = doc(firestore, "rooms", roomId);
    await updateDoc(roomRef, {
      members: arrayUnion(userId),
    });
    setUserId("");
    notify("success", "User added successfully");
  };

  return { handleAddUser, userId, setUserId };
};
