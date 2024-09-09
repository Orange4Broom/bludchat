import { useEffect, useState } from "react";
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
import { Icon } from "@elements/icon/Icon";

import { useToastify } from "@hooks/useToastify";

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
  const { notify } = useToastify();

  const [openRoomList, setOpenRoomList] = useState<boolean>(true);
  const [openFriendList, setOpenFriendList] = useState<boolean>(true);

  useEffect(() => {
    openChatWithNewestMessage();
  }, [user, openChatWithNewestMessage]);

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

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1200px)");

    const handleMediaQueryChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setOpenRoomList(false);
        setOpenFriendList(false);
      } else {
        setOpenRoomList(true);
        setOpenFriendList(true);
      }
    };

    if (mediaQuery.matches) {
      setOpenRoomList(false);
      setOpenFriendList(false);
    }

    mediaQuery.addEventListener("change", handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

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

      <div className="main">
        {user ? (
          <>
            <div className="main__rooms">
              <div>
                <CreateRoom />
                <RoomList onRoomSelect={setCurrentRoomId} />
              </div>
              <div className="main__rooms__user">
                <div className="main__rooms__user__info">
                  <img
                    className="main__rooms__user__image"
                    src={user.photoURL}
                    alt="profilePicture"
                  />
                  <div className="main__rooms__user__info__text">
                    <h2 className="main__rooms__user__name">
                      {user.displayName}
                    </h2>
                    <h2 className="main__rooms__user__uid">
                      {user.uid.substring(0, 16)}...
                      <button
                        className="main__rooms__user__uid__copy"
                        onClick={() => {
                          navigator.clipboard.writeText(user.uid);
                          notify("success", "Copied to clipboard");
                        }}
                      >
                        <Icon name="copy" type="fas" />{" "}
                      </button>
                    </h2>
                  </div>
                </div>
                <Logout onLogout={handleLogout} />
              </div>
            </div>

            <div className="main__chat">
              {currentRoomId && (
                <>
                  <ChatRoom
                    roomId={currentRoomId}
                    openRoomList={openRoomList}
                    openFriendList={openFriendList}
                    setOpenRoomList={setOpenRoomList}
                    setOpenFriendList={setOpenFriendList}
                  />
                </>
              )}
              {oneOnOneChatUser && <ChatRoom roomId={oneOnOneChatUser.uid} />}
            </div>
            <div className="main__friends">
              <AddFriend />
              <FriendList
                uid={currentUser.uid}
                displayName={currentUser.displayName || "Nameless User"}
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
