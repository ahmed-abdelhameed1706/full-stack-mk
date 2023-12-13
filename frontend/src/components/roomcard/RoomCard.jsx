// RoomCard.js
import React from 'react';
import './RoomCard.css';
import { useNavigate } from 'react-router-dom';

const RoomCard = ({ name, owner, users, createdAt, roomCode }) => {
  const navigate = useNavigate();

  const handleJoinRoom = () => {
    // Pass the entire room object to the navigate function
    navigate(`/room/${roomCode}`, { state: { name, owner, users, createdAt, roomCode } });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-2">{name}</h2>
      <p className="text-gray-600 mb-2">Owner: {owner}</p>
      <p className="text-gray-600 mb-2">Users: {users}</p>
      <p className="text-gray-600 mb-4">Created At: {createdAt}</p>
      
      {/* Add Join Now button with onClick event */}
      <button className="bn632-hover bn26 mx-auto block" onClick={handleJoinRoom}>
        Join Now
      </button>
    </div>
  );
};

export default RoomCard;
