import React, { useState } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { app } from "../../../firebase/firebase";
import { getAuth } from "firebase/auth";

export const CreateRoom: React.FC = () => {
  const [roomName, setRoomName] = useState("");
  const firestore = getFirestore(app);
  const auth = getAuth();
  const user = auth.currentUser;

  const createRoom = async () => {
    if (roomName.trim() === "" || !user) return;
    try {
      await addDoc(collection(firestore, "rooms"), {
        name: roomName,
        createdAt: new Date(),
        creatorId: user.uid,
        members: [user.uid],
      });
      setRoomName("");
      alert("Room created successfully");
    } catch (error) {
      console.error("Error creating room: ", error);
      alert("Failed to create room");
    }
  };

  return (
    <div>
      <input
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        placeholder="Room Name"
      />
      <button onClick={createRoom}>Create Room</button>
    </div>
  );
};
