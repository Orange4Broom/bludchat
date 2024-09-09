export interface ChatRoomProps {
  roomId: string;
  buttonText?: string;
  width?: string;
  openRoomList?: boolean;
  openFriendList?: boolean;
  setOpenRoomList?: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenFriendList?: React.Dispatch<React.SetStateAction<boolean>>;
}
