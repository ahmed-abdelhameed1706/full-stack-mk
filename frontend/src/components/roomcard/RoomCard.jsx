// RoomCard.js
import React from 'react';
import './RoomCard.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';


const RoomCard = ({ name, owner, users, createdAt, roomCode }) => {
  const navigate = useNavigate();


  const session_id = localStorage.getItem('session_id');
  const [user, setUser] = useState([]);
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/users/${session_id}`)
      .then((res) => {
        console.log(res.data);
        setUser(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);



  const joinRoom = () => {
    
    axios.get(`http://localhost:5000/api/rooms/${roomCode}`)
        .then((res) => {
            const room = res.data;
            console.log("room is " + room);
            console.log(room)
            console.log(user.rooms)
            if (user.rooms.some((r) => r.code === roomCode)) {
                console.log('User already in room');
                navigate(`/room/${roomCode}`);
                return;
            } else {
                console.log('User not in room');
                axios.put(`http://localhost:5000/api/room/${roomCode}`, {
                    user: user.id,
                })
                    .then((res) => {
                        console.log(res.data);
                        navigate(`/room/${roomCode}`);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        })
        .catch((err) => {
            console.log(err);
        });
}
  

  const handleJoinRoom = () => {
    // Pass the entire room object to the navigate function
    
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-2">{name}</h2>
      <p className="text-gray-600 mb-2">Owner: {owner}</p>
      <p className="text-gray-600 mb-2">Users: {users}</p>
      <p className="text-gray-600 mb-4">Created At: {createdAt}</p>
      
      {/* Add Join Now button with onClick event */}
      <button className="bn632-hover bn26 mx-auto block" onClick={joinRoom}>
        Join Now
      </button>
    </div>
  );
};

export default RoomCard;
