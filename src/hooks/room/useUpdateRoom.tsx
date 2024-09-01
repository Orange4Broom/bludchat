import { app } from "@/firebase/firebase";
import { getAuth } from "firebase/auth";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { useToastify } from "@hooks/useToastify";

export const useUpdateRoom = () => {
  const [loading, setLoading] = useState(false);
  const firestore = getFirestore(app);
  const auth = getAuth();
  const user = auth.currentUser;
  const notify = useToastify().notify;

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

    notify("success", "Room updated successfully");
  };

  return { updateRoom, loading };
};
