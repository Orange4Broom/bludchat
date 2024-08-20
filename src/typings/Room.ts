export interface Room {
  id: string;
  name: string;
  createdAt: unknown;
  creatorId: string;
  members: string[];
}

export interface RoomListProps {
  onRoomSelect: (roomId: string | null) => void;
}
