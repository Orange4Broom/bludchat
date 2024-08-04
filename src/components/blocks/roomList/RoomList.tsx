// src/components/RoomList.tsx
import React, { useState, useEffect } from "react";
import { firestore } from "../../../firebase/firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  serverTimestamp,
  DocumentData,
  QuerySnapshot,
} from "firebase/firestore";

interface RoomListProps {
  onRoomSelect: (roomId: string | null) => void;
}

interface Room {
  id: string;
  name: string;
  createdAt: unknown;
}

export const RoomList: React.FC<RoomListProps> = ({ onRoomSelect }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [newRoomName, setNewRoomName] = useState("");

  useEffect(() => {
    const roomsRef = collection(firestore, "rooms");
    const unsubscribe = onSnapshot(
      roomsRef,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const data = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as Room[];
        setRooms(data);
      }
    );

    return () => unsubscribe();
  }, []);

  const createRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(firestore, "rooms"), {
      name: newRoomName,
      createdAt: serverTimestamp(),
    });
    setNewRoomName("");
  };

  return (
    <div>
      <form onSubmit={createRoom}>
        <input
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
          placeholder="New room name"
        />
        <button type="submit">Create Room</button>
      </form>
      <>
        {rooms.map((room) => (
          <button key={room.id} onClick={() => onRoomSelect(room.name)}>
            {room.name}
          </button>
        ))}
      </>
    </div>
  );
};
