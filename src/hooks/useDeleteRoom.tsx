import { useState } from "react";
import { getFirestore, doc, deleteDoc } from "firebase/firestore";
import { app } from "../firebase/firebase";

export const useDeleteRoom = () => {
  const [loading, setLoading] = useState(false);
  const firestore = getFirestore(app);

  const deleteRoom = async (roomId: string) => {
    setLoading(true);
    try {
      await deleteDoc(doc(firestore, "rooms", roomId));
      alert("Room deleted successfully");
    } catch (error) {
      console.error("Error deleting room: ", error);
      alert("Failed to delete room");
    } finally {
      setLoading(false);
    }
  };

  return { deleteRoom, loading };
};
