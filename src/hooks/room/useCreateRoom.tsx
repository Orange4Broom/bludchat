import { useState } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "@fbase/firebase";
import { useToastify } from "@hooks/useToastify";

export const useCreateRoom = () => {
  const [loading, setLoading] = useState(false);
  const firestore = getFirestore(app);
  const auth = getAuth();
  const storage = getStorage(app);
  const user = auth.currentUser;
  const notify = useToastify().notify;

  const createRoom = async (roomName: string, roomFile: File | null) => {
    if (roomName.trim() === "" || !user) return;
    setLoading(true);
    try {
      let roomURL =
        "https://firebasestorage.googleapis.com/v0/b/bludchat-604f0.appspot.com/o/files%2FwexAXtUq4yaKfq6WnyRfjLeJDvJ2%2FChat%20no%20profile.png?alt=media&token=e2b3f3da-71d6-4cee-bebd-f0a128c66a2e";

      if (roomFile) {
        const storageRef = ref(storage, `rooms/${user.uid}/${roomFile.name}`);
        await uploadBytes(storageRef, roomFile);
        roomURL = await getDownloadURL(storageRef);
      }

      await addDoc(collection(firestore, "rooms"), {
        name: roomName,
        createdAt: new Date(),
        creatorId: user.uid,
        members: [user.uid],
        roomURL: roomURL,
      });
      notify("success", "Room created successfully");
    } catch (error) {
      console.error("Error creating room: ", error);
      alert("Failed to create room");
    } finally {
      setLoading(false);
    }
  };

  return { createRoom, loading };
};
