export interface ChatRoomProps {
  roomId: string;
  buttonText?: string;
  width?: string;
  openRoomList?: boolean;
  openFriendList?: boolean;
  handleOpenRoomList?: () => void;
  handleOpenFriendList?: () => void;
  onDelete?: () => void;
}
