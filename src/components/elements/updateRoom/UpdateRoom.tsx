import { useFetchRoomInfo } from "@/hooks/room/useFetchRoomInfo";
import { useUpdateRoom } from "@/hooks/room/useUpdateRoom";
import { useState, useEffect } from "react";

interface UpdateRoomProps {
  roomId: string;
}

export const UpdateRoom: React.FC<UpdateRoomProps> = ({ roomId }) => {
  const [roomName, setRoomName] = useState("");
  const [roomURL, setRoomURL] = useState("");
  const { updateRoom, loading: updateLoading } = useUpdateRoom();
  const { room } = useFetchRoomInfo(roomId);

  useEffect(() => {
    if (room) {
      setRoomName(room.name || "");
      setRoomURL((room.photoURL as unknown as string) || "");
    }
  }, [room]);

  const handleUpdateRoom = async (event: React.FormEvent) => {
    event.preventDefault();
    await updateRoom(roomId, roomName, roomURL);
    setRoomURL("");
  };

  return (
    <div>
      <form onSubmit={handleUpdateRoom}>
        <input
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="Room Name"
        />
        <input
          type="text"
          value={roomURL}
          onChange={(e) => setRoomURL(e.target.value)}
          placeholder="Enter link for room profile picture"
        />
        <button type="submit" disabled={updateLoading}>
          {updateLoading ? "Updating..." : "Update Room"}
        </button>
      </form>
    </div>
  );
};
