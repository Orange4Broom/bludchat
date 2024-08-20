import { useState } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { app } from "../firebase/firebase";
import { getAuth } from "firebase/auth";

export const useCreateRoom = () => {
  const [loading, setLoading] = useState(false);
  const firestore = getFirestore(app);
  const auth = getAuth();
  const user = auth.currentUser;

  const createRoom = async (roomName: string) => {
    if (roomName.trim() === "" || !user) return;
    setLoading(true);
    try {
      await addDoc(collection(firestore, "rooms"), {
        name: roomName,
        createdAt: new Date(),
        creatorId: user.uid,
        members: [user.uid],
      });
      alert("Room created successfully");
    } catch (error) {
      console.error("Error creating room: ", error);
      alert("Failed to create room");
    } finally {
      setLoading(false);
    }
  };

  return { createRoom, loading };
};
