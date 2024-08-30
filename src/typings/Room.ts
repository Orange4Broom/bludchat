export interface Room {
  photoURL(photoURL: string): unknown;
  id: string;
  name: string;
  createdAt: unknown;
  creatorId: string;
  members: string[];
  roomURL: string;
}

export interface RoomListProps {
  onRoomSelect: (roomId: string | null) => void;
}
