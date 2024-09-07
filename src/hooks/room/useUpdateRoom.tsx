import { app } from "@/firebase/firebase";
import { getAuth } from "firebase/auth";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useState } from "react";
import { useToastify } from "@hooks/useToastify";

export const useUpdateRoom = () => {
  const [loading, setLoading] = useState(false);
  const firestore = getFirestore(app);
  const storage = getStorage(app);
  const auth = getAuth();
  const user = auth.currentUser;
  const notify = useToastify().notify;

  const updateRoom = async (
    roomId: string,
    roomName?: string,
    roomFile?: File | null
  ) => {
    if ((roomName && roomName.trim() === "") || !user) return;
    setLoading(true);

    try {
      let roomURL = null;
      if (roomFile) {
        const storageRef = ref(storage, `rooms/${roomId}/${roomFile.name}`);
        await uploadBytes(storageRef, roomFile);
        roomURL = await getDownloadURL(storageRef);
      }

      const roomData: { name?: string; roomURL?: string } = {};
      if (roomName) roomData.name = roomName;
      if (roomURL) roomData.roomURL = roomURL;

      await updateDoc(doc(firestore, "rooms", roomId), roomData);

      notify("success", "Room updated successfully");
    } catch (error) {
      notify("error", "Failed to update room");
    } finally {
      setLoading(false);
    }
  };

  return { updateRoom, loading };
};
