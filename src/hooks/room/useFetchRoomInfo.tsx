import { app } from "@/firebase/firebase";
import { Room } from "@/typings/Room";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { useEffect, useState } from "react";

export const useFetchRoomInfo = (roomId: string) => {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const firestore = getFirestore(app);

  useEffect(() => {
    const fetchRoomInfo = async () => {
      try {
        const roomRef = doc(firestore, "rooms", roomId);
        const roomSnap = await getDoc(roomRef);
        if (roomSnap.exists()) {
          const roomData = roomSnap.data() as Room;
          setRoom(roomData);
        } else {
          console.error("Room does not exist");
        }
      } catch (error) {
        console.error("Error fetching room info: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomInfo();
  }, [firestore, roomId]);

  return { room, loading };
};
