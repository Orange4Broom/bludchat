import React, { useState, useEffect } from "react";
import { auth } from "../../../firebase/firebase";
import { ChatRoomProps } from "../../../typings/ChatRoomProps";
import { User } from "../../../typings/User";
import { useFetchMembers } from "../../../hooks/useFetchMembers";
import { useFetchFriends } from "../../../hooks/useFetchFriends";
import { useRemoveUserFromRoom } from "../../../hooks/useRemoveUserFromRoom";
import { useAddRoomMemberToFriends } from "../../../hooks/useAddRoomMemberToFriends";

export const UsersRoomList: React.FC<ChatRoomProps> = ({ roomId }) => {
  const [friends, setFriends] = useState<string[]>([]);
  const [members, setMembers] = useState<User[]>([]);
  const { members: fetchedMembers, roomCreatorId } = useFetchMembers(roomId);
  const fetchedFriends = useFetchFriends();
  const { handleAddUserToRoom, loading: addLoading } =
    useAddRoomMemberToFriends(setFriends);
  const { handleRemoveUserFromRoom, loading: removeLoading } =
    useRemoveUserFromRoom(roomId, setMembers);
  const currentUser = auth.currentUser as User;

  useEffect(() => {
    setMembers(fetchedMembers);
  }, [fetchedMembers]);

  useEffect(() => {
    setFriends(fetchedFriends);
  }, [fetchedFriends]);

  return (
    <div>
      <h3>Room Members</h3>
      <ul>
        {members.map((member) => (
          <li key={member.uid}>
            <img
              src={member.photoURL}
              alt="profilePicture"
              style={{ height: "32px", width: "32px" }}
            />
            {member.displayName}
            {!friends.includes(member.uid) && member.uid !== currentUser.uid ? (
              <button
                onClick={() => handleAddUserToRoom(member.uid)}
                disabled={addLoading}
              >
                Add Friend
              </button>
            ) : (
              currentUser.uid === roomCreatorId &&
              member.uid !== currentUser.uid && (
                <button
                  onClick={() => handleRemoveUserFromRoom(member.uid)}
                  disabled={removeLoading}
                >
                  Remove user from room
                </button>
              )
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
