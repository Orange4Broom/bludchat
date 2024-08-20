import { useState } from "react";
import { getAuth } from "firebase/auth";

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

  const handleLogout = async () => {
    await auth.signOut();
    setUser(null);
    setCurrentRoomId(null);
    setOneOnOneChatUser(null);
    localStorage.clear();
  };

  return {
    user,
    setUser,
    currentRoomId,
    setCurrentRoomId,
    oneOnOneChatUser,
    setOneOnOneChatUser,
    handleLogout,
  };
};
