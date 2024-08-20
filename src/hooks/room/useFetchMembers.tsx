import { useState, useEffect } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { User } from "@typings/User";

export const useFetchMembers = (roomId: string) => {
  const [members, setMembers] = useState<User[]>([]);
  const [roomCreatorId, setRoomCreatorId] = useState<string | null>(null);
  const firestore = getFirestore();

  useEffect(() => {
    const fetchMembers = async () => {
      const roomRef = doc(firestore, "rooms", roomId);
      const roomDoc = await getDoc(roomRef);

      if (roomDoc.exists()) {
        const roomData = roomDoc.data();
        const memberIds = roomData?.members || [];
        setRoomCreatorId(roomData?.creatorId || null);

        const memberPromises = memberIds.map(async (memberId: string) => {
          const userRef = doc(firestore, "users", memberId);
          const userDoc = await getDoc(userRef);
          return { uid: memberId, ...userDoc.data() } as User;
        });

        const membersData = await Promise.all(memberPromises);
        setMembers(membersData);
      }
    };

    fetchMembers();
  }, [roomId, firestore]);

  return { members, roomCreatorId };
};
