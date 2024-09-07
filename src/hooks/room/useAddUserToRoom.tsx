import { useState } from "react";
import { getFirestore, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { useToastify } from "@hooks/useToastify";

export const useAddUserToRoom = (roomId: string) => {
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const notify = useToastify().notify;

  const handleAddUser = async () => {
    setLoading(true);
    const firestore = getFirestore();
    const roomRef = doc(firestore, "rooms", roomId);
    await updateDoc(roomRef, {
      members: arrayUnion(userId),
    });
    setLoading(false);
    notify("success", "User added successfully");
  };

  return { handleAddUser, userId, setUserId, loading };
};
