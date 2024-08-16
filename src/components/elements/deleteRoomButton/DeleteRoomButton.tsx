import React from "react";
import { getFirestore, doc, deleteDoc } from "firebase/firestore";
import { app } from "../../../firebase/firebase";

interface DeleteRoomButtonProps {
  roomId: string;
}

export const DeleteRoomButton: React.FC<DeleteRoomButtonProps> = ({
  roomId,
}) => {
  const firestore = getFirestore(app);

  const deleteRoom = async () => {
    try {
      await deleteDoc(doc(firestore, "rooms", roomId));
      alert("Room deleted successfully");
    } catch (error) {
      console.error("Error deleting room: ", error);
      alert("Failed to delete room");
    }
  };

  return <button onClick={deleteRoom}>Delete Room</button>;
};
