import { useState } from "react";
import { getFirestore, doc, updateDoc, arrayUnion } from "firebase/firestore";

export const useAddUserToRoom = (roomId: string) => {
  const [userId, setUserId] = useState("");

  const handleAddUser = async (id: string) => {
    if (!id) return;
    const firestore = getFirestore();
    const roomRef = doc(firestore, "rooms", roomId);
    await updateDoc(roomRef, {
      members: arrayUnion(id),
    });
    setUserId("");
  };

  return { handleAddUser, userId, setUserId };
};
