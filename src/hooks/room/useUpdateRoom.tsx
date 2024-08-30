import { app } from "@/firebase/firebase";
import { getAuth } from "firebase/auth";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { useState } from "react";

export const useUpdateRoom = () => {
  const [loading, setLoading] = useState(false);
  const firestore = getFirestore(app);
  const auth = getAuth();
  const user = auth.currentUser;

  const updateRoom = async (
    roomId: string,
    roomName?: string,
    roomURL?: string
  ) => {
    if ((roomName && roomName.trim() === "") || !user) return;
    setLoading(true);
    roomName &&
      (await updateDoc(doc(firestore, "rooms", roomId), {
        name: roomName,
      }));

    roomURL &&
      (await updateDoc(doc(firestore, "rooms", roomId), {
        roomURL: roomURL,
      }));

    setLoading(false);
  };

  return { updateRoom, loading };
};
