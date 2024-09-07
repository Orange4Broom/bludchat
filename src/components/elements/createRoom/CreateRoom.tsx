import React, { useState } from "react";
import { useCreateRoom } from "@hooks/room/useCreateRoom";
import { Icon } from "@/components/elements/icon/Icon"; // Assuming you have an Icon component

import "./createRoom.scss";

export const CreateRoom: React.FC = () => {
  const [roomName, setRoomName] = useState("");
  const [roomFile, setRoomFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { createRoom, loading } = useCreateRoom();
  const [open, setOpen] = useState<boolean>(false);

  const handleCreateRoom = (event: React.FormEvent) => {
    event.preventDefault();
    createRoom(roomName, roomFile);
    setRoomName("");
    setRoomFile(null);
    setImagePreview(null);
  };

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

  return (
    <div
      style={{
        height: open ? "auto" : "50px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: "10px",
          padding: "10px 10px 20px 10px",
        }}
      >
        <h3 className="createroom__title">Create Room</h3>
        <button
          className="createroom__togglebutton"
          onClick={() => setOpen(!open)}
        >
          <Icon name={open ? "angle-up" : "angle-down"} type="fas" />
        </button>
      </div>
      <form
        className={`createroom ${open ? "" : "createroom__closed"}`}
        onSubmit={handleCreateRoom}
      >
        <input
          className="createroom__name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="Room Name"
        />
        <label className="createroom__file">
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
        <button className="createroom__button" type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Room"}
        </button>
      </form>
    </div>
  );
};
