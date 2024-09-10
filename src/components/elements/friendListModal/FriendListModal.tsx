import { auth } from "@/firebase/firebase";
import { User } from "@/typings/User";
import { AddFriend } from "@blocks/friendList/AddFriend";
import { FriendList } from "@blocks/friendList/FriendList";

import "./friendListModal.scss";
import { Icon } from "@elements/icon/Icon";

interface FriendListModalProps {
  currentRoomId: string | null;
  openFriendList: boolean;
  onClose?: () => void;
}

export const FriendListModal: React.FC<FriendListModalProps> = ({
  currentRoomId,
  openFriendList,
  onClose,
}) => {
  const currentUser = auth.currentUser as User | null;

  if (!currentUser) {
    return null;
  }

  return (
    <>
      <div
        className="overlay"
        style={{ display: openFriendList ? "flex" : "none" }}
      ></div>
      <div
        className="friend-list"
        style={{
          display: openFriendList ? "flex" : "none",
          right: openFriendList ? "0" : "-100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            padding: "10px 0 0 10px",
            width: "100%",
          }}
        >
          <button onClick={onClose} className="friend-list__close-button">
            <Icon name="xmark" type="fas" />
          </button>
        </div>
        <AddFriend />
        <FriendList
          uid={currentUser.uid}
          displayName={currentUser.displayName}
          roomId={currentRoomId || ""}
        />
      </div>
    </>
  );
};
