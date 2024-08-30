import { useEffect } from "react";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { auth } from "@fbase/firebase";

import { Logout } from "@elements/logout/Logout";
import { GoogleSignIn } from "@elements/googleSignIn/GoogleSignIn";
import { CreateRoom } from "@elements/createRoom/CreateRoom";

import { RoomList } from "@blocks/roomList/RoomList";
import { ChatRoom } from "@blocks/chatRoom/ChatRoom";

import { useAuthHandlers } from "@hooks/useAuthHandlers";

export const App = () => {
  const {
    user,
    setUser,
    currentRoomId,
    setCurrentRoomId,
    oneOnOneChatUser,
    handleLogout,
  } = useAuthHandlers();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const db = getFirestore();
        const userRef = doc(db, "users", firebaseUser.uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
          await setDoc(userRef, {
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName || "Anonymous",
            email: firebaseUser.email,
          });
        }

        setUser({
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName || "Anonymous",
          email: firebaseUser.email || "",
          photoURL: firebaseUser.photoURL || "",
        });
      } else {
        setUser(null);
      }
    });
    return unsubscribe;
  }, [setUser]);

  return (
    <div>
      {user ? (
        <>
          <h2>User: {user.displayName}</h2>
          <h2>User Id: {user.uid}</h2>
          <CreateRoom />
          <RoomList onRoomSelect={setCurrentRoomId} />

          {currentRoomId && (
            <>
              <ChatRoom roomId={currentRoomId} />
            </>
          )}
          {oneOnOneChatUser && <ChatRoom roomId={oneOnOneChatUser.uid} />}
          <Logout onLogout={handleLogout} />
        </>
      ) : (
        <GoogleSignIn />
      )}
    </div>
  );
};
