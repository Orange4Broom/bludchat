import { CreateRoom } from "@elements/createRoom/CreateRoom";
import { RoomList } from "@blocks/roomList/RoomList";

import "./roomListModal.scss";
import "@/index.scss";

import { Logout } from "@elements/logout/Logout";
import { useAuthHandlers } from "@/hooks/useAuthHandlers";
import { useToastify } from "@/hooks/useToastify";
import { Icon } from "@elements/icon/Icon";
import { auth } from "@/firebase/firebase";
import { User } from "@/typings/User";

interface RoomListProps {
  setCurrentRoomId: (roomId: string | null) => void;
  openRoomList: boolean;
  onClose?: () => void;
}

export const RoomListModal: React.FC<RoomListProps> = ({
  setCurrentRoomId,
  openRoomList,
  onClose,
}) => {
  const currentUser = auth.currentUser as User;
  const { handleLogout } = useAuthHandlers();
  const { notify } = useToastify();
  return (
    <>
      <div
        className="overlay"
        style={{ display: openRoomList ? "flex" : "none" }}
      ></div>
      <div
        className="room-list"
        style={{
          display: openRoomList ? "flex" : "none",
          left: openRoomList ? "0" : "-100%",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
              padding: "10px 10px 0 0",
              width: "100%",
            }}
          >
            <button onClick={onClose} className="friend-list__close-button">
              <Icon name="xmark" type="fas" />
            </button>
          </div>

          <CreateRoom />
          <RoomList onRoomSelect={setCurrentRoomId} />
        </div>
        {currentUser && (
          <div className="main__rooms__user">
            <div className="main__rooms__user__info">
              <img
                className="main__rooms__user__image"
                src={currentUser.photoURL}
                alt="profilePicture"
              />
              <div className="main__rooms__user__info__text">
                <h2 className="main__rooms__user__name">
                  {currentUser.displayName}
                </h2>
                <h2 className="main__rooms__user__uid">
                  {currentUser.uid.substring(0, 16)}...
                  <button
                    className="main__rooms__user__uid__copy"
                    onClick={() => {
                      navigator.clipboard.writeText(currentUser.uid);
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
        )}
      </div>
    </>
  );
};
