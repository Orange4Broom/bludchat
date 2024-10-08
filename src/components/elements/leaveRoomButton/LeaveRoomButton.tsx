import { arrayRemove, doc, getFirestore, updateDoc } from "firebase/firestore";

import "./leaveRoomButton.scss";

interface LeaveRoomButtonProps {
  uid: string;
  roomId: string;
}

export const LeaveRoomButton: React.FC<LeaveRoomButtonProps> = ({
  uid,
  roomId,
}) => {
  const firestore = getFirestore();
  const roomRef = doc(firestore, "rooms", roomId);
  const userRef = doc(firestore, "users", uid);

  const handleLeaveRoom = async () => {
    await updateDoc(roomRef, {
      members: arrayRemove(uid),
    });

    await updateDoc(userRef, {
      rooms: arrayRemove(roomId),
    });
  };

  return (
    <button className="leavebutton" onClick={handleLeaveRoom}>
      Leave Room
    </button>
  );
};
