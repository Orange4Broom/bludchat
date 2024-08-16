import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  onSnapshot,
  DocumentData,
  QuerySnapshot,
  query,
  where,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { DeleteRoomButton } from "../../elements/deleteRoomButton/DeleteRoomButton";

interface RoomListProps {
  onRoomSelect: (roomId: string | null) => void;
}

interface Room {
  id: string;
  name: string;
  createdAt: unknown;
  creatorId: string;
  members: string[];
}

export const RoomList: React.FC<RoomListProps> = ({ onRoomSelect }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const firestore = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const roomsRef = collection(firestore, "rooms");
    const q = query(roomsRef, where("members", "array-contains", user.uid));
    const unsubscribe = onSnapshot(
      q,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const data = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as Room[];
        setRooms(data);
      }
    );

    return () => unsubscribe();
  }, [firestore, user]);

  return (
    <div>
      {rooms.map((room) => (
        <div key={room.id}>
          <button onClick={() => onRoomSelect(room.id)}>{room.name}</button>
          <DeleteRoomButton roomId={room.id} />
        </div>
      ))}
    </div>
  );
};
