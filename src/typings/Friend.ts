export interface FriendListProps {
  uid: string;
  displayName: string;
  onSelectFriend?: (userId: string) => void;
  roomId: string;
}
