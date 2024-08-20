import { useEffect, useState } from "react";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { auth } from "./firebase/firebase"; // Adjust the import according to your project structure
import { CreateRoom } from "./components/elements/createRoom/CreateRoom";
import { RoomList } from "./components/blocks/roomList/RoomList";
import { ChatRoom } from "./components/blocks/chatRoom/ChatRoom";
import { Logout } from "./components/elements/logout/Logout";
import { GoogleSignIn } from "./components/elements/googleSignIn/GoogleSignIn";
import { User } from "firebase/auth"; // Import User type from Firebase
import { FriendList } from "./components/blocks/friendList/FriendList";
import { AddFriend } from "./components/blocks/friendList/AddFriend";

export const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const [oneOnOneChatUser, setOneOnOneChatUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user: User | null) => {
      if (user) {
        const db = getFirestore();
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
          await setDoc(userRef, {
            id: user.uid,
            name: user.displayName || "Anonymous",
            email: user.email,
          });
        }

        setUser(user);
      } else {
        setUser(null);
      }
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    setUser(null);
    setCurrentRoomId(null);
    setOneOnOneChatUser(null);
    localStorage.clear();
  };

  const handleCloseChatRoom = () => {
    setCurrentRoomId(null);
  };

  return (
    <div>
      {user ? (
        <>
          <p>CleanUp version</p>
          <h2>User: {user.displayName}</h2>
          <h2>User Id: {user.uid}</h2>
          <CreateRoom />
          <RoomList onRoomSelect={setCurrentRoomId} />
          {currentRoomId && (
            <>
              <button onClick={handleCloseChatRoom}>Close Chat Room</button>
              <ChatRoom roomId={currentRoomId} />
            </>
          )}
          {oneOnOneChatUser && <ChatRoom roomId={oneOnOneChatUser.uid} />}
          <FriendList
            inRoom={false}
            userId={user.uid}
            userName={user.displayName || "User"}
          />
          <AddFriend />
          <Logout onLogout={handleLogout} />
        </>
      ) : (
        <GoogleSignIn />
      )}
    </div>
  );
};
