import { useState } from "react";
import { getFirestore, doc, deleteDoc } from "firebase/firestore";
import { app } from "@fbase/firebase";
import { useToastify } from "../useToastify";

export const useDeleteRoom = () => {
  const [loading, setLoading] = useState(false);
  const firestore = getFirestore(app);
  const notify = useToastify().notify;

  const deleteRoom = async (roomId: string) => {
    setLoading(true);
    try {
      await deleteDoc(doc(firestore, "rooms", roomId));
      notify("success", "Room deleted successfully");
    } catch (error) {
      notify("error", "Error deleting room");
    } finally {
      setLoading(false);
    }
  };

  return { deleteRoom, loading };
};
