// RoomCard.js
import React from 'react';
import './RoomCard.css';
const RoomCard = ({ name, owner, users, createdAt }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-2">{name}</h2>
      <p className="text-gray-600 mb-2">Owner: {owner}</p>
      <p className="text-gray-600 mb-2">Users: {users}</p>
      <p className="text-gray-600 mb-4">Created At: {createdAt}</p>
      
      {/* Add Join Now button */}
      <button className="bn632-hover bn26 mx-auto block">
        Join Now
      </button>
    </div>
  );
};

export default RoomCard;
