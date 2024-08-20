import { useEffect } from "react";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { auth } from "@fbase/firebase";

import { Logout } from "@elements/logout/Logout";
import { GoogleSignIn } from "@elements/googleSignIn/GoogleSignIn";
import { CreateRoom } from "@elements/createRoom/CreateRoom";

import { RoomList } from "@blocks/roomList/RoomList";
import { ChatRoom } from "@blocks/chatRoom/ChatRoom";
import { FriendList } from "@blocks/friendList/FriendList";
import { AddFriend } from "@blocks/friendList/AddFriend";

import { useAuthHandlers } from "@hooks/useAuthHandlers";
import { useChatRoomHandlers } from "@hooks/room/useChatRoomHandlers";

export const App = () => {
  const {
    user,
    setUser,
    currentRoomId,
    setCurrentRoomId,
    oneOnOneChatUser,
    handleLogout,
  } = useAuthHandlers();

  const { handleCloseChatRoom } = useChatRoomHandlers();

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
            uid={user.uid}
            displayName={user.displayName || "User"}
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
