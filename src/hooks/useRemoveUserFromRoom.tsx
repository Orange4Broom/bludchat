import { useState } from "react";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { auth } from "../firebase/firebase";
import { User } from "../typings/User";

export const useRemoveUserFromRoom = (
  roomId: string,
  setMembers: React.Dispatch<React.SetStateAction<User[]>>
) => {
  const [loading, setLoading] = useState(false);
  const firestore = getFirestore();
  const currentUser = auth.currentUser as User;

  const handleRemoveUserFromRoom = async (userId: string) => {
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
        (memberId: string) => memberId !== userId
      );

      await setDoc(roomRef, { members: updatedMembers }, { merge: true });

      setMembers((prevMembers) =>
        prevMembers.filter((member) => member.uid !== userId)
      );
    } catch (error) {
      console.error("Error removing user from room: ", error);
    } finally {
      setLoading(false);
    }
  };

  return { handleRemoveUserFromRoom, loading };
};
