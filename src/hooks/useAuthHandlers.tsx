import { useState } from "react";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  where,
} from "firebase/firestore";

interface User {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
}

export const useAuthHandlers = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const [oneOnOneChatUser, setOneOnOneChatUser] = useState<User | null>(null);
  const auth = getAuth();
  const firestore = getFirestore();

  const handleLogout = async () => {
    await auth.signOut();
    setUser(null);
    setCurrentRoomId(null);
    setOneOnOneChatUser(null);
    localStorage.clear();
  };

  const openChatWithNewestMessage = async () => {
    if (!user) return;

    const roomsRef = collection(firestore, "rooms");
    const roomsQuery = query(
      roomsRef,
      where("members", "array-contains", user.uid)
    );
    const roomsSnapshot = await getDocs(roomsQuery);
    let latestRoomId = null;
    let latestMessageTimestamp = 0;

    for (const roomDoc of roomsSnapshot.docs) {
      const messagesRef = collection(
        firestore,
        "rooms",
        roomDoc.id,
        "messages"
      );
      const messagesQuery = query(
        messagesRef,
        orderBy("createdAt", "desc"),
        limit(1)
      );
      const messagesSnapshot = await getDocs(messagesQuery);

      if (!messagesSnapshot.empty) {
        const latestMessage = messagesSnapshot.docs[0].data();
        const messageTimestamp = latestMessage.createdAt?.toMillis() || 0;

        if (messageTimestamp > latestMessageTimestamp) {
          latestMessageTimestamp = messageTimestamp;
          latestRoomId = roomDoc.id;
        }
      }
    }

    if (latestRoomId) {
      setCurrentRoomId(latestRoomId);
    }
  };

  return {
    user,
    setUser,
    currentRoomId,
    setCurrentRoomId,
    oneOnOneChatUser,
    setOneOnOneChatUser,
    handleLogout,
    openChatWithNewestMessage,
  };
};
