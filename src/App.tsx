// src/App.tsx
import React, { useEffect, useState } from "react";
import { GoogleSignIn } from "./components/elements/googleSignIn/GoogleSignIn";
import { ChatRoom } from "./components/blocks/chatRoom/ChatRoom";
import { RoomList } from "./components/blocks/roomList/RoomList";
import { auth } from "./firebase/firebase";
import { User } from "firebase/auth";
import { Logout } from "./components/elements/logout/Logout";

export const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user: User | null) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    setUser(null);
    setCurrentRoomId(null);
    localStorage.clear(); // Clear local storage to ensure no cached state
  };

  return (
    <div>
      {user ? (
        <>
          <RoomList onRoomSelect={setCurrentRoomId} />
          {currentRoomId && <ChatRoom roomId={currentRoomId} />}
          <Logout onLogout={handleLogout} />
        </>
      ) : (
        <GoogleSignIn />
      )}
    </div>
  );
};
