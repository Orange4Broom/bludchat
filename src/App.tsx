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
import { AddFriend } from "@blocks/friendList/AddFriend";
import { FriendList } from "@blocks/friendList/FriendList";
import { User } from "./typings/User";
import { Icon } from "@elements/icon/Icon";

import { useToastify } from "@hooks/useToastify";
import { RoomListModal } from "@elements/roomListModal/RoomListModal";
import { FriendListModal } from "@elements/friendListModal/FriendListModal";

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

  const [openRoomList, setOpenRoomList] = useState<boolean>(false);
  const [openFriendList, setOpenFriendList] = useState<boolean>(false);
  const [showRoomListButton, setShowRoomListButton] = useState<boolean>(false);
  const [showFriendListButton, setShowFriendListButton] =
    useState<boolean>(false);

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
        setShowRoomListButton(true);
        setShowFriendListButton(true);
      } else {
        setShowRoomListButton(false);
        setShowFriendListButton(false);
      }
    };

    if (mediaQuery.matches) {
      setShowRoomListButton(true);
      setShowFriendListButton(true);
    } else {
      setShowRoomListButton(false);
      setShowFriendListButton(false);
    }

    mediaQuery.addEventListener("change", handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  const handleRoomListModalClose = () => {
    setOpenRoomList(false);
    setShowRoomListButton(true);
  };

  const handleRoomListModalOpen = () => {
    setOpenRoomList(true);
    setShowRoomListButton(false);
  };

  const handleFriendListModalClose = () => {
    setOpenFriendList(false);
    setShowFriendListButton(true);
  };

  const handleFriendListModalOpen = () => {
    setOpenFriendList(true);
    setShowFriendListButton(false);
  };

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

      <RoomListModal
        setCurrentRoomId={setCurrentRoomId}
        openRoomList={openRoomList}
        onClose={handleRoomListModalClose}
      />
      <FriendListModal
        currentRoomId={currentRoomId}
        openFriendList={openFriendList}
        onClose={handleFriendListModalClose}
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
                    openRoomList={showRoomListButton}
                    openFriendList={showFriendListButton}
                    handleOpenRoomList={handleRoomListModalOpen}
                    handleOpenFriendList={handleFriendListModalOpen}
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
