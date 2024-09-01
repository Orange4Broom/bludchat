import { useEffect } from "react";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { auth } from "@fbase/firebase";

import { Logout } from "@elements/logout/Logout";
import { GoogleSignIn } from "@elements/googleSignIn/GoogleSignIn";
import { CreateRoom } from "@elements/createRoom/CreateRoom";

import { RoomList } from "@blocks/roomList/RoomList";
import { ChatRoom } from "@blocks/chatRoom/ChatRoom";

import { useAuthHandlers } from "@hooks/useAuthHandlers";
import { ToastContainer } from "react-toastify";
import { AddFriend } from "./components/blocks/friendList/AddFriend";
import { FriendList } from "./components/blocks/friendList/FriendList";
import { User } from "./typings/User";
import { useAddUserToRoom } from "@hooks/room/useAddUserToRoom";

export const App = () => {
  const {
    user,
    setUser,
    currentRoomId,
    setCurrentRoomId,
    oneOnOneChatUser,
    handleLogout,
    openChatWithNewestMessage,
  } = useAuthHandlers();
  const currentUser = auth.currentUser as User;
  const { handleAddUser } = useAddUserToRoom(currentRoomId || "");

  useEffect(() => {
    openChatWithNewestMessage();
  }, [user]);

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
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      <div>
        {user ? (
          <>
            <div>
              <CreateRoom />
              <RoomList onRoomSelect={setCurrentRoomId} />
              <h2>User: {user.displayName}</h2>
              <h2>User Id: {user.uid}</h2>
              <Logout onLogout={handleLogout} />
            </div>

            <div>
              {currentRoomId && (
                <>
                  <ChatRoom roomId={currentRoomId} />
                </>
              )}
              {oneOnOneChatUser && <ChatRoom roomId={oneOnOneChatUser.uid} />}
            </div>
            <div>
              <AddFriend />
              <FriendList
                uid={currentUser.uid}
                displayName={currentUser.displayName || "Nameless User"}
                onSelectFriend={handleAddUser}
                roomId={currentRoomId || ""}
              />
            </div>
          </>
        ) : (
          <GoogleSignIn />
        )}
      </div>
    </>
  );
};
