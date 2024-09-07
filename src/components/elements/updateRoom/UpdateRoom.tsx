import { useFetchRoomInfo } from "@/hooks/room/useFetchRoomInfo";
import { useUpdateRoom } from "@/hooks/room/useUpdateRoom";
import { useState, useEffect } from "react";
import { Icon } from "@/components/elements/icon/Icon"; // Assuming you have an Icon component
import "./updateRoom.scss"; // Assuming you have a corresponding SCSS file for styling

interface UpdateRoomProps {
  roomId: string;
}

export const UpdateRoom: React.FC<UpdateRoomProps> = ({ roomId }) => {
  const [roomName, setRoomName] = useState("");
  const [roomFile, setRoomFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { updateRoom, loading: updateLoading } = useUpdateRoom();
  const { room } = useFetchRoomInfo(roomId);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    if (room) {
      setRoomName(room.name || "");
      setImagePreview((room.photoURL as unknown as string) || "");
    }
  }, [room]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setRoomFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleRemovePreview = () => {
    setRoomFile(null);
    setImagePreview(null);
  };

  const handleUpdateRoom = async (event: React.FormEvent) => {
    event.preventDefault();
    await updateRoom(roomId, roomName, roomFile);
    setRoomName("");
    setRoomFile(null);
    setImagePreview(null);
  };

  return (
    <div className="updateroom">
      <div className="updateroom__form__top">
        <h3 className="updateroom__form__header">Update room info</h3>
        <button
          className="updateroom__form__togglebutton"
          onClick={() => setOpen(!open)}
        >
          <Icon name={open ? "angle-up" : "angle-down"} type="fas" />
        </button>
      </div>
      <form
        className={`updateroom__form${open ? "" : "__closed"}`}
        style={{
          height: open ? "auto" : "20px",
        }}
        onSubmit={handleUpdateRoom}
      >
        <input
          className="updateroom__form__input"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="Room Name"
        />
        <label className="updateroom__form__file">
          <input
            type="file"
            id="fileInput"
            style={{ display: "none" }} // Hide the default file input
            onChange={handleFileChange} // Add your file change handler
          />
          <Icon name="paperclip" type="fas" />{" "}
          {/* Assuming you are using Font Awesome for the icon */}
          Choose a profile picture
        </label>
        {imagePreview && (
          <div className="roomimage__previews">
            <div className="roomimage__preview">
              <img src={imagePreview} alt="Preview" />
              <button
                type="button"
                onClick={handleRemovePreview}
                className="roomimage__preview__remove"
              >
                <Icon name="times" type="fas" />
              </button>
            </div>
          </div>
        )}
        <button
          className="updateroom__form__submit"
          type="submit"
          disabled={updateLoading}
        >
          {updateLoading ? "Updating..." : "Update Room"}
        </button>
      </form>
    </div>
  );
};
